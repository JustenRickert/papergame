define(["require", "exports", "./vector"], function (require, exports, vector_1) {
    "use strict";
    exports.GAME_CANVAS = document.getElementById("gameCanvas");
    exports.GAME_CTX = exports.GAME_CANVAS.getContext("2d");
    exports.GAME_CANVAS_2 = document.getElementById("gameCanvas2");
    exports.GAME_CTX_2 = exports.GAME_CANVAS_2.getContext("2d");
    exports.LASTCLICK = vector_1.Vector.random();
    exports.GAME_CANVAS.onclick = function updateLastClick(event) {
        var mPos = exports.getMousePos(exports.GAME_CANVAS, event);
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