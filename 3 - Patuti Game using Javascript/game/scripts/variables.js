// * contains all the variables needed for the game logic

let patuti = $("#patuti");
let bullet_h = $(".bullet-h");
let bullet_v = $(".bullet-v");
let bullet_h1 = $("#bullet-h-1");
let bullet_h2 = $("#bullet-h-2");
let bullet_h3 = $("#bullet-h-3");
let bullet_v1 = $("#bullet-v-1");
let bullet_v2 = $("#bullet-v-2");
let bullet_v3 = $("#bullet-v-3");
let floor = $("#floor");
let wall = $("#wall");
let score_bars = $(".bar");
let area = $("#area");
let game = $("#game");
let start_overlay = $("#start-overlay");
let pause_overlay = $("#pause-overlay");
let game_over = $("#game-over");
let restart = $("#restart");
let start_button = $("#start-button");
let resume_button = $("#resume-button");
let pause_button = $("#pause-button");
let container = $(".container");
let patuti_head_hitbox = $("#patuti-head-hitbox");
let patuti_body_hitbox = $("#patuti-body-hitbox");
let hitboxesVisible = false;
let elapsedTime = 0;
let timerStartedAt = null;
let timerInterval = null;
let longestTime = 0;
try {
    longestTime = parseInt(localStorage.getItem("patutiLongestTime"), 10) || 0;
} catch (error) {
    longestTime = 0;
}
let patuti_height = patuti.height();
let patuti_speed = 50;
let patuti_jump_height = 85;
let bullet_v_speed = 6;
let bullet_h_speed = 10;
let bullet_v_initial_position = parseInt(bullet_v.css("top"));
let bullet_h_initial_position = parseInt(bullet_h.css("right"));
let life = 5;
let anim_id = null;
let hasStarted = false;
let isPaused = false;
let isJumping = false;
let jumpVelocity = 0;
let fallVelocity = 0;
let duckHeld = false;
const JUMP_FORCE = 32;
const GRAVITY = 6;

// Boundary & Falling State Variables
let isFalling = false; 
const PATUTI_INITIAL_LEFT = 200; // Safe default spawn position in pixels

let bullets_v = [
    { type: bullet_v1, isDown: false },
    { type: bullet_v2, isDown: false },
    { type: bullet_v3, isDown: false }
];
let bullets_h = [
    { type: bullet_h1, isMoving: false },
    { type: bullet_h2, isMoving: false },
    { type: bullet_h3, isMoving: false }
];