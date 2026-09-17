// * Checks if two object collides
// * 
// * source: https://github.com/arshadasgar/arshadasgar.github.io/blob/master/eggs/collision_detection.js

function collision($div1, $div2) {
    var x1 = $div1.offset().left;
    var y1 = $div1.offset().top;
    var h1 = $div1.outerHeight(true);
    var w1 = $div1.outerWidth(true);
    var b1 = y1 + h1;
    var r1 = x1 + w1;
    var x2 = $div2.offset().left;
    var y2 = $div2.offset().top;
    var h2 = $div2.outerHeight(true);
    var w2 = $div2.outerWidth(true);
    var b2 = y2 + h2;
    var r2 = x2 + w2;

    if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
    return true;
}

function collision_with_patuti($div) {
    const bullet = $div[0].getBoundingClientRect();
    const sprite = patuti[0].getBoundingClientRect();
    const hitboxes = [
        { left: 0.20, top: 0.08, width: 0.60, height: 0.32 },
        { left: 0.12, top: 0.32, width: 0.76, height: 0.58 }
    ];

    return hitboxes.some(function(hitbox) {
        const left = sprite.left + sprite.width * hitbox.left;
        const top = sprite.top + sprite.height * hitbox.top;
        const right = left + sprite.width * hitbox.width;
        const bottom = top + sprite.height * hitbox.height;

        return !(bullet.right < left || bullet.left > right ||
            bullet.bottom < top || bullet.top > bottom);
    });
}

function update_patuti_hitboxes() {
    const left = patuti.position().left;
    const top = patuti.position().top;
    const width = patuti.width();
    const height = patuti.height();
    const hitboxes = [
        { element: patuti_head_hitbox, left: 0.20, top: 0.08, width: 0.60, height: 0.32 },
        { element: patuti_body_hitbox, left: 0.12, top: 0.32, width: 0.76, height: 0.58 }
    ];

    hitboxes.forEach(function(hitbox) {
        hitbox.element.css({
            left: (left + width * hitbox.left) + "px",
            top: (top + height * hitbox.top) + "px",
            width: (width * hitbox.width) + "px",
            height: (height * hitbox.height) + "px"
        });
    });
}