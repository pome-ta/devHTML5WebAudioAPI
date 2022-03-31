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


/*
const createWave = (func, duration) => {
  let sampleRate = actx.sampleRate;
  let dt = 1 / sampleRate;
  let buffer = actx.createBuffer(1, sampleRate * duration, sampleRate);
  let data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
      data[i] = func(dt * i);
  }
  return buffer;
}

const playSound = (buffer) => {
  const source = actx.createBufferSource();
  source.buffer = buffer;
  source.connect(actx.destination);
  source.start(0);
}

let func = (t) => Math.sin(2 * Math.PI * 440 * t);
const buffer = createWave(func, 10);
playSound(buffer);
*/


/*
// 簡単なsine波
const osc = actx.createOscillator();
osc.connect(actx.destination);
osc.start();
*/


const REAL_TIME_FREQUENCY = 440.0;
const ANGULAR_FREQUENCY = REAL_TIME_FREQUENCY * 2 * Math.PI;

const geneSineWave = (sampleNumber) => {
  const sampleTime = sampleNumber / actx.sampleRate;
  const sampleAngle = sampleTime * ANGULAR_FREQUENCY;
  return Math.sin(sampleAngle);
}

const channels = 2;

let preTime = 0;
function update(timestamp) {
  let diffTime = timestamp - preTime;
  const frameCount = actx.sampleRate * diffTime / 1000.0;
  const myArrayBuffer = actx.createBuffer(channels, frameCount, actx.sampleRate);

  for (let channel = 0; channel < channels; channel++) {
    const nowBuffering = myArrayBuffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      nowBuffering[i] = geneSineWave(i);
    }
  }
  const source = actx.createBufferSource();
  source.buffer = myArrayBuffer;
  source.connect(actx.destination);
  source.start();
  requestAnimationFrame(update);
  preTime = timestamp;
}
requestAnimationFrame(update);


