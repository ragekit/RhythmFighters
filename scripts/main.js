var SoundManager = require("./SoundManager.js");
var Synth = require("./Synth");
var rf = require("./RhythmFighters")
console.log("ONO");

var rf = new rf();


var s = new Synth();
s.tonal = 264;
s.scale = Synth.scale.pentaMinor;


window.onkeydown = function(e) {
	if (e.keyCode == 65) {
		s.playDegree(Math.floor(Math.random()*s.scale.length)+1);
	}
}

