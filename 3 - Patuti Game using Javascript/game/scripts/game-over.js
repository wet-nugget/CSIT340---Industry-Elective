// * Contains the logic for game over and overlays

game_over.hide();
start_overlay.show();
start_button.click(function() {
    start_game();
});
resume_button.click(function() {
    resume_game();
});
restart.click(function() {
    game_restart();
});