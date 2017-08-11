import { Actor, Draw } from './Actor';
export class Circle extends Actor {
    radius: number;
    startDeg: number;
    endDeg: number;
    anticlockwise: boolean;
    isPie: boolean;
    constructor(x: number, y: number, radius: number, drawWay?: Draw, startDeg?: number, endDeg?: number, anticlockwise?: boolean, isPie?: boolean) {
        super();
        this.position.x = x;
        this.position.y = y;
        this.radius = radius;
        this.drawWay = drawWay || Draw.FILL;
        this.startDeg = startDeg || 0;
        this.endDeg = endDeg || 360;
        this.isPie = isPie || false;
    }

    show(ctx: CanvasRenderingContext2D) {
        if (!this.rotateDeg) {
            this.rotate(ctx);
        }
        ctx.beginPath();
        let startAngle = 2 * Math.PI * this.startDeg / 360;
        let endAngle = 2 * Math.PI * this.endDeg / 360;
        if (this.isPie) ctx.moveTo(this.position.x, this.position.y);
        ctx.arc(this.position.x, this.position.y, this.radius, startAngle, endAngle, this.anticlockwise);
        if (this.isPie) ctx.lineTo(this.position.x, this.position.y);
        if (this.drawWay == Draw.FILL) {
            ctx.fill();
            ctx.fillStyle = this.style || 'rgb(0,0,0)';
        }
        else {
            ctx.stroke()
            ctx.strokeStyle = this.style || 'rgb(0,0,0)';
        }

    }
}