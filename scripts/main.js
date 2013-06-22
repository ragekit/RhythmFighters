var SoundManager = require("./SoundManager.js");
var Metronome = require("./Metronome");
var Sound = require("./Sound");
console.log("ONO");
SoundManager.loadSound("bip.wav",function(buffer){
	var s = new Sound(buffer);
	var m = new Metronome(s);
	m.play();

})


