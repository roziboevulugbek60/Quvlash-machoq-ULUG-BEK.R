
// ============================================================
// QUVLASHMACHOQ — MULTIPLAYER SERVER
// Ishlab chiqaruvchi: ULUG'BEK.R
// Node.js + Express + Socket.IO
// ============================================================

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

const MAX_PLAYERS = 10;
const MIN_PLAYERS = 2;

const ROUND_TIME = 180; // 3 daqiqa


// ============================================================
// STATIC FILES
// ============================================================

app.use(express.static(__dirname));


// ============================================================
// ROOMS
// ============================================================

const rooms = new Map();


// ============================================================
// ROOM CODE
// ============================================================

function createRoomCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let code;

    do {
        code = "";

        for (let i = 0; i < 6; i++) {
            code += chars[
                Math.floor(Math.random() * chars.length)
            ];
        }

    } while (rooms.has(code));

    return code;
}


// ============================================================
// PLAYER ID
// ============================================================

function createPlayer(id, name) {

    return {
        id,
        name: name || "Player",

        x: 400,
        y: 300,

        vx: 0,
        vy: 0,

        skin: "default",

        coins: 0,

        isChaser: false,

        alive: true,

        speedBoost: false,

        jumpBoost: false,

        invisible: false,

        hiding: false,

        stats: {
            catches: 0,
            escapes: 0,
            rounds: 0
        }
    };
}


// ============================================================
// SEND ROOM STATE
// ============================================================

function sendRoomState(roomCode) {

    const room = rooms.get(roomCode);

    if (!room) return;

    const players = Array.from(
        room.players.values()
    );

    io.to(roomCode).emit("roomState", {
        roomCode,
        players,
        hostId: room.hostId,

        gameStarted: room.gameStarted,

        timeLeft: room.timeLeft
    });
}


// ============================================================
// START ROUND
// ============================================================

function startRound(roomCode) {

    const room = rooms.get(roomCode);

    if (!room) return;

    const players = Array.from(
        room.players.values()
    );

    if (players.length < MIN_PLAYERS) {

        io.to(roomCode).emit(
            "errorMessage",
            "O'yinni boshlash uchun kamida 2 ta o'yinchi kerak!"
        );

        return;
    }


    // Oldingi rollarni tozalash

    players.forEach(player => {

        player.isChaser = false;

        player.alive = true;

        player.hiding = false;

        player.invisible = false;

        player.x =
            150 +
            Math.random() * 700;

        player.y =
            120 +
            Math.random() * 400;
    });


    // Tasodifiy quvlovchi

    const chaser =
        players[
            Math.floor(
                Math.random() *
                players.length
            )
        ];

    chaser.isChaser = true;


    room.gameStarted = true;

    room.timeLeft = ROUND_TIME;

    room.startedAt = Date.now();


    io.to(roomCode).emit("gameStarted", {
        players,
        timeLeft: room.timeLeft
    });

    sendRoomState(roomCode);
}


// ============================================================
// END ROUND
// ============================================================

function endRound(roomCode, reason = "time") {

    const room = rooms.get(roomCode);

    if (!room) return;


    room.gameStarted = false;


    const players =
        Array.from(
            room.players.values()
        );


    const results = players.map(player => {

        return {
            id: player.id,
            name: player.name,

            catches: player.stats.catches,
            escapes: player.stats.escapes,

            coins: player.coins,

            wasChaser:
                player.isChaser
        };

    });


    io.to(roomCode).emit("roundEnded", {

        reason,

        results,

        message:
            reason === "time"
                ? "Vaqt tugadi!"
                : "Raund tugadi!"

    });


    // Statistikani yangilash

    players.forEach(player => {

        player.stats.rounds++;

        player.isChaser = false;

    });


    sendRoomState(roomCode);
}


// ============================================================
// COLLISION / TAG
// ============================================================

function checkTag(roomCode) {

    const room = rooms.get(roomCode);

    if (!room || !room.gameStarted)
        return;


    const players =
        Array.from(
            room.players.values()
        );


    const chaser =
        players.find(
            player => player.isChaser
        );


    if (!chaser)
        return;


    for (const player of players) {

        if (player.id === chaser.id)
            continue;


        if (player.invisible)
            continue;


        const dx =
            chaser.x - player.x;

        const dy =
            chaser.y - player.y;

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        // Tegish masofasi

        if (distance < 35) {

            // Eski quvlovchi qochuvchi bo'ladi

            chaser.isChaser = false;

            chaser.stats.escapes++;


            // Tegilgan o'yinchi quvlovchi bo'ladi

            player.isChaser = true;

            player.stats.catches++;


            io.to(roomCode).emit(
                "playerTagged",
                {
                    oldChaser: chaser.id,
                    newChaser: player.id
                }
            );


            break;
        }
    }
}


// ============================================================
// SOCKET.IO
// ============================================================

io.on("connection", socket => {

    console.log(
        "Player connected:",
        socket.id
    );


    // --------------------------------------------------------
    // CREATE ROOM
    // --------------------------------------------------------

    socket.on("createRoom", data => {

        const name =
            String(data?.name || "Player")
                .trim()
                .substring(0, 16);


        const roomCode =
            createRoomCode();


        const player =
            createPlayer(
                socket.id,
                name
            );


        const room = {

            code: roomCode,

            hostId: socket.id,

            players:
                new Map([
                    [socket.id, player]
                ]),

            gameStarted: false,

            timeLeft: ROUND_TIME,

            timer: null,

            startedAt: null
        };


        rooms.set(
            roomCode,
            room
        );


        socket.join(roomCode);


        socket.roomCode =
            roomCode;


        socket.emit(
            "roomCreated",
            {
                roomCode,
                player
            }
        );


        sendRoomState(
            roomCode
        );


        console.log(
            `Room created: ${roomCode}`
        );
    });


    // --------------------------------------------------------
    // JOIN ROOM
    // --------------------------------------------------------

    socket.on("joinRoom", data => {

        const roomCode =
            String(
                data?.roomCode || ""
            )
            .trim()
            .toUpperCase();


        const name =
            String(data?.name || "Player")
                .trim()
                .substring(0, 16);


        const room =
            rooms.get(roomCode);


        if (!room) {

            socket.emit(
                "errorMessage",
                "Bunday xona topilmadi!"
            );

            return;
        }


        if (
            room.players.size >=
            MAX_PLAYERS
        ) {

            socket.emit(
                "errorMessage",
                "Xona to'liq!"
            );

            return;
        }


        if (room.gameStarted) {

            socket.emit(
                "errorMessage",
                "Bu xona hozir o'yinda!"
            );

            return;
        }


        const player =
            createPlayer(
                socket.id,
                name
            );


        room.players.set(
            socket.id,
            player
        );


        socket.join(roomCode);

        socket.roomCode =
            roomCode;


        socket.emit(
            "joinedRoom",
            {
                roomCode,
                player
            }
        );


        io.to(roomCode).emit(
            "playerJoined",
            {
                player
            }
        );


        sendRoomState(
            roomCode
        );


        console.log(
            `${name} joined ${roomCode}`
        );
    });


    // --------------------------------------------------------
    // START GAME
    // --------------------------------------------------------

    socket.on("startGame", () => {

        const roomCode =
            socket.roomCode;


        const room =
            rooms.get(roomCode);


        if (!room)
            return;


        if (
            room.hostId !==
            socket.id
        ) {

            socket.emit(
                "errorMessage",
                "Faqat xona egasi o'yinni boshlashi mumkin!"
            );

            return;
        }


        startRound(
            roomCode
        );
    });


    // --------------------------------------------------------
    // PLAYER MOVEMENT
    // --------------------------------------------------------

    socket.on("playerMove", data => {

        const roomCode =
            socket.roomCode;


        const room =
            rooms.get(roomCode);


        if (!room || !room.gameStarted)
            return;


        const player =
            room.players.get(
                socket.id
            );


        if (!player)
            return;


        if (
            typeof data?.x !== "number" ||
            typeof data?.y !== "number"
        ) {
            return;
        }


        // Xarita chegaralari

        player.x =
            Math.max(
                30,
                Math.min(
                    1170,
                    data.x
                )
            );


        player.y =
            Math.max(
                30,
                Math.min(
                    670,
                    data.y
                )
            );


        player.vx =
            Number(data.vx) || 0;


        player.vy =
            Number(data.vy) || 0;


        player.hiding =
            Boolean(data.hiding);


        checkTag(
            roomCode
        );


        // Harakatni xonadagi barcha o'yinchilarga yuborish

        socket.to(roomCode).emit(
            "playerMoved",
            {
                id: socket.id,

                x: player.x,
                y: player.y,

                vx: player.vx,
                vy: player.vy,

                hiding: player.hiding,

                isChaser:
                    player.isChaser
            }
        );
    });


    // --------------------------------------------------------
    // USE POWER
    // --------------------------------------------------------

    socket.on("usePower", data => {

        const roomCode =
            socket.roomCode;


        const room =
            rooms.get(roomCode);


        if (!room)
            return;


        const player =
            room.players.get(
                socket.id
            );


        if (!player)
            return;


        const power =
            data?.power;


        if (power === "speed") {

            player.speedBoost = true;


            io.to(roomCode).emit(
                "powerActivated",
                {
                    id: player.id,
                    power: "speed"
                }
            );


            setTimeout(() => {

                player.speedBoost = false;

            }, 5000);
        }


        if (power === "jump") {

            player.jumpBoost = true;


            io.to(roomCode).emit(
                "powerActivated",
                {
                    id: player.id,
                    power: "jump"
                }
            );


            setTimeout(() => {

                player.jumpBoost = false;

            }, 5000);
        }


        if (power === "hide") {

            player.invisible = true;

            player.hiding = true;


            io.to(roomCode).emit(
                "powerActivated",
                {
                    id: player.id,
                    power: "hide"
                }
            );


            setTimeout(() => {

                player.invisible = false;

                player.hiding = false;

            }, 4000);
        }
    });


    // --------------------------------------------------------
    // BUY ITEM
    // --------------------------------------------------------

    socket.on("buyItem", data => {

        const player =
            rooms.get(
                socket.roomCode
            )?.players.get(
                socket.id
            );


        if (!player)
            return;


        const item =
            data?.item;


        const prices = {

            speed: 100,

            jump: 150,

            hide: 200,

            skin1: 300,

            skin2: 500

        };


        const price =
            prices[item];


        if (!price) {

            socket.emit(
                "errorMessage",
                "Noma'lum mahsulot!"
            );

            return;
        }


        if (
            player.coins <
            price
        ) {

            socket.emit(
                "errorMessage",
                "Coin yetarli emas!"
            );

            return;
        }


        player.coins -= price;


        socket.emit(
            "itemBought",
            {
                item,
                coins:
                    player.coins
            }
        );


        sendRoomState(
            socket.roomCode
        );
    });


    // --------------------------------------------------------
    // PAUSE
    // --------------------------------------------------------

    socket.on("pauseGame", () => {

        const room =
            rooms.get(
                socket.roomCode
            );


        if (!room)
            return;


        if (
            room.hostId !==
            socket.id
        )
            return;


        room.paused =
            !room.paused;


        io.to(
            socket.roomCode
        ).emit(
            "gamePaused",
            {
                paused:
                    room.paused
            }
        );
    });


    // --------------------------------------------------------
    // LEAVE ROOM
    // --------------------------------------------------------

    socket.on("leaveRoom", () => {

        leaveRoom(
            socket
        );

    });


    // --------------------------------------------------------
    // DISCONNECT
    // --------------------------------------------------------

    socket.on("disconnect", () => {

        console.log(
            "Player disconnected:",
            socket.id
        );


        leaveRoom(
            socket
        );
    });

});


// ============================================================
// LEAVE ROOM FUNCTION
// ============================================================

function leaveRoom(socket) {

    const roomCode =
        socket.roomCode;


    if (!roomCode)
        return;


    const room =
        rooms.get(roomCode);


    if (!room)
        return;


    room.players.delete(
        socket.id
    );


    socket.leave(
        roomCode
    );


    io.to(roomCode).emit(
        "playerLeft",
        {
            id: socket.id
        }
    );


    // Xona egasi chiqib ketsa,
    // boshqa o'yinchiga beriladi

    if (
        room.hostId ===
        socket.id
    ) {

        const nextPlayer =
            room.players.values()
                .next()
                .value;


        if (nextPlayer) {

            room.hostId =
                nextPlayer.id;


            io.to(roomCode).emit(
                "newHost",
                {
                    hostId:
                        room.hostId
                }
            );

        }

    }


    // Xona bo'sh bo'lsa o'chirish

    if (
        room.players.size === 0
    ) {

        if (room.timer) {

            clearInterval(
                room.timer
            );

        }


        rooms.delete(
            roomCode
        );


        console.log(
            `Room deleted: ${roomCode}`
        );

        return;
    }


    sendRoomState(
        roomCode
    );
}


// ============================================================
// GAME TIMER
// ============================================================

setInterval(() => {

    for (
        const [
            roomCode,
            room
        ] of rooms
    ) {

        if (
            !room.gameStarted ||
            room.paused
        ) {
            continue;
        }


        room.timeLeft--;


        io.to(roomCode).emit(
            "timeUpdate",
            {
                timeLeft:
                    room.timeLeft
            }
        );


        if (
            room.timeLeft <= 0
        ) {

            endRound(
                roomCode,
                "time"
            );

        }

    }

}, 1000);


// ============================================================
// HEALTH CHECK
// ============================================================

app.get("/api/status", (req, res) => {

    res.json({

        online: true,

        game:
            "QUVLASHMACHOQ",

        producer:
            "ULUG'BEK.R",

        rooms:
            rooms.size,

        players:
            Array.from(
                rooms.values()
            )
            .reduce(
                (total, room) =>
                    total +
                    room.players.size,
                0
            )

    });

});


// ============================================================
// START SERVER
// ============================================================

server.listen(
    PORT,
    () => {

        console.log("");
        console.log(
            "======================================"
        );

        console.log(
            "  QUVLASHMACHOQ SERVER"
        );

        console.log(
            "  ULUG'BEK.R"
        );

        console.log(
            "======================================"
        );

        console.log(
            `Server: http://localhost:${PORT}`
        );

        console.log(
            "2-10 player multiplayer server READY!"
        );

        console.log(
            "======================================"
        );

    }
);

