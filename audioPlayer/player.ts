class Player {
    playList: { 'name', 'url' }[];
    current: { 'name', 'url' };
    private element: HTMLAudioElement;
    private audioContext: AudioContext;
    private analyserNode: AnalyserNode;
    private analyserBufferLength: number;
    private analyserDataArray: Uint8Array;
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
        this.analyserDataArray = new Uint8Array(this.analyserBufferLength);
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
                let index = this.playList.findIndex(value => value.url == this.element.src);
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

    getVisualizerData(length = 50) {
        this.analyserNode.getByteFrequencyData(this.analyserDataArray);
        let step = Math.floor(this.analyserBufferLength / length);
        let array = this.analyserDataArray.filter((value, i) => {
            return i % step == 0;
        });

        return array.length > length ? array.slice(0, length) : array;
    }

}


let repeatTime = 5;

function createVisualizer(count: number, pieLength: number): HTMLDivElement[] {
    count = count - count % repeatTime;
    console.log(count);
    let deg = 360 / count;
    let width = pieLength * Math.sin(2 * Math.PI * deg / 2 / 360) * 2;
    let nodeList = [];
    for (let i = 0; i < count; i++) {
        let ele = document.createElement('div');
        ele.style.position = 'absolute';
        //ele.style.cssFloat = 'left';
        ele.style.height = '10px';
        ele.style.width = `${width}px`;
        ele.style.background = 'gray';
        ele.style.opacity = '0.2';
        ele.style.transformOrigin = `top ${width / 2}px`;
        ele.style.transform = `rotate(${deg * i - 180}deg)`;
        nodeList.push(ele);
        document.getElementById('visualizer').appendChild(ele);
    }

    return nodeList;
}

function draw() {
    requestAnimationFrame(draw);
    document.getElementById('loadProcess').style.width = 1000 * player.loadProcess + 'px';
    document.getElementById('playProcess').style.width = 1000 * player.playProcess + 'px';
    if (player.playing) {
        deg += 0.1;
        imgElement.style.transform = `rotate(${deg}deg)`;
    }
    if (player.playProcess < 0.5)
        pie.style.backgroundImage =
            `linear-gradient(90deg, white 50%, transparent 50%),
    linear-gradient(${- 90 + 180 * (player.playProcess * 2)}deg, white 50%, transparent 50%)`
    else
        pie.style.backgroundImage =
            `linear-gradient(${90 + 180 * (player.playProcess - 0.5) * 2}deg, transparent 50%, orange 50%),
        linear-gradient(90deg, white 50%, transparent 50%)`
    let array = player.getVisualizerData(nodeList.length / repeatTime);
    let arrayLength = array.length;
    for (let i = 0; i < repeatTime; i++) {
        for (let j = 0; j < arrayLength; j++) {
                nodeList[arrayLength * i + j].style.height = (array[j]* 0.3 + 100) + 'px';

        }

    }
}

function getMusicUrl(): Promise<{ 'name', 'url' }[]> {
    return new Promise((resolve, reject) => {
        let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = () => {
            if (ajax.readyState == 4) {
                if (ajax.status == 200) {
                    let musics: string[] = JSON.parse(ajax.responseText)['musics'];
                    resolve(musics);
                }
                else
                    reject(ajax.responseText);
            }
        }
        ajax.open("get", "music/list.json");
        ajax.send();
    })
}

let player = new Player();
let nodeList = createVisualizer(80, 100);
let imgElement = document.getElementById('avatar');
let pie = document.getElementById('pie');
let deg = 0;
draw();
getMusicUrl().then(musics => {
    player.playList = musics;
    player.auto = true;
    player.shuffle = true;
    player.play();
})



document.getElementById('playBtn').addEventListener('click', (e) => {
    if (!player.playing) {
        player.play();
    } else {
        player.pause();
    }
})

document.getElementById('nextBtn').addEventListener('click', (e) => {
    player.next();
})

document.getElementById('volumeSlider').addEventListener('change', (e) => {
    player.gainNode.gain.value = parseInt(e.target.value) / 100;
});

document.getElementById('avatar').addEventListener('click', e => {
        if (!player.playing) {
        player.play();
    } else {
        player.pause();
    }
});



