let curPos = 0;
let curSp = 0;
let arrow = { left: 37, up: 38, right: 39, down: 40 };
let isActItRunning = false;

let moves = [
    [
        "moves/idle-1.png",
        "moves/idle-2.png"
    ],
    [
        "moves/left-1.png",
        "moves/left-2.png",
        "moves/left-3.png",
        "moves/left-4.png",
        "moves/left-6.png"
    ],
    [   
        "moves/right-1.png",
        "moves/right-2.png",
        "moves/right-3.png",
        "moves/right-4.png",
        "moves/right-5.png"
    ],
    [
        "moves/jump-1.png", 
        "moves/jump-2.png", 
        "moves/jump-3.png", 
        "moves/jump-4.png", 
        "moves/jump-5.png", 
        "moves/jump-6.png", 
        "moves/jump-7.png" 
    ],
    [
        "moves/dock-1.png", 
        "moves/dock-2.png", 
        "moves/dock-3.png", 
        "moves/dock-4.png",
        "moves/dock-5.png",
    ],
];

function actIt() {
    if (!hasStarted || isPaused || isFalling) return;

    const isJumpMovement = curPos == 3 && isJumping;
    if (!isJumpMovement) {
        patuti.attr("src", moves[curPos][curSp]);
        curSp = (curSp + 1) % moves[curPos].length;
    }
    update_patuti_hitboxes();

    // LEFT MOVEMENT
    if (curPos == 1) {
        if (curSp > 2) {
            let currentLeft = patuti.position().left;
            let nextLeft = currentLeft - patuti_speed;
            if (nextLeft <= -patuti_speed) {
                patuti.css("left", (currentLeft - 18) + "px");
                fall_off_platform();
                curPos = 0;
                curSp = 1;
                isActItRunning = false;
                return;
            }
            patuti.css("left", nextLeft + "px");
            update_patuti_hitboxes();
        }
        if (curSp == 0) { curPos = 0; curSp = 1; isActItRunning = false; }
    }

    // RIGHT MOVEMENT
    if (curPos == 2) {
        if (curSp > 2) {
            let currentLeft = patuti.position().left;
            let nextRight = currentLeft + patuti.width() + patuti_speed;
            if (nextRight >= area.width() + patuti_speed) {
                patuti.css("left", (currentLeft + 18) + "px");
                fall_off_platform();
                curPos = 0;
                curSp = 1;
                isActItRunning = false;
                return;
            }
            patuti.css("left", (currentLeft + patuti_speed) + "px");
            update_patuti_hitboxes();
        }
        if (curSp == 0) { curPos = 0; curSp = 1; isActItRunning = false; }
    }

    // JUMP MOVEMENT
    if (curPos == 3 && isJumping) {
        let currentBottom = parseFloat(patuti.css("bottom")) || 0;
        currentBottom += jumpVelocity;
        let jumpFrame;

        if (currentBottom <= 0) {
            currentBottom = 0;
            jumpFrame = 6;
        } else if (jumpVelocity > 24) {
            jumpFrame = 0;
        } else if (jumpVelocity > 16) {
            jumpFrame = 1;
        } else if (jumpVelocity > 8) {
            jumpFrame = 2;
        } else if (jumpVelocity > 0) {
            jumpFrame = 3;
        } else if (jumpVelocity >= -4) {
            jumpFrame = 4;
        } else {
            jumpFrame = 5;
        }

        patuti.attr("src", moves[curPos][jumpFrame]);
        jumpVelocity -= GRAVITY;

        if (currentBottom <= 0) {
            jumpVelocity = 0;
            isJumping = false;
            curPos = 0;
            curSp = 1;
            isActItRunning = false;
        }

        patuti.css({
            bottom: currentBottom + "px",
            top: ""
        });
        update_patuti_hitboxes();
    }

    // DOCK MOVEMENT
    if (curPos == 4) {
        if (duckHeld) {
            curSp = moves[curPos].length - 1;
            patuti.css({
                bottom: "-18px",
                top: ""
            });
            update_patuti_hitboxes();
        } else if (curSp == 0) {
            curPos = 0; curSp = 1;
            isActItRunning = false;
        }
    }
}

function moveIt(i) {
    if (!hasStarted || isPaused || isFalling || isActItRunning) return;
    if (i === 2) {
        if (!isJumping) {
            isJumping = true;
            jumpVelocity = JUMP_FORCE;
            curPos = 3;
            curSp = 0;
            isActItRunning = true;
        }
        return;
    }
    if (i === 3) {
        duckHeld = true;
        curPos = 4;
        curSp = moves[4].length - 1;
        patuti.css({ bottom: "-18px", top: "" });
        isActItRunning = true;
        return;
    }
    duckHeld = false;
    patuti.css({ bottom: "0px", top: "" });
    curPos = i + 1;
    curSp = 0;
    isActItRunning = true;
}

function toggle_pause() {
    if (!hasStarted || life <= 0) return;
    if (isPaused) {
        resume_game();
    } else {
        pause_game();
    }
}

function toggle_hitboxes() {
    hitboxesVisible = !hitboxesVisible;
    patuti_head_hitbox.toggleClass("visible", hitboxesVisible);
    patuti_body_hitbox.toggleClass("visible", hitboxesVisible);
    update_patuti_hitboxes();
}

$(document).ready(function() {
    setInterval(actIt, 100);
    $("#pause-button").on("click", toggle_pause);

    $(document).keydown(function (e) {
        const key = e.which || e.key;
        if (key === 27 || key === "Escape" || key === 80 || key === "p" || key === "P") {
            toggle_pause();
            return;
        }
        if (key === 72 || key === "h" || key === "H") {
            toggle_hitboxes();
            return;
        }
        if (!hasStarted || isPaused || isFalling) return;
        switch (key) {
            case arrow.left: case "ArrowLeft": case 49: case "1":
                if (!isActItRunning) moveIt(0);
                break;
            case arrow.right: case "ArrowRight": case 52: case "4":
                if (!isActItRunning) moveIt(1);
                break;
            case arrow.up: case "ArrowUp": case 50: case "2":
                if (!isActItRunning) moveIt(2);
                break;
            case arrow.down: case "ArrowDown": case 51: case "3":
                if (!isActItRunning) moveIt(3);
                break;
        }
    });

    $(document).keyup(function (e) {
        const key = e.which || e.key;
        if (key === arrow.down || key === "ArrowDown" || key === 51 || key === "3") {
            duckHeld = false;
            patuti.css({ bottom: "0px", top: "" });
            if (!isJumping && !isFalling) {
                curPos = 0;
                curSp = 1;
            }
            isActItRunning = false;
        }
    });
});