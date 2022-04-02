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

// 波形(ここでは簡単にするために sine 波形)
const buffer = new Float32Array(2048);
for(let i = 0, l = buffer.length; ++i) {
    buffer[i] = Math.sin(Math.PI * 2 * i / 2048);
}

// 離散フーリエ変換で倍音構成に変換
const fdata = fft(buffer);

// PeriodicWave を作る
const periodic = actx.createPeriodicWave(...fdata);

// 離散フーリエ変換をする函数
function fft(input) {
    let n = input.length;
    let theta = 2 * Math.PI / n;
    let ar = new Float32Array(n);
    let ai = new Float32Array(n);
    let m, mh, i, j, k, irev, wr, wi, xr, xi;
    let cos = Math.cos;
    let sin = Math.sin;

    for(i = 0; i < n; ++i) {
        ar[i] = input[i];
    }

    // scrambler
    i = 0;
    for(j=1; j<n-1; ++j) {
        for(k = n>>1; k>(i ^= k); k>>=1);
        if(j<i) {
            xr = ar[j];
            xi = ai[j];
            ar[j] = ar[i];
            ai[j] = ai[i];
            ar[i] = xr;
            ai[i] = xi;
        }
    }
    for(mh=1; (m = mh << 1) <= n; mh=m) {
        irev = 0;
        for(i=0; i<n; i+=m) {
            wr = cos(theta * irev);
            wi = sin(theta * irev);
            for(k=n>>2; k > (irev ^= k); k>>=1);
            for(j=i; j<mh+i; ++j) {
                k = j + mh;
                xr = ar[j] - ar[k];
                xi = ai[j] - ai[k];
                ar[j] += ar[k];
                ai[j] += ai[k];
                ar[k] = wr * xr - wi * xi;
                ai[k] = wr * xi + wi * xr;
            }
        }
    }

    // remove DC offset
    ar[0] = 0;
    ar[0] = 0;

    return [ar, ai];
}

function play() {
console.log('play');
const osc = actx.createOscillator();
osc.setPeriodicWave(periodic);
osc.connect(actx.destination);
osc.start(actx.currentTime);
osc.stop(actx.currentTime + 3.0);
}

document.addEventListener(eventName, play);





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
/*

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

*/
