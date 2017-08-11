import { Actor } from './Actor/Actor';
export class Director {
    //外界引入的常用对象（道具）
    properties = {};

    //待渲染的对象（演员）
    actors = [];

    /**
     * 创建关键帧脚本（剧本）
     */
    createFrameScript() {

    }

    /**
     * 创建定时或不定时脚本（剧本）
     * @param timing 执行时长
     * @param interval 执行间隔
     */
    createTimingScript(timing: number, interval: number) {

    }
}

