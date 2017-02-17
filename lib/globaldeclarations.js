define(["require", "exports", "./vector"], function (require, exports, vector_1) {
    "use strict";
    exports.canvas = document.getElementById("gameCanvas");
    exports.ctx = exports.canvas.getContext("2d");
    exports.LASTCLICK = vector_1.Vector.random();
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
});
//# sourceMappingURL=globaldeclarations.js.map