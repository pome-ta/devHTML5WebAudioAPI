//import {callSineWava} from './waveGenerator.js';

// 着火のおまじない
const eventName = typeof document.ontouchend !== 'undefined' ? 'touchend' : 'mouseup';
document.addEventListener(eventName, initAudioContext);

function initAudioContext(){
  document.removeEventListener(eventName, initAudioContext);
  // wake up AudioContext
  actx.resume();
}

const AudioContext = window.AudioContext || window.webkitAudioContext;
const actx = new AudioContext();

// 簡単なsine波
const osc = actx.createOscillator();
osc.connect(actx.destination);
osc.start();



const channels = 2;
// AudioContextのサンプルレートで2秒間の空のステレオバッファ生成
const frameCount = actx.sampleRate * 0.1;
const myArrayBuffer = actx.createBuffer(channels, frameCount, actx.sampleRate);

let preTime = 0;
function update(timestamp) {
  let diffTime = timestamp - preTime;
  
  
  requestAnimationFrame(update);
  preTime = timestamp;
}
requestAnimationFrame(update);
