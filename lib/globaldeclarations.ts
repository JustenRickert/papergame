//-*-mode:typescript-*-
// Local Variables:
// eval: (setq typescript-indent-level 2)
// End:

import { Vector } from './vector'

export const GAME_CANVAS: HTMLCanvasElement
  = <HTMLCanvasElement>document.getElementById("gameCanvas");
export const GAME_CTX: CanvasRenderingContext2D = GAME_CANVAS.getContext("2d");

export const GAME_CANVAS_2: HTMLCanvasElement
  = <HTMLCanvasElement>document.getElementById("gameCanvas2");
export const GAME_CTX_2: CanvasRenderingContext2D = GAME_CANVAS_2.getContext("2d");

export var LASTCLICK = Vector.random();
GAME_CANVAS.onclick = function updateLastClick(event: MouseEvent) {
  var mPos = getMousePos(GAME_CANVAS, event)
  LASTCLICK = new Vector(mPos.x, mPos.y);
};

export var getMousePos = (canvas: HTMLCanvasElement, evt: MouseEvent) => {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}
