// -*- mode:typescript -*-
// NEW PROJECT WOOH

/* Okay, so let there be a game board. It is to be shaped according to the
 * number of pieces that will be on the board or something. There will be two
 * factions of pieces which will correspond to the red side and the blue side.
 * At first, the game will be about having pieces that are good for fighting,
 * then as you go on economic pieces will be added, which will then allow
 * upgrading units, and even constructing new units from a factory. The game
 * will be played by assigning intelligence to the particular pieces---either to
 * defend other specific pieces, or attack unrelentingly---so that the end goal
 * is one team winning over the other. */



// Blue is the good guys, but maybe add user changeable colors or something.
class BlueCircle extends Circle {
    constructor() {
        super(35, new Vector(500, 800))
        this.color = "Blue";
    }
    public follow(cir: Vector): void {
        this.moveToPosition(cir);
    }
}

// Red is the bad guys! Boo on them. They are a separate class because they are
// going to have separate functions from the blue guys.
class RedCircle extends Circle {
    public state: State;
    constructor() {
        super(20, new Vector(200, 300))
        this.color = "Red";
        this.state = new State();
    }
}

var CANV = document.createElement("canvas");
document.body.appendChild(CANV);

var LASTCLICK = new Vector(0, 0);
CANV.onclick = function updateLastClick(event) {
    LASTCLICK = new Vector(event.pageX, event.pageY)
};
CANV.width = 1925;
CANV.height = 2380;
var CNTX = CANV.getContext("2d");

var red = new RedCircle();
var blu = new BlueCircle();
var sideStep = new SideStep(red);
red.setVel(new Vector(1, 0));
blu.setVel(new Vector(0.5, 0));
blu.setSpeed(0.5);
var GAME_FRAME = 0;

var reds = new Reds(21)

// I want this to be kind of a portable test service or something. I dunno,
// maybe I'll make an elaborate test module or something, too.
function start() {
    for (var r of reds.all){
        r.draw();
    }
    // Okay. So this is my first attempt at a thing called I am calling a Unit
    // Event. It's a time-based action that unfolds under certain conditions.
    // This one makes the red guy flip out. I think it's pretty naive, and it
    // doesn't seem to operate very well, but I'm sure things will get better
    // when I have a better understanding of a method that can accomplish
    // interesting things.
    red.detectSitting();
    if (red.state.sitting) {
        sideStep.decrement();
        if (sideStep.count > 0) {
        } else {
            sideStep.onZero();
        }
    }
    //Vector.minus(red.pos, new Vector(0, 0))))
    clearScreen();
    Circle.isThenColliding(red, blu);
    if (blu.state.colliding) {
    } else {
        blu.follow(red.pos);
    }
    if (red.state.colliding) {
        if (Math.abs(Vector.angleBetween(red.vel, Vector.minus(red.pos, blu.pos)))
            < Math.PI / 1.4) {// 1.4 is a kind of "squeeze" amount. It lets the one
            // circle move around the other circle. This is so far a naive way
            // of dealing with this, but it shouldn't be too hard to add a
            // physics-based "pushing" affect simply on top of this. I am trying
            // to make a point of it because I think it should be easily seen,
            // as I don't know if I want to make it part of the Circle itself
            // just yet (and I don't want to just forget where this number is
            // located).
            red.moveToPosition(LASTCLICK);

            // In order to abstract these physics functions, we need a higher
            // order way of talking about the individual units, so that if there
            // is more than one collision happening, we can account for _all_ of
            // those interactions
            Circle.applyForce(red, blu);
            red.impulse();      // impulse is Force per time.
            blu.impulse();      // So this thing is starting to move more.
            red.moveByMomentum(); // This actually moves the point.
            blu.moveByMomentum();
            // The next step is to make it so that if the unit detects that it
            // is not moving, it will attempt to push itself past what is in
            // front of it. At that point, I think that the basic
            // physics/collision system will be complete. We'll see what will be
            // needed in the future as we start considering exactly how the
            // pieces are to interact.
        } else {
            red.turnToPosition(LASTCLICK);
        }
    } else {
        red.moveToPosition(LASTCLICK);
        red.unsetColliding();   // This is for the state
        blu.unsetColliding();   // Really, it should be blu.state.unsetColliding() {I think?}
        red.frictionMomentum(0.90); // Slows the thing down afterwards
        blu.frictionMomentum(0.90);
        red.moveByMomentum();   // Still needs to move, even if not colliding
        blu.moveByMomentum();
    }

    red.draw();
    blu.draw();
    GAME_FRAME++;
    requestAnimationFrame(start);
} start()

// I don't use what is below this comment anymore, but I may be able generalize
// them, and then use them to draw everything.

// ALSO, be keeping these intensive drawing operations outside of classes, they
// can be moved to their own separate files wherein one can be certain the
// values have an immutable state, then the drawing operations can be called
// concurrently to increase the performance (I think? Maybe it won't matter).
// URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop

// clears the screen, obvii
function clearScreen() {
    CNTX.clearRect(0, 0, CANV.width, CANV.height);
}

// draws a dot on the screen
function draw(x, y, rad, color) { // Probably deprecated.
    CNTX.beginPath();
    CNTX.arc(x, y, rad, 0, 2 * Math.PI);
    CNTX.closePath();
    CNTX.fillStyle = color;
    CNTX.fill();
}
