// Rough draft for music player

const audio = new AudioContext();
const volume = 0.5;
var oscilators = [];

const frequencies = {
  C: [16.35, 32.70, 65.41, 130.81, 261.63, 523.25, 1046.5, 2093, 4186.01],
  C#: [17.32, 34.65, 69.3, 138.59, 277.18, 554.37, 1108.73, 2217.46, 4434.92],
  D: [18.35, 36.71, 73.42, 146.83, 293.66, 587.33, 1174.66, 2349.32, 4698.63],
  D#: [19.45, 38.89, 77.78, 155.56, 311.13, 622.25, 1244.51, 2489.02, 4978.03],
  E: [20.6, 41.2, 82.41, 164.81, 329.63, 659.25, 1318.51, 2637.02, 5274.04],
  F: [21.83, 43.65, 87.31, ],
  F#: [],
  G: [],
  G#: [],
  A: [],
  A#: [],
  B: []
}

var mainGain = audio.createGain();
mainGain.connect(audio.destination);
mainGain.gain.value = volume;

function playSong(songObject) {
  var osc = audio.createOscilator();
  osc.connect(mainGain);
  osc.frequency.value = songObject;
  osc.start();
  return osc;
}
