var SoundManager = require("./SoundManager.js");
var Metronome = require("./Metronome");
var Sound = require("./Sound");
console.log("ONO");
SoundManager.loadSound("bip.wav",function(sound){
	
	var m = new Metronome(sound);
	//m.play();

})


