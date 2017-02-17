//-*-mode:typescript-*-
// Local Variables:
// eval: (setq typescript-indent-level 2)
// End:
"use strict";
var vector_1 = require("./vector");
exports.canvas = document.getElementById("gameCanvas");
exports.ctx = exports.canvas.getContext("2d");
exports.LASTCLICK = vector_1.Vector.random();
// How can I write this one with the fat arrow?
exports.canvas.onclick = function updateLastClick(event) {
    var mPos = exports.getMousePos(exports.canvas, event);
    exports.LASTCLICK = new vector_1.Vector(mPos.x, mPos.y);
};
exports.getMousePos = function (canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
};
