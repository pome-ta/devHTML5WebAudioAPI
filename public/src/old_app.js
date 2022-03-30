'use strict';

// 着火のおまじない
const eventName = typeof document.ontouchend !== 'undefined' ? 'touchend' : 'mouseup';
document.addEventListener(eventName, initAudioContext);

function initAudioContext(){
  document.removeEventListener(eventName, initAudioContext);
  // wake up AudioContext
  actx.resume();
}

let xxx = 1;

const AudioContext = window.AudioContext || window.webkitAudioContext;
const actx = new AudioContext();
/*
// 簡単なsine波
const osc = actx.createOscillator();
osc.connect(actx.destination);
osc.start();
*/


// https://developer.mozilla.org/ja/docs/Web/API/AudioBuffer

// ステレオ
const channels = 2;
// AudioContextのサンプルレートで2秒間の空のステレオバッファ生成
const frameCount = actx.sampleRate * 0.1;
const myArrayBuffer = actx.createBuffer(channels, frameCount, actx.sampleRate);

//console.log(actx.sampleRate);  // 44100

//document.addEventListener(eventName, {inxxx: xxx, handleEvent: callSineWava});
//document.addEventListener(eventName, callSineWava);

document.addEventListener(eventName, {audioContext: actx, handleEvent: callSineWava});

function callWhiteNoise() {
  // バッファにホワイトノイズを書き込む;
  // 単なる-1.0から1.0の間の乱数の値である
  for (let channel = 0; channel < channels; channel++) {
    // 実際のデータの配列を得る
    let nowBuffering = myArrayBuffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      // Math.random()は[0; 1.0]である
      // 音声は[-1.0; 1.0]である必要がある
      nowBuffering[i] = Math.random() * 2 - 1;
    }
  }
  
  // AudioBufferSourceNodeを得る
  // これはAudioBufferを再生するときに使うAudioNode
  let source = actx.createBufferSource();
  // AudioBufferSourceNodeにバッファを設定する
  source.buffer = myArrayBuffer;
  // AudioBufferSourceNodeを出力先に接続、音声が聞こえる
  source.connect(actx.destination);

  // 音源の再生を始める
  source.start();
}


// https://teropa.info/blog/2016/08/04/sine-waves.html
const REAL_TIME_FREQUENCY = 440.0;
const ANGULAR_FREQUENCY = REAL_TIME_FREQUENCY * 2 * Math.PI;

const geneSineWave = (sampleNumber) => {
  const sampleTime = sampleNumber / actx.sampleRate;
  const sampleAngle = sampleTime * ANGULAR_FREQUENCY;
  return Math.sin(sampleAngle);
}

function callSineWava(e) {
  //this.inxxx = this.inxxx.bind(this);
  /*
  console.log('---------');
  console.log(` xxx : ${xxx}`);
  console.log(`inxxx: ${this.inxxx}`);
  console.log(xxx === this.inxxx);
  
  //++this.inxxx;
  this.inxxx += 1;
  */
  for (let channel = 0; channel < channels; channel++) {
    // 実際のデータの配列を得る
    const nowBuffering = myArrayBuffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      nowBuffering[i] = geneSineWave(i);
    }
  }
  
  // AudioBufferSourceNodeを得る
  // これはAudioBufferを再生するときに使うAudioNode
  const source = this.audioContext.createBufferSource();
  // AudioBufferSourceNodeにバッファを設定する
  source.buffer = myArrayBuffer;
  // AudioBufferSourceNodeを出力先に接続、音声が聞こえる
  source.connect(actx.destination);

  // 音源の再生を始める
  source.start();
}

