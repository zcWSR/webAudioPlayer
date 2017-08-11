/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

class Player {
    constructor() {
        this.loadProcess = 0;
        this.playProcess = 0;
        this.auto = false;
        this.shuffle = false;
        this.playing = false;
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
    connectSound() {
        this.mediaElementSource = this.audioContext.createMediaElementSource(this.element);
        this.mediaElementSource.connect(this.gainNode);
    }
    disconnectSound() {
        this.mediaElementSource.disconnect();
    }
    initListener() {
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
    getMusic() {
        let urlListLength = this.playList.length;
        let music;
        if (this.shuffle) {
            music = this.playList[Math.round((urlListLength - 1) * Math.random())];
        }
        else {
            if (this.element.src) {
                let index = this.playList.findIndex(value => value.url == this.element.src);
                console.log(index);
                music = index == urlListLength - 1 ? this.playList[0] : this.playList[index + 1];
            }
            else {
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
exports.Player = Player;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const Player_1 = __webpack_require__(0);
let player = new Player_1.Player();
player.auto = true;


/***/ })
/******/ ]);