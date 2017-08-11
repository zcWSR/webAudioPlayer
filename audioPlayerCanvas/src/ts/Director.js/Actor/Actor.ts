import { FrameScript } from '../Script';
import { Utils } from '../Utils';
export class Actor {
    id: string;
    name: string;
    position: { 'x': number, 'y': number };
    rotatepoint: { 'x': number, 'y': number };
    rotateDeg: number;
    drawWay: number = Draw.FILL;
    style: string | CanvasGradient | CanvasPattern;
    scripts: [FrameScript];

    constructor() {
        this.id = Utils.guid();
    }

    rotate(ctx: CanvasRenderingContext2D) {
        
        if (!this.rotatepoint) {
            ctx.rotate(Math.PI * this.rotateDeg / 180);
        } else {
            ctx.save();
            ctx.translate(this.rotatepoint.x, this.rotatepoint.y);
            ctx.rotate(Math.PI * this.rotateDeg / 180);
            ctx.restore();
        }
    }

    runScript() {
        if (!this.scripts.length) {
            if (this.scripts[0].runScript(this)) 
                this.scripts.shift();
        }
    }

    clone(actor: Actor) {
        actor.id = Utils.guid();
    }

}

export const enum Draw {
    FILL = 0,
    STROKE = 1
}