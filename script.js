
/* =====================================================
   QUVLASHMACHOQ ONLINE
   ULUG'BEK.R
===================================================== */

"use strict";

/* =====================================================
   ELEMENTLAR
===================================================== */

const $ = (id) => document.getElementById(id);

const mainMenu = $("mainMenu");
const roomLobby = $("roomLobby");
const shopScreen = $("shopScreen");
const statsScreen = $("statsScreen");
const gameScreen = $("gameScreen");

const playerNameInput = $("playerName");
const roomCodeInput = $("roomCodeInput");

const createRoomBtn = $("createRoomBtn");
const joinRoomBtn = $("joinRoomBtn");
const startGameBtn = $("startGameBtn");
const leaveRoomBtn = $("leaveRoomBtn");

const shopBtn = $("shopBtn");
const statsBtn = $("statsBtn");
const settingsBtn = $("settingsBtn");

const closeShopBtn = $("closeShopBtn");
const closeStatsBtn = $("closeStatsBtn");

const copyRoomBtn = $("copyRoomBtn");

const roomCodeDisplay = $("roomCodeDisplay");
const gameRoomCode = $("gameRoomCode");

const playerCount = $("playerCount");
const playersList = $("playersList");

const shopItems = $("shopItems");
const shopCoins = $("shopCoins");

const pauseBtn = $("pauseBtn");
const pauseOverlay = $("pauseOverlay");
const resumeBtn = $("resumeBtn");
const pauseShopBtn = $("pauseShopBtn");
const pauseExitBtn = $("pauseExitBtn");

const roundResult = $("roundResult");
const nextRoundBtn = $("nextRoundBtn");

const gameCanvas = $("gameCanvas");
const ctx = gameCanvas.getContext("2d");

const gameTimer = $("gameTimer");
const roleBadge = $("roleBadge");
const gamePlayerName = $("gamePlayerName");
const gamePlayerCount = $("gamePlayerCount");

const gameMessage = $("gameMessage");

const mobileControls = $("mobileControls");
const joystickBase = $("joystickBase");
const joystickStick = $("joystickStick");

const jumpBtn = $("jumpBtn");
const runBtn = $("runBtn");
const hideBtn = $("hideBtn");

const notification = $("notification");
const notificationIcon = $("notificationIcon");
const notificationText = $("notificationText");

const connectionDot = $("connectionDot");
const connectionText = $("connectionText");

const loadingScreen = $("loadingScreen");
const loadingProgress = $("loadingProgress");
const loadingText = $("loadingText");


/* =====================================================
   O'YIN HOLATI
===================================================== */

const state = {

    player: {
        id: randomId(),
        name: "O'yinchi",

        x: 200,
        y: 200,

        speed: 180,

        skin: "default",

        role: "runner",

        hidden: false,

        jumping: false,

        running: false
    },

    players: [],

    roomCode: null,

    isHost: false,

    gameStarted: false,

    paused: false,

    round: 1,

    roundTime: 180,

    timeLeft: 180,

    coins: 500,

    lastTime: 0,

    animationId: null,

    keys: {},

    joystick: {
        active: false,
        x: 0,
        y: 0
    },

    gadgets: {
        jump: true,
        speed: true,
        hide: true
    },

    stats: {
        games: 0,
        wins: 0,
        caught: 0,
        escapes: 0
    }
};


/* =====================================================
   SHOP MA'LUMOTLARI
===================================================== */

const shop = {

    skins: [

        {
            id: "default",
            name: "Classic",
            icon: "👤",
            price: 0,
            color: "#36d66d"
        },

        {
            id: "blue",
            name: "Blue",
            icon: "🔵",
            price: 100,
            color: "#268cff"
        },

        {
            id: "red",
            name: "Red",
            icon: "🔴",
            price: 150,
            color: "#ff3c3c"
        },

        {
            id: "gold",
            name: "Gold",
            icon: "🟡",
            price: 300,
            color: "#ffd43b"
        },

        {
            id: "purple",
            name: "Shadow",
            icon: "🟣",
            price: 500,
            color: "#9d54ff"
        }
    ],

    gadgets: [

        {
            id: "jump",
            name: "Super Sakrash",
            icon: "🦘",
            price: 250,
            description: "Balandroq sakrash"
        },

        {
            id: "speed",
            name: "Turbo",
            icon: "⚡",
            price: 300,
            description: "Tezroq yugurish"
        },

        {
            id: "hide",
            name: "Berkinish",
            icon: "🫥",
            price: 350,
            description: "Qisqa vaqt ko'rinmaslik"
        }
    ],

    clothes: [

        {
            id: "cap",
            name: "Kepka",
            icon: "🧢",
            price: 120
        },

        {
            id: "hoodie",
            name: "Hoodie",
            icon: "🥷",
            price: 250
        },

        {
            id: "crown",
            name: "Toj",
            icon: "👑",
            price: 500
        }
    ]
};


let ownedItems = [
    "default"
];

let currentCategory = "skins";


/* =====================================================
   MAP
===================================================== */

const map = {

    width: 1200,
    height: 700,

    walls: [

        {
            x: 0,
            y: 0,
            width: 1200,
            height: 25
        },

        {
            x: 0,
            y: 675,
            width: 1200,
            height: 25
        },

        {
            x: 0,
            y: 0,
            width: 25,
            height: 700
        },

        {
            x: 1175,
            y: 0,
            width: 25,
            height: 700
        },

        {
            x: 270,
            y: 120,
            width: 230,
            height: 30
        },

        {
            x: 700,
            y: 120,
            width: 230,
            height: 30
        },

        {
            x: 270,
            y: 550,
            width: 230,
            height: 30
        },

        {
            x: 700,
            y: 550,
            width: 230,
            height: 30
        },

        {
            x: 570,
            y: 220,
            width: 60,
            height: 260
        }

    ],

    hidingSpots: [

        {
            x: 100,
            y: 90,
            width: 90,
            height: 70
        },

        {
            x: 1000,
            y: 90,
            width: 90,
            height: 70
        },

        {
            x: 100,
            y: 520,
            width: 90,
            height: 70
        },

        {
            x: 1000,
            y: 520,
            width: 90,
            height: 70
        }

    ],

    coins: []
};


/* =====================================================
   COINLAR
===================================================== */

function createCoins() {

    map.coins = [];

    const positions = [

        [220, 330],
        [380, 230],
        [480, 430],
        [690, 330],
        [810, 230],
        [960, 430],
        [350, 500],
        [850, 500]

    ];

    positions.forEach((p, index) => {

        map.coins.push({

            id: index,

            x: p[0],

            y: p[1],

            collected: false

        });

    });
}


/* =====================================================
   RANDOM ID
===================================================== */

function randomId() {

    return (
        Math.random()
            .toString(36)
            .substring(2, 10)
    ).toUpperCase();
}


/* =====================================================
   ROOM CODE
===================================================== */

function createRoomCode() {

    const chars =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let code = "";

    for (let i = 0; i < 6; i++) {

        code +=
            chars[
                Math.floor(
                    Math.random() *
                    chars.length
                )
            ];
    }

    return code;
}


/* =====================================================
   LOCAL STORAGE
===================================================== */

function saveData() {

    const data = {

        name: state.player.name,

        coins: state.coins,

        stats: state.stats,

        ownedItems,

        skin: state.player.skin

    };

    localStorage.setItem(
        "ULUGBEK_R_TAG_GAME",
        JSON.stringify(data)
    );
}


function loadData() {

    const raw =
        localStorage.getItem(
            "ULUGBEK_R_TAG_GAME"
        );

    if (!raw) return;

    try {

        const data =
            JSON.parse(raw);

        state.player.name =
            data.name ||
            "O'yinchi";

        state.coins =
            Number(data.coins) || 500;

        state.stats =
            data.stats || state.stats;

        ownedItems =
            data.ownedItems || ["default"];

        state.player.skin =
            data.skin || "default";

    } catch (error) {

        console.warn(
            "Save yuklanmadi",
            error
        );

    }
}


/* =====================================================
   SCREEN ALMASHTIRISH
===================================================== */

function showScreen(screen) {

    [
        mainMenu,
        roomLobby,
        shopScreen,
        statsScreen
    ].forEach((item) => {

        if (item) {
            item.classList.add("hidden");
        }

    });

    if (screen) {
        screen.classList.remove("hidden");
    }
}


/* =====================================================
   ISM
===================================================== */

function getPlayerName() {

    const value =
        playerNameInput.value.trim();

    if (!value) {

        showNotification(
            "⚠️",
            "Avval ismingizni yozing!"
        );

        playerNameInput.focus();

        return null;
    }

    return value.substring(0, 16);
}


/* =====================================================
   ROOM YARATISH
===================================================== */

createRoomBtn.addEventListener(
    "click",
    () => {

        const name =
            getPlayerName();

        if (!name) return;

        state.player.name = name;

        state.roomCode =
            createRoomCode();

        state.isHost = true;

        enterLobby();

        /*
         * Keyin WebSocket serverga:
         * createRoom(roomCode)
         * yuboriladi.
         */

    }
);


/* =====================================================
   ROOMGA KIRISH
===================================================== */

joinRoomBtn.addEventListener(
    "click",
    () => {

        const name =
            getPlayerName();

        if (!name) return;


        const code =
            roomCodeInput.value
                .trim()
                .toUpperCase();


        if (code.length !== 6) {

            showNotification(
                "⚠️",
                "Room kodi 6 ta belgidan iborat!"
            );

            return;
        }


        state.player.name = name;

        state.roomCode = code;

        state.isHost = false;

        enterLobby();

    }
);


/* =====================================================
   LOBBY
===================================================== */

function enterLobby() {

    showScreen(roomLobby);

    roomCodeDisplay.textContent =
        state.roomCode;

    gameRoomCode.textContent =
        state.roomCode;


    /*
     * Demo uchun o'zimizni qo'shamiz.
     * Haqiqiy multiplayerda bu ma'lumot
     * serverdan keladi.
     */

    state.players = [

        {
            id: state.player.id,

            name: state.player.name,

            role: "runner",

            color:
                getSkinColor()
        }

    ];


    updateLobby();

    setConnection(
        true,
        "Roomga ulandi"
    );


    /*
     * Host bo'lsa Start tugmasi
     * serverdagi playerlar soniga qarab
     * yoqiladi.
     */

    if (state.isHost) {

        startGameBtn.disabled = false;

    }
}


/* =====================================================
   LOBBY UPDATE
===================================================== */

function updateLobby() {

    playersList.innerHTML = "";

    state.players.forEach(
        (player, index) => {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "player-item";


            const avatar =
                document.createElement(
                    "div"
                );

            avatar.className =
                "player-avatar";

            avatar.textContent =
                index === 0
                    ? "👑"
                    : "👤";


            const info =
                document.createElement(
                    "div"
                );

            info.className =
                "player-info";

            info.innerHTML = `

                <strong>
                    ${escapeHTML(player.name)}
                </strong>

                <small>
                    ${
                        index === 0
                            ? "ROOM HOST"
                            : "O'YINCHI"
                    }
                </small>

            `;


            item.appendChild(avatar);

            item.appendChild(info);

            playersList.appendChild(item);

        }
    );


    playerCount.textContent =
        `${state.players.length}/10`;

    gamePlayerCount.textContent =
        `${state.players.length}/10`;
}


/* =====================================================
   START GAME
===================================================== */

startGameBtn.addEventListener(
    "click",
    () => {

        if (!state.roomCode) return;


        if (
            state.isHost &&
            state.players.length < 2
        ) {

            /*
             * Demo rejimida test qilish
             * uchun bot o'yinchi qo'shamiz.
             */

            addDemoPlayers();
        }


        startRound();

    }
);


/* =====================================================
   DEMO PLAYERLAR
===================================================== */

function addDemoPlayers() {

    const names = [
        "Ali",
        "Bek",
        "Sardor",
        "Jasur",
        "Aziz",
        "Temur",
        "Rustam",
        "Diyor",
        "Bobur"
    ];


    const count =
        2 +
        Math.floor(
            Math.random() * 4
        );


    state.players = [

        {
            id: state.player.id,

            name: state.player.name,

            role: "runner",

            x: 200,

            y: 200,

            color: getSkinColor(),

            hidden: false

        }

    ];


    for (
        let i = 1;
        i < count;
        i++
    ) {

        state.players.push({

            id: randomId(),

            name:
                names[
                    (i - 1) %
                    names.length
                ],

            role: "runner",

            x:
                150 +
                Math.random() * 850,

            y:
                100 +
                Math.random() * 500,

            color:
                randomColor(),

            hidden: false

        });

    }


    /*
     * Birinchi o'yinchi quvlovchi.
     */

    const chaserIndex =
        Math.floor(
            Math.random() *
            state.players.length
        );


    state.players[
        chaserIndex
    ].role = "chaser";


    if (
        state.players[
            chaserIndex
        ].id === state.player.id
    ) {

        state.player.role =
            "chaser";

    } else {

        state.player.role =
            "runner";
    }


    updateLobby();
}


/* =====================================================
   ROUND START
===================================================== */

function startRound() {

    showScreen(gameScreen);

    gameScreen.classList.remove(
        "hidden"
    );


    state.gameStarted = true;

    state.paused = false;

    state.timeLeft =
        state.roundTime;


    state.player.x = 200;

    state.player.y = 350;


    gamePlayerName.textContent =
        state.player.name;


    updateRoleBadge();

    createCoins();

    hidePause();

    roundResult.classList.add(
        "hidden"
    );


    mobileControls.style.display =
        "flex";


    state.lastTime =
        performance.now();


    cancelAnimationFrame(
        state.animationId
    );


    state.animationId =
        requestAnimationFrame(
            gameLoop
        );


    showNotification(
        "🎮",
        "O'yin boshlandi!"
    );
}


/* =====================================================
   GAME LOOP
===================================================== */

function gameLoop(timestamp) {

    if (!state.gameStarted) {
        return;
    }


    const dt =
        Math.min(
            (timestamp -
                state.lastTime) /
                1000,

            0.05
        );


    state.lastTime =
        timestamp;


    if (!state.paused) {

        update(dt);

        draw();

    }


    state.animationId =
        requestAnimationFrame(
            gameLoop
        );
}


/* =====================================================
   UPDATE
===================================================== */

function update(dt) {

    updateTimer(dt);

    updatePlayer(dt);

    updateDemoPlayers(dt);

    checkCoinCollection();

    checkCatch();

}


/* =====================================================
   TIMER
===================================================== */

function updateTimer(dt) {

    state.timeLeft -= dt;


    if (
        state.timeLeft < 0
    ) {

        state.timeLeft = 0;

    }


    const totalSeconds =
        Math.ceil(
            state.timeLeft
        );


    const minutes =
        Math.floor(
            totalSeconds / 60
        );

    const seconds =
        totalSeconds % 60;


    gameTimer.textContent =
        `${String(minutes).padStart(2, "0")}:` +
        `${String(seconds).padStart(2, "0")}`;


    if (
        state.timeLeft <= 0
    ) {

        endRound();

    }
}


/* =====================================================
   PLAYER UPDATE
===================================================== */

function updatePlayer(dt) {

    let dx = 0;

    let dy = 0;


    if (state.keys["w"] ||
        state.keys["arrowup"]) {

        dy -= 1;
    }


    if (state.keys["s"] ||
        state.keys["arrowdown"]) {

        dy += 1;
    }


    if (state.keys["a"] ||
        state.keys["arrowleft"]) {

        dx -= 1;
    }


    if (state.keys["d"] ||
        state.keys["arrowright"]) {

        dx += 1;
    }


    dx += state.joystick.x;

    dy += state.joystick.y;


    const length =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    if (length > 0) {

        dx /= length;

        dy /= length;

    }


    let speed =
        state.player.speed;


    if (state.player.running) {

        speed *= 1.65;

    }


    if (state.player.hidden) {

        speed *= 0.65;

    }


    if (state.player.jumping) {

        speed *= 1.15;

    }


    const newX =
        state.player.x +
        dx *
        speed *
        dt;


    const newY =
        state.player.y +
        dy *
        speed *
        dt;


    if (
        canMoveTo(
            newX,
            state.player.y
        )
    ) {

        state.player.x =
            newX;

    }


    if (
        canMoveTo(
            state.player.x,
            newY
        )
    ) {

        state.player.y =
            newY;

    }
}


/* =====================================================
   MOVE COLLISION
===================================================== */

function canMoveTo(x, y) {

    const radius = 18;


    if (
        x < 45 ||
        x > 1155 ||
        y < 45 ||
        y > 655
    ) {

        return false;

    }


    for (
        const wall of map.walls
    ) {

        if (
            circleRectCollision(
                x,
                y,
                radius,
                wall
            )
        ) {

            return false;

        }

    }


    return true;
}


/* =====================================================
   CIRCLE / RECT COLLISION
===================================================== */

function circleRectCollision(
    cx,
    cy,
    radius,
    rect
) {

    const closestX =
        Math.max(
            rect.x,
            Math.min(
                cx,
                rect.x +
                rect.width
            )
        );


    const closestY =
        Math.max(
            rect.y,
            Math.min(
                cy,
                rect.y +
                rect.height
            )
        );


    const dx =
        cx - closestX;

    const dy =
        cy - closestY;


    return (
        dx * dx +
        dy * dy <
        radius * radius
    );
}


/* =====================================================
   DEMO PLAYER AI
===================================================== */

function updateDemoPlayers(dt) {

    for (
        const player of state.players
    ) {

        if (
            player.id ===
            state.player.id
        ) {

            continue;

        }


        if (
            typeof player.x !==
            "number"
        ) {

            player.x =
                200 +
                Math.random() *
                800;

            player.y =
                100 +
                Math.random() *
                500;
        }


        let targetX =
            player.x;

        let targetY =
            player.y;


        if (
            player.role ===
            "chaser"
        ) {

            targetX =
                state.player.x;

            targetY =
                state.player.y;

        } else {

            /*
             * Qochuvchi AI:
             * quvlovchidan uzoqlashadi.
             */

            const chaser =
                state.players.find(
                    p =>
                        p.role ===
                        "chaser"
                );


            if (chaser) {

                const dx =
                    player.x -
                    chaser.x;

                const dy =
                    player.y -
                    chaser.y;


                const len =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );


                if (len > 0) {

                    targetX =
                        player.x +
                        (dx / len) *
                        100;

                    targetY =
                        player.y +
                        (dy / len) *
                        100;
                }
            }
        }


        const dx =
            targetX -
            player.x;

        const dy =
            targetY -
            player.y;

        const len =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (len > 5) {

            const aiSpeed =
                65 *
                dt;


            player.x +=
                (dx / len) *
                aiSpeed;

            player.y +=
                (dy / len) *
                aiSpeed;
        }


        player.x =
            Math.max(
                45,
                Math.min(
                    1155,
                    player.x
                )
            );

        player.y =
            Math.max(
                45,
                Math.min(
                    655,
                    player.y
                )
            );
    }
}


/* =====================================================
   CATCH
===================================================== */

function checkCatch() {

    if (
        state.player.hidden
    ) {

        return;
    }


    const chaser =
        state.player.role ===
        "chaser";


    if (chaser) {

        for (
            const player of
            state.players
        ) {

            if (
                player.id ===
                state.player.id
            ) {

                continue;
            }


            if (
                player.role !==
                "runner"
            ) {

                continue;
            }


            const distance =
                distanceBetween(
                    state.player,
                    player
                );


            if (
                distance < 40
            ) {

                player.role =
                    "chaser";

                state.player.role =
                    "runner";


                state.stats.caught++;

                updateRoleBadge();


                showNotification(
                    "✋",
                    `${player.name} ushlandi!`
                );

            }
        }


    } else {

        const enemy =
            state.players.find(
                p =>
                    p.role ===
                    "chaser"
            );


        if (!enemy) return;


        const distance =
            distanceBetween(
                state.player,
                enemy
            );


        if (
            distance < 40
        ) {

            state.player.role =
                "chaser";

            enemy.role =
                "runner";


            state.stats.escapes++;


            updateRoleBadge();


            showNotification(
                "😱",
                "Sizni ushlashdi! Endi siz quvlovchisiz!"
            );

        }
    }
}


/* =====================================================
   DISTANCE
===================================================== */

function distanceBetween(a, b) {

    const dx =
        a.x - b.x;

    const dy =
        a.y - b.y;


    return Math.sqrt(
        dx * dx +
        dy * dy
    );
}


/* =====================================================
   COIN
===================================================== */

function checkCoinCollection() {

    for (
        const coin of map.coins
    ) {

        if (
            coin.collected
        ) {

            continue;
        }


        const dx =
            state.player.x -
            coin.x;

        const dy =
            state.player.y -
            coin.y;


        if (
            Math.sqrt(
                dx * dx +
                dy * dy
            ) < 28
        ) {

            coin.collected =
                true;

            state.coins += 10;

            saveData();

            showNotification(
                "🪙",
                "+10 Coin"
            );

        }
    }
}


/* =====================================================
   ROLE BADGE
===================================================== */

function updateRoleBadge() {

    if (
        state.player.role ===
        "chaser"
    ) {

        roleBadge.textContent =
            "✋ QUVLOVCHI";

        roleBadge.className =
            "role-badge chaser";

        gameMessage.textContent =
            "✋ Qochuvchilarni ushlang!";

    } else {

        roleBadge.textContent =
            "🏃 QOCHUVCHI";

        roleBadge.className =
            "role-badge runner";

        gameMessage.textContent =
            "🏃 Qoching va berkining!";
    }
}


/* =====================================================
   DRAW
===================================================== */

function draw() {

    ctx.clearRect(
        0,
        0,
        gameCanvas.width,
        gameCanvas.height
    );


    drawBackground();

    drawHidingSpots();

    drawWalls();

    drawCoins();

    drawDemoPlayers();

    drawPlayer();


    if (
        state.player.jumping
    ) {

        drawJumpEffect();

    }
}


/* =====================================================
   BACKGROUND
===================================================== */

function drawBackground() {

    ctx.fillStyle =
        "#235a32";

    ctx.fillRect(
        0,
        0,
        1200,
        700
    );


    /*
     * Yo'l
     */

    ctx.fillStyle =
        "#34403a";

    ctx.fillRect(
        25,
        25,
        1150,
        650
    );


    /*
     * Dekorativ chiziqlar
     */

    ctx.strokeStyle =
        "rgba(255,255,255,0.08)";

    ctx.lineWidth = 2;


    for (
        let x = 70;
        x < 1150;
        x += 80
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            25
        );

        ctx.lineTo(
            x,
            675
        );

        ctx.stroke();

    }


    for (
        let y = 70;
        y < 675;
        y += 80
    ) {

        ctx.beginPath();

        ctx.moveTo(
            25,
            y
        );

        ctx.lineTo(
            1175,
            y
        );

        ctx.stroke();

    }
}


/* =====================================================
   WALLS
===================================================== */

function drawWalls() {

    map.walls.forEach(
        wall => {

            ctx.fillStyle =
                "#161b19";

            ctx.fillRect(
                wall.x,
                wall.y,
                wall.width,
                wall.height
            );


            ctx.strokeStyle =
                "#56635c";

            ctx.lineWidth = 2;

            ctx.strokeRect(
                wall.x,
                wall.y,
                wall.width,
                wall.height
            );


            /*
             * Devor chiziqlari
             */

            ctx.fillStyle =
                "#77847c";


            if (
                wall.width >
                wall.height
            ) {

                for (
                    let x =
                        wall.x + 10;

                    x <
                    wall.x +
                    wall.width;

                    x += 30
                ) {

                    ctx.fillRect(
                        x,
                        wall.y + 5,
                        2,
                        wall.height - 10
                    );
                }

            } else {

                for (
                    let y =
                        wall.y + 10;

                    y <
                    wall.y +
                    wall.height;

                    y += 30
                ) {

                    ctx.fillRect(
                        wall.x + 5,
                        y,
                        wall.width - 10,
                        2
                    );
                }
            }

        }
    );
}


/* =====================================================
   HIDING SPOTS
===================================================== */

function drawHidingSpots() {

    map.hidingSpots.forEach(
        spot => {

            ctx.fillStyle =
                "rgba(30,100,52,0.95)";

            ctx.fillRect(
                spot.x,
                spot.y,
                spot.width,
                spot.height
            );


            ctx.strokeStyle =
                "#21e66b";

            ctx.lineWidth = 2;

            ctx.setLineDash([
                7,
                5
            ]);

            ctx.strokeRect(
                spot.x,
                spot.y,
                spot.width,
                spot.height
            );

            ctx.setLineDash([]);


            ctx.fillStyle =
                "rgba(255,255,255,0.65)";

            ctx.font =
                "22px Arial";

            ctx.textAlign =
                "center";

            ctx.textBaseline =
                "middle";

            ctx.fillText(
                "🫥",
                spot.x +
                spot.width / 2,
                spot.y +
                spot.height / 2
            );

        }
    );
}


/* =====================================================
   COINS DRAW
===================================================== */

function drawCoins() {

    map.coins.forEach(
        coin => {

            if (
                coin.collected
            ) return;


            const pulse =
                Math.sin(
                    performance.now() /
                    200 +
                    coin.id
                ) * 2;


            ctx.save();

            ctx.shadowColor =
                "#ffd43b";

            ctx.shadowBlur = 14;


            ctx.fillStyle =
                "#ffd43b";


            ctx.beginPath();

            ctx.arc(
                coin.x,
                coin.y,
                9 + pulse,
                0,
                Math.PI * 2
            );

            ctx.fill();


            ctx.shadowBlur = 0;


            ctx.fillStyle =
                "#9b7200";

            ctx.font =
                "bold 11px Arial";

            ctx.textAlign =
                "center";

            ctx.textBaseline =
                "middle";

            ctx.fillText(
                "$",
                coin.x,
                coin.y
            );


            ctx.restore();

        }
    );
}


/* =====================================================
   PLAYER DRAW
===================================================== */

function drawPlayer() {

    drawCharacter(
        state.player.x,
        state.player.y,
        getSkinColor(),
        state.player.name,
        state.player.role,
        state.player.hidden
    );
}


/* =====================================================
   OTHER PLAYERS DRAW
===================================================== */

function drawDemoPlayers() {

    state.players.forEach(
        player => {

            if (
                player.id ===
                state.player.id
            ) {

                return;
            }


            if (
                player.hidden
            ) {

                return;
            }


            drawCharacter(
                player.x,
                player.y,
                player.color,
                player.name,
                player.role,
                player.hidden
            );

        }
    );
}


/* =====================================================
   CHARACTER
===================================================== */

function drawCharacter(
    x,
    y,
    color,
    name,
    role,
    hidden
) {

    ctx.save();


    /*
     * Shadow
     */

    ctx.fillStyle =
        "rgba(0,0,0,0.35)";

    ctx.beginPath();

    ctx.ellipse(
        x,
        y + 20,
        18,
        7,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
     * Role aura
     */

    if (
        role === "chaser"
    ) {

        ctx.shadowColor =
            "#ff3333";

        ctx.shadowBlur = 16;

    } else {

        ctx.shadowColor =
            color;

        ctx.shadowBlur = 10;

    }


    /*
     * Body
     */

    ctx.fillStyle =
        color;


    ctx.beginPath();

    ctx.arc(
        x,
        y,
        17,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.shadowBlur = 0;


    /*
     * Face
     */

    ctx.fillStyle =
        "#ffd6b0";


    ctx.beginPath();

    ctx.arc(
        x,
        y - 18,
        11,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
     * Ko'z
     */

    ctx.fillStyle =
        "#222";

    ctx.beginPath();

    ctx.arc(
        x - 4,
        y - 19,
        2,
        0,
        Math.PI * 2
    );

    ctx.arc(
        x + 4,
        y - 19,
        2,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
     * Role icon
     */

    ctx.font =
        "13px Arial";

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";


    ctx.fillText(
        role === "chaser"
            ? "✋"
            : "🏃",
        x,
        y + 1
    );


    /*
     * Name
     */

    ctx.font =
        "bold 11px Arial";

    ctx.fillStyle =
        "#fff";

    ctx.fillText(
        name,
        x,
        y - 40
    );


    ctx.restore();
}


/* =====================================================
   JUMP EFFECT
===================================================== */

function drawJumpEffect() {

    ctx.save();

    ctx.strokeStyle =
        "#ffd43b";

    ctx.lineWidth = 3;

    ctx.globalAlpha =
        0.7;


    ctx.beginPath();

    ctx.arc(
        state.player.x,
        state.player.y,
        30,
        0,
        Math.PI * 2
    );

    ctx.stroke();


    ctx.restore();
}


/* =====================================================
   GADGET: JUMP
===================================================== */

jumpBtn.addEventListener(
    "pointerdown",
    () => {

        if (
            !state.gadgets.jump
        ) {

            showNotification(
                "🔒",
                "Bu gadget sotib olinmagan!"
            );

            return;
        }


        if (
            state.player.jumping
        ) return;


        state.player.jumping =
            true;


        showNotification(
            "🦘",
            "Super sakrash!"
        );


        setTimeout(() => {

            state.player.jumping =
                false;

        }, 700);

    }
);


/* =====================================================
   GADGET: SPEED
===================================================== */

runBtn.addEventListener(
    "pointerdown",
    () => {

        if (
            !state.gadgets.speed
        ) {

            showNotification(
                "🔒",
                "Turbo gadgeti sotib olinmagan!"
            );

            return;
        }


        state.player.running =
            true;


        showNotification(
            "⚡",
            "Turbo yoqildi!"
        );

    }
);


runBtn.addEventListener(
    "pointerup",
    stopRunning
);

runBtn.addEventListener(
    "pointercancel",
    stopRunning
);

runBtn.addEventListener(
    "pointerleave",
    stopRunning
);


function stopRunning() {

    state.player.running =
        false;
}


/* =====================================================
   GADGET: HIDE
===================================================== */

hideBtn.addEventListener(
    "click",
    () => {

        if (
            !state.gadgets.hide
        ) {

            showNotification(
                "🔒",
                "Berkinish gadgeti sotib olinmagan!"
            );

            return;
        }


        state.player.hidden =
            true;


        showNotification(
            "🫥",
            "Siz yashirindingiz!"
        );


        setTimeout(() => {

            state.player.hidden =
                false;


            showNotification(
                "👀",
                "Endi ko'rinyapsiz!"
            );

        }, 3500);

    }
);


/* =====================================================
   KEYBOARD
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        const key =
            event.key.toLowerCase();


        state.keys[key] =
            true;


        if (
            key === " " &&
            !state.paused
        ) {

            event.preventDefault();

            togglePause();

        }

    }
);


document.addEventListener(
    "keyup",
    event => {

        const key =
            event.key.toLowerCase();

        state.keys[key] =
            false;

    }
);


/* =====================================================
   JOYSTICK
===================================================== */

let joystickPointerId =
    null;


joystickBase.addEventListener(
    "pointerdown",
    event => {

        joystickPointerId =
            event.pointerId;

        joystickBase.setPointerCapture(
            event.pointerId
        );

        state.joystick.active =
            true;

        updateJoystick(
            event
        );

    }
);


joystickBase.addEventListener(
    "pointermove",
    event => {

        if (
            event.pointerId !==
            joystickPointerId
        ) {

            return;
        }


        updateJoystick(
            event
        );

    }
);


joystickBase.addEventListener(
    "pointerup",
    resetJoystick
);


joystickBase.addEventListener(
    "pointercancel",
    resetJoystick
);


function updateJoystick(event) {

    const rect =
        joystickBase.getBoundingClientRect();


    const centerX =
        rect.left +
        rect.width / 2;

    const centerY =
        rect.top +
        rect.height / 2;


    let dx =
        event.clientX -
        centerX;

    let dy =
        event.clientY -
        centerY;


    const max =
        rect.width * 0.35;


    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    if (
        distance > max
    ) {

        dx =
            dx / distance *
            max;

        dy =
            dy / distance *
            max;

    }


    joystickStick.style.transform =
        `translate(${dx}px, ${dy}px)`;


    state.joystick.x =
        dx / max;

    state.joystick.y =
        dy / max;
}


function resetJoystick() {

    joystickPointerId =
        null;

    state.joystick.active =
        false;

    state.joystick.x = 0;

    state.joystick.y = 0;


    joystickStick.style.transform =
        "translate(0, 0)";
}


/* =====================================================
   PAUSE
===================================================== */

pauseBtn.addEventListener(
    "click",
    togglePause
);


resumeBtn.addEventListener(
    "click",
    togglePause
);


function togglePause() {

    if (
        !state.gameStarted
    ) {

        return;
    }


    state.paused =
        !state.paused;


    if (
        state.paused
    ) {

        pauseOverlay.classList.remove(
            "hidden"
        );

    } else {

        hidePause();

        state.lastTime =
            performance.now();

    }
}


function hidePause() {

    pauseOverlay.classList.add(
        "hidden"
    );

    state.paused =
        false;
}


/* =====================================================
   PAUSE SHOP
===================================================== */

pauseShopBtn.addEventListener(
    "click",
    () => {

        pauseOverlay.classList.add(
            "hidden"
        );

        openShop();

    }
);


/* =====================================================
   EXIT GAME
===================================================== */

pauseExitBtn.addEventListener(
    "click",
    () => {

        state.gameStarted =
            false;

        hidePause();

        gameScreen.classList.add(
            "hidden"
        );

        showScreen(
            mainMenu
        );

        saveData();

    }
);


/* =====================================================
   LEAVE ROOM
===================================================== */

leaveRoomBtn.addEventListener(
    "click",
    () => {

        state.roomCode =
            null;

        state.players =
            [];

        state.isHost =
            false;


        showScreen(
            mainMenu
        );


        setConnection(
            false,
            "Serverga ulanmagan"
        );

    }
);


/* =====================================================
   ROUND END
===================================================== */

function endRound() {

    if (
        !state.gameStarted
    ) {

        return;
    }


    state.gameStarted =
        false;


    state.stats.games++;


    const playerIsChaser =
        state.player.role ===
        "chaser";


    /*
     * 3 daqiqa tugaganda:
     * agar quvlovchi bo'lsa,
     * u yutgan hisoblanadi.
     */

    let won;


    if (playerIsChaser) {

        won = true;

    } else {

        won = true;
    }


    if (won) {

        state.stats.wins++;

    }


    const reward =
        playerIsChaser
            ? 150
            : 100;


    state.coins += reward;


    $("resultIcon").textContent =
        won ? "🏆" : "😢";


    $("resultTitle").textContent =
        won
            ? "TABRIKLAYMIZ!"
            : "ROUND TUGADI";


    $("resultText").textContent =
        won
            ? "Siz roundni muvaffaqiyatli yakunladingiz!"
            : "Keyingi roundda yana urinib ko'ring!";


    $("resultTime").textContent =
        "03:00";


    $("resultCoins").textContent =
        `+${reward}`;


    roundResult.classList.remove(
        "hidden"
    );


    saveData();
}


/* =====================================================
   NEXT ROUND
===================================================== */

nextRoundBtn.addEventListener(
    "click",
    () => {

        state.round++;

        roundResult.classList.add(
            "hidden"
        );


        /*
         * Rollarni qayta taqsimlash
         */

        state.players.forEach(
            player => {

                player.role =
                    "runner";

            }
        );


        const randomIndex =
            Math.floor(
                Math.random() *
                state.players.length
            );


        if (
            state.players[
                randomIndex
            ]
        ) {

            state.players[
                randomIndex
            ].role =
                "chaser";


            state.player.role =
                state.players[
                    randomIndex
                ].id ===
                state.player.id
                    ? "chaser"
                    : "runner";
        }


        startRound();

    }
);


/* =====================================================
   SHOP OPEN
===================================================== */

shopBtn.addEventListener(
    "click",
    openShop
);


pauseShopBtn.addEventListener(
    "click",
    openShop
);


function openShop() {

    if (
        gameScreen.classList.contains(
            "hidden"
        )
    ) {

        showScreen(
            shopScreen
        );

    } else {

        shopScreen.classList.remove(
            "hidden"
        );

    }


    shopCoins.textContent =
        state.coins;


    renderShop();
}


/* =====================================================
   SHOP TABS
===================================================== */

document
    .querySelectorAll(".shop-tab")
    .forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".shop-tab"
                    )
                    .forEach(
                        t =>
                            t.classList.remove(
                                "active"
                            )
                    );


                tab.classList.add(
                    "active"
                );


                currentCategory =
                    tab.dataset.category;


                renderShop();

            }
        );

    });


/* =====================================================
   SHOP RENDER
===================================================== */

function renderShop() {

    shopItems.innerHTML = "";


    const items =
        shop[currentCategory];


    items.forEach(item => {

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "shop-card";


        const owned =
            ownedItems.includes(
                item.id
            );


        const selected =
            state.player.skin ===
            item.id;


        card.innerHTML = `

            <div class="shop-icon">
                ${item.icon}
            </div>

            <h3>
                ${escapeHTML(item.name)}
            </h3>

            ${
                item.description
                    ? `<p>${escapeHTML(item.description)}</p>`
                    : ""
            }

            <div class="shop-price">

                ${
                    owned
                        ? (
                            selected
                                ? "✅ TANLANGAN"
                                : "✓ OLINGAN"
                        )
                        : `🪙 ${item.price}`
                }

            </div>

            <button
                class="buy-item-btn"
                data-id="${item.id}"
            >

                ${
                    owned
                        ? (
                            currentCategory ===
                            "skins"
                                ? "TANLASH"
                                : "OLINGAN"
                        )
                        : "SOTIB OLISH"
                }

            </button>

        `;


        card
            .querySelector(
                ".buy-item-btn"
            )
            .addEventListener(
                "click",
                () => {

                    buyShopItem(
                        item
                    );

                }
            );


        shopItems.appendChild(
            card
        );

    });


    shopCoins.textContent =
        state.coins;
}


/* =====================================================
   BUY ITEM
===================================================== */

function buyShopItem(item) {

    if (
        ownedItems.includes(
            item.id
        )
    ) {

        if (
            currentCategory ===
            "skins"
        ) {

            state.player.skin =
                item.id;

            saveData();

            renderShop();

            showNotification(
                "👕",
                `${item.name} tanlandi!`
            );

        }

        return;
    }


    if (
        state.coins <
        item.price
    ) {

        showNotification(
            "🪙",
            "Coin yetarli emas!"
        );

        return;
    }


    state.coins -=
        item.price;


    ownedItems.push(
        item.id
    );


    if (
        currentCategory ===
        "skins"
    ) {

        state.player.skin =
            item.id;

    }


    saveData();

    renderShop();


    showNotification(
        "✅",
        `${item.name} sotib olindi!`
    );
}


/* =====================================================
   CLOSE SHOP
===================================================== */

closeShopBtn.addEventListener(
    "click",
    () => {

        shopScreen.classList.add(
            "hidden"
        );


        if (
            state.gameStarted
        ) {

            gameScreen.classList.remove(
                "hidden"
            );

        } else {

            showScreen(
                mainMenu
            );

        }

    }
);


/* =====================================================
   STATS
===================================================== */

statsBtn.addEventListener(
    "click",
    openStats
);


function openStats() {

    showScreen(
        statsScreen
    );


    $("statsPlayerName").textContent =
        state.player.name;


    $("gamesPlayed").textContent =
        state.stats.games;


    $("wins").textContent =
        state.stats.wins;


    $("caughtPlayers").textContent =
        state.stats.caught;


    $("escapes").textContent =
        state.stats.escapes;
}


closeStatsBtn.addEventListener(
    "click",
    () => {

        showScreen(
            mainMenu
        );

    }
);


/* =====================================================
   RESET STATS
===================================================== */

$("resetStatsBtn").addEventListener(
    "click",
    () => {

        const confirmReset =
            confirm(
                "Statistikani o'chirishni xohlaysizmi?"
            );


        if (!confirmReset) {
            return;
        }


        state.stats = {

            games: 0,

            wins: 0,

            caught: 0,

            escapes: 0

        };


        saveData();

        openStats();

        showNotification(
            "🗑️",
            "Statistika tozalandi!"
        );

    }
);


/* =====================================================
   COPY ROOM
===================================================== */

copyRoomBtn.addEventListener(
    "click",
    async () => {

        if (
            !state.roomCode
        ) {

            return;
        }


        try {

            await navigator.clipboard.writeText(
                state.roomCode
            );


            showNotification(
                "📋",
                "Room kodi nusxalandi!"
            );

        } catch {

            showNotification(
                "ℹ️",
                `Room kodi: ${state.roomCode}`
            );

        }

    }
);


/* =====================================================
   SETTINGS
===================================================== */

settingsBtn.addEventListener(
    "click",
    () => {

        showNotification(
            "⚙️",
            "Sozlamalar keyingi versiyada!"
        );

    }
);


/* =====================================================
   CONNECTION
===================================================== */

function setConnection(
    connected,
    message
) {

    connectionText.textContent =
        message;


    connectionDot.style.background =
        connected
            ? "#21e66b"
            : "#ff3434";


    connectionDot.style.boxShadow =
        connected
            ? "0 0 10px #21e66b"
            : "0 0 10px #ff3434";
}


/* =====================================================
   NOTIFICATION
===================================================== */

let notificationTimer = null;


function showNotification(
    icon,
    message
) {

    notificationIcon.textContent =
        icon;

    notificationText.textContent =
        message;


    notification.classList.remove(
        "hidden"
    );


    clearTimeout(
        notificationTimer
    );


    notificationTimer =
        setTimeout(
            () => {

                notification.classList.add(
                    "hidden"
                );

            },
            2200
        );
}


/* =====================================================
   SKIN COLOR
===================================================== */

function getSkinColor() {

    const item =
        shop.skins.find(
            skin =>
                skin.id ===
                state.player.skin
        );


    return item
        ? item.color
        : "#36d66d";
}


function randomColor() {

    const colors = [
        "#ff4545",
        "#348cff",
        "#ffd43b",
        "#a855f7",
        "#ff7a29",
        "#21e66b",
        "#00c8ff"
    ];


    return colors[
        Math.floor(
            Math.random() *
            colors.length
        )
    ];
}


/* =====================================================
   HTML XAVFSIZLIK
===================================================== */

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


/* =====================================================
   MOBILE DEVICE
===================================================== */

function isMobile() {

    return (
        window.matchMedia(
            "(pointer: coarse)"
        ).matches
    );
}


if (isMobile()) {

    mobileControls.style.display =
        "flex";

}


/* =====================================================
   RESIZE
===================================================== */

window.addEventListener(
    "resize",
    () => {

        if (
            isMobile()
        ) {

            mobileControls.style.display =
                "flex";

        }

    }
);


/* =====================================================
   VISIBILITY
===================================================== */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.hidden &&
            state.gameStarted
        ) {

            state.paused =
                true;

            pauseOverlay.classList.remove(
                "hidden"
            );

        }

    }
);


/* =====================================================
   INITIALIZATION
===================================================== */

function initialize() {

    loadData();

    createCoins();


    playerNameInput.value =
        state.player.name;


    setConnection(
        false,
        "Serverga ulanmagan"
    );


    /*
     * Demo holatda.
     * Haqiqiy multiplayer uchun
     * keyingi server.js WebSocket
     * ulanishi shu yerga qo'shiladi.
     */

    console.log(
        "🏃 QUVLASHMACHOQ — ULUG'BEK.R"
    );

    console.log(
        "🌐 Multiplayer client tayyor."
    );

}


initialize();

