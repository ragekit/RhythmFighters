var SoundManager = require("./SoundManager.js");
var Metronome = require("./Metronome");
var Sound = require("./Sound");
var Raf = require("./RequestAnimFrame");
var sc = require("./SoundContext");

console.log("ONO");
var m;
SoundManager.loadSound("bip.wav", function(sound) {

	m = new Metronome(sound);

});

window.onkeydown = function(e) {

	if (e.keyCode == 65) {
		m.toggle();
	}

	var min = 1000000;

	for (var i = 0; i < m.beatTimes.length; i++) {
		min = Math.min(Math.abs(sc.currentTime - m.beatTimes[i]), min);
	}

	console.log(min);
}

var update = function(time) {

};

(function animLoop(time) {
	Raf(animLoop);
	update(time);
})()