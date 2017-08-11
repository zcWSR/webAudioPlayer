import { Actor, Draw } from './Actor';
export class Tria extends Actor {
    point: { 'a': { 'x': number, 'y': number }, 'b': { 'x': number, 'y': number }, 'c': { 'x': number, 'y': number } };
    constructor(x: number, y: number, a: { 'x': number, 'y': number }, b: { 'x': number, 'y': number }, c: { 'x': number, 'y': number }, drawWay?: Draw) {
        super();
        this.position.x = x;
        this.position.y = y;
        this.point.a = a;
        this.point.b = b;
        this.point.c = c;
        this.drawWay = drawWay || Draw.FILL;
    }

    show(ctx: CanvasRenderingContext2D) {
        if (!this.rotateDeg) {
            this.rotate(ctx);
        }
        ctx.beginPath();
        ctx.moveTo(this.point.a.x, this.point.a.y);
        ctx.lineTo(this.point.b.x, this.point.b.y);
        ctx.lineTo(this.point.c.x, this.point.c.y);
        if (this.drawWay == Draw.FILL) {
            ctx.fill();
            ctx.fillStyle = this.style || 'rgb(0,0,0)';
        }
        else {
            ctx.stroke()
            ctx.strokeStyle = this.style || 'rgb(0,0,0)';
        }
    }

    clone() {
        let clone = new Tria(this.position.x, this.position.y, this.point.a, this.point.b, this.point.c, this.drawWay);
        clone.rotateDeg = this.rotateDeg;
        clone.style = this.style;
        return clone;
    }

}