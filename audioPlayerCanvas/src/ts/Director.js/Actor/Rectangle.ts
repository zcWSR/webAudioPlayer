import { Actor, Draw } from './Actor';
export class Rect extends Actor {
    width: number;
    height: number;
    constructor(x: number, y: number, width: number, height: number, drawWay?: Draw) {
        super();
        this.name = 'rect_' + this.id;
        this.position.x = x;
        this.position.y = y;
        this.width = width;
        this.height = height;
        this.drawWay = drawWay || Draw.FILL;
    }

    show(ctx: CanvasRenderingContext2D) {
        if (!this.rotateDeg) {
            this.rotate(ctx);
        }
        
        if (this.drawWay) {
            ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
            ctx.fillStyle = this.style || 'rgb(0,0,0)';
        }
        else {
            ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);
            ctx.strokeStyle = this.style || 'rgb(0,0,0)';
        }

    }




    clone(): Rect {
        let clone = new Rect(this.position.x, this.position.y, this.width, this.height, this.drawWay);
        super.clone(clone);
        clone.rotateDeg = this.rotateDeg;
        clone.style = this.style;
        return clone;
    }
}
