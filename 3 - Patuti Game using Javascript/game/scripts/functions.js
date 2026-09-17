function bullet_down(bullet) {
    bullet_current_position = parseInt(bullet.css("top"));
    bullet.css("top", bullet_current_position + bullet_v_speed);
}

function bullet_move_left(bullet) {
    bullet_current_position = parseInt(bullet.css("right"));
    bullet.css("right", bullet_current_position + bullet_h_speed);
}

function check_bullet_hits_floor(bullet) {
    return collision(bullet, floor);
}

function check_bullet_hits_wall(bullet) {
    return collision(bullet, wall);
}

function set_bullet_v_initial_position(bullet_v){
    bullet_v.css("top", bullet_v_initial_position);
}

function set_bullet_h_initial_position(bullet_h){
    bullet_h.css("right", bullet_h_initial_position);
}

// Checks if Patuti's current horizontal position goes beyond platform limits
function check_if_patuti_position_exceeds_area(patuti_current_position){
    const area_start_position = 0;
    const area_end_position = area.width();
    if (patuti_current_position >= area_start_position && patuti_current_position <= area_end_position) {
        return false;
    }
    return true; // Position exceeds platform boundaries
}

function check_bullet_hits_patuti(bullet) {
    // Ignore bullet damage while falling off edge
    if (isFalling) return false; 
    return collision_with_patuti(bullet);
}

function decrement_life() {
    if (life <= 0) return;
    life--;
    decrement_score_bar();
    patuti.removeClass("hit-flash");
    void patuti[0].offsetWidth;
    patuti.addClass("hit-flash");
}

function decrement_score_bar() {
    $(`#score-bar .bar:eq(${life})`).hide();
}

function reset_score_bar() {
    $("#score-bar .bar").show();
}

function format_time(seconds) {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
    const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
    return minutes + ":" + remainingSeconds;
}

function update_time_display() {
    let currentTime = elapsedTime;
    if (timerStartedAt !== null) {
        currentTime += Math.floor((Date.now() - timerStartedAt) / 1000);
    }
    $("#timer").text(format_time(currentTime));
    $("#longest-time").text(format_time(longestTime));
    $("#game-over-time").text(format_time(currentTime));
    $("#game-over-longest-time").text(format_time(longestTime));
}

function start_timer() {
    elapsedTime = 0;
    timerStartedAt = Date.now();
    update_time_display();
    if (timerInterval === null) {
        timerInterval = setInterval(update_time_display, 250);
    }
}

function pause_timer() {
    if (timerStartedAt === null) return;
    elapsedTime += Math.floor((Date.now() - timerStartedAt) / 1000);
    timerStartedAt = null;
    update_time_display();
}

function resume_timer() {
    if (timerStartedAt !== null) return;
    timerStartedAt = Date.now();
    update_time_display();
}

function finish_timer() {
    pause_timer();
    if (elapsedTime > longestTime) {
        longestTime = elapsedTime;
        try {
            localStorage.setItem("patutiLongestTime", longestTime);
        } catch (error) {
            // The timer still works when browser storage is unavailable.
        }
    }
    update_time_display();
}

function stop_the_game() {
    cancelAnimationFrame(anim_id);
    anim_id = null;
}

function start_game() {
    hasStarted = true;
    isPaused = false;
    isJumping = false;
    jumpVelocity = 0;
    fallVelocity = 0;
    duckHeld = false;
    life = 5;
    reset_score_bar();
    start_timer();

    bullets_v.forEach(b => {
        b.isDown = false;
        set_bullet_v_initial_position(b.type);
    });
    bullets_h.forEach(b => {
        b.isMoving = false;
        set_bullet_h_initial_position(b.type);
    });

    respawn_patuti();
    start_overlay.hide();
    pause_overlay.hide();
    game_over.hide();
    game.show();
    $("#pause-button").text("Pause").show();

    stop_the_game();
    anim_id = requestAnimationFrame(the_game);
}

function pause_game() {
    if (!hasStarted || isPaused || life <= 0) return;
    isPaused = true;
    pause_timer();
    stop_the_game();
    pause_overlay.css("display", "flex");
    $("#pause-button").text("Resume");
}

function resume_game() {
    if (!hasStarted || !isPaused || life <= 0) return;
    isPaused = false;
    resume_timer();
    pause_overlay.css("display", "none");
    $("#pause-button").text("Pause");
    anim_id = requestAnimationFrame(the_game);
}

// Handles boundary failure (falling off edge)
function fall_off_platform() {
    if (isFalling) return;
    isFalling = true;
    isJumping = false;
    jumpVelocity = 0;
    fallVelocity = 10;
    isActItRunning = false;

    decrement_life();

    const currentLeft = patuti.position().left;
    const movePastEdge = currentLeft + (patuti.width() / 2) > area.width() / 2 ? 18 : -18;
    patuti.css({
        left: (currentLeft + movePastEdge) + "px"
    });
    update_patuti_hitboxes();

    let dropInterval = setInterval(function() {
        fallVelocity += 3;
        let currentBottom = parseFloat(patuti.css("bottom")) || 0;
        let nextBottom = currentBottom - fallVelocity;

        patuti.css({
            bottom: nextBottom + "px",
            left: patuti.position().left + "px",
            top: ""
        });
        update_patuti_hitboxes();

        if (nextBottom <= -160) {
            clearInterval(dropInterval);
            if (life > 0) {
                respawn_patuti();
            } else {
                stop_the_game();
                game_over_display();
            }
        }
    }, 30);
}

// Respawns Patuti at the safe center position after falling
function respawn_patuti() {
    patuti.css({
        left: PATUTI_INITIAL_LEFT + "px",
        bottom: "0px",
        top: ""
    });
    update_patuti_hitboxes();
    curPos = 0;
    curSp = 0;
    isActItRunning = false;
    isFalling = false;
    isJumping = false;
    jumpVelocity = 0;
    fallVelocity = 0;
    duckHeld = false;
}

function game_over_display() {
    hasStarted = false;
    isPaused = false;
    finish_timer();
    stop_the_game();
    pause_overlay.css("display", "none");
    game.hide();
    game_over.css("display", "flex");
}

function game_restart() {
    start_game();
}