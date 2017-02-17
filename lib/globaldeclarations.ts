//-*-mode:typescript-*-
// Local Variables:
// eval: (setq typescript-indent-level 2)
// End:

import { Vector } from './vector'

export const canvas: HTMLCanvasElement
  = <HTMLCanvasElement>document.getElementById("gameCanvas");
export const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

export var LASTCLICK = Vector.random();
// How can I write this one with the fat arrow?
canvas.onclick = function updateLastClick(event: MouseEvent) {
  var mPos = getMousePos(canvas, event)
  LASTCLICK = new Vector(mPos.x, mPos.y);
};

export var getMousePos = (canvas: HTMLCanvasElement, evt: MouseEvent) => {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

