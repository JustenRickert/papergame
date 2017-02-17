//-*-mode:typescript-*-
// Local Variables:
// eval: (setq typescript-indent-level 2)
// End:

import { Vector } from './vector'

export const canvas: any = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");

export var LASTCLICK = Vector.random();
// How can I write this one with the fat arrow?
canvas.onclick = function updateLastClick(event) {
    var mPos = getMousePos(canvas, event)
    LASTCLICK = new Vector(mPos.x, mPos.y);
};

export var getMousePos = (canvas, evt) => {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

