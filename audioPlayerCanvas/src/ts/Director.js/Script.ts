import { Actor } from './Actor/Actor';
export class FrameScript {
    repetition: number = Number.POSITIVE_INFINITY;
    counter: number = 0;
    isOver: boolean;
    script: (actor: Actor, counter?: number) => {};

    runScript(actor: Actor): boolean {
        if (this.counter < this.repetition) {
            this.script(actor, this.counter);
            return false;
        } else {
            return true;
        }
    }
}