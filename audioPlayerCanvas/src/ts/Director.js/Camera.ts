import { Actor } from './Actor/Actor';
export class Camera {
    element: HTMLCanvasElement;
    canvasWidth: number;
    canvasHeight: number;
    context: CanvasRenderingContext2D;
    actors: [any];
    running: boolean = false;
    construction(canvasElement: HTMLCanvasElement) {
        this.element = canvasElement;
        this.canvasWidth = canvasElement.offsetWidth;
        this.canvasHeight = canvasElement.offsetHeight;
        canvasElement.width = this.canvasWidth;
        canvasElement.height = this.canvasHeight;
        this.context = canvasElement.getContext('2d');
    }

    resize(width: number, height: number) {
        this.canvasWidth = this.element.offsetWidth;
        this.canvasHeight = this.element.offsetHeight;
        this.element.width = this.canvasWidth;
        this.element.height = this.canvasHeight;
    }

    addActor(...actor: Actor[]) {
        this.actors.push(actor);
    }

    exposure() {
        for(let actor of this.actors) {
            actor.runScript();
            actor.show();
        }
    }

    REC() {
        this.context.translate(this.canvasWidth / 2, this.canvasHeight / 2);
        this.context.save();
        
    }




}