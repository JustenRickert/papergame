/*-*-mode:typescript-*-*/
var canvas: any = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

var LASTCLICK = Vector.random();
// How can I write this one with the fat arrow?
canvas.onclick = function updateLastClick(event) {
    var mPos = getMousePos(canvas, event)
    LASTCLICK = new Vector(mPos.x, mPos.y);
};

var getMousePos = (canvas, evt) => {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

