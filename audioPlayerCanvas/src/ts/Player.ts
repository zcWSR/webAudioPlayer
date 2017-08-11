export class Player {
    playList: { 'name', 'url' }[];
    current: { 'name', 'url' };
    private element: HTMLAudioElement;
    private audioContext: AudioContext;
    private analyserNode: AnalyserNode;
    private analyserBufferLength: number;
    private analyserBitDataArray: Uint8Array;
    private analyserFloatDataArray: Float32Array;
    private mediaElementSource: MediaElementAudioSourceNode;
    gainNode: GainNode;

    loadProcess: number = 0;
    playProcess: number = 0;

    auto: boolean = false;
    shuffle: boolean = false;

    playing: boolean = false;


    constructor() {
        this.element = new Audio();
        this.audioContext = new AudioContext();
        this.analyserNode = this.audioContext.createAnalyser();
        this.analyserNode.fftSize = 512;
        this.analyserBufferLength = this.analyserNode.frequencyBinCount;
        this.analyserBitDataArray = new Uint8Array(this.analyserBufferLength);
        this.analyserFloatDataArray = new Float32Array(this.analyserBufferLength);
        this.gainNode = this.audioContext.createGain();
        this.gainNode.connect(this.analyserNode);
        this.analyserNode.connect(this.audioContext.destination);
        this.connectSound();
        this.initListener();
    }

    private connectSound() {
        this.mediaElementSource = this.audioContext.createMediaElementSource(this.element);
        this.mediaElementSource.connect(this.gainNode);
    }

    private disconnectSound() {
        this.mediaElementSource.disconnect();
    }

    private initListener() {
        this.element.onended = () => {
            if (this.auto) {
                this.next();
            }
        };

        this.element.onerror = () => { };

        this.element.ontimeupdate = e => {
            let buffered;
            this.element.readyState == 4 && (buffered = this.element.buffered.end(0));
            this.element.readyState == 4 && (this.loadProcess = buffered / this.element.duration);
            this.playProcess = this.element.currentTime / this.element.duration;
        };
    }

    private getMusic(): { 'name', 'url' } {
        let urlListLength = this.playList.length;
        let music: { 'name', 'url' };
        if (this.shuffle) {
            music = this.playList[Math.round((urlListLength - 1) * Math.random())];
        } else {
            if (this.element.src) {
                let index = this.playList.findIndex(value  => value.url == this.element.src);
                console.log(index);
                music = index == urlListLength - 1 ? this.playList[0] : this.playList[index + 1];
            } else {
                music = this.playList[0];
            }
        }

        return music == this.current ? this.getMusic() : music;
    }

    play() {
        if (this.element.ended || !this.element.src) {
            let music = this.getMusic();
            this.element.src = music.url;
            this.current = music;
            this.element.load();
        }
        this.gainNode.gain.value = 0.2;
        this.element.play();
        this.playing = true;
        console.log(`当前播放： ${this.current.name}`);
    }

    next() {
        let url = this.getMusic();
        let music = this.getMusic();
        this.element.src = music.url;
        this.current = music;
        this.element.load();
        this.element.play();
        this.playing = true;
        console.log(`当前播放： ${this.current.name}`);
    }

    pause() {
        this.element.pause();
        this.playing = false;
    }

    getVisualizerBitData(length = 50) {
        this.analyserNode.getByteFrequencyData(this.analyserBitDataArray);
        let step = Math.floor(this.analyserBufferLength / length);
        let array = this.analyserBitDataArray.filter((value, i) => {
            return i % step == 0;
        });

        return array.length > length ? array.slice(0, length) : array;
    }
    getVisualFloatData(length = 50) {
        
        this.analyserNode.getFloatFrequencyData(this.analyserFloatDataArray);
        let step = Math.floor(this.analyserBufferLength / length);
        let array = this.analyserFloatDataArray.filter((value, i) => {
            return i % step == 0;
        });

        return array.length > length ? array.slice(0, length) : array;
    }

}