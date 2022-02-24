'use strict';


const AudioContext = window.AudioContext || window.webkitAudioContext;
const actx = new AudioContext();
const osc = actx.createOscillator();
osc.connect(actx.destination);
osc.start();
console.log('おわり');


// 着火のおまじない
const eventName = typeof document.ontouchend !== 'undefined' ? 'touchend' : 'mouseup';
document.addEventListener(eventName, initAudioContext);

function initAudioContext(){
  document.removeEventListener(eventName, initAudioContext);
  // wake up AudioContext
  actx.resume();
}

