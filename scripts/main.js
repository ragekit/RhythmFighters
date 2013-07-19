var SoundManager = require("./SoundManager.js");
var Metronome = require("./Metronome");
var Sound = require("./Sound");

//just run the polyfill :
require("./RequestAnimFrame");

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
		min = Math.min(Math.abs(SoundManager.context.currentTime - m.beatTimes[i]), min);
	}
	console.log(min);
}

var update = function(time) {

};

(function animLoop(time) {
	window.requestAnimationFrame(animLoop);
	update(time);
})()