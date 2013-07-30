var SoundManager = require("./SoundManager.js");
var Synth = require("./Synth");

//just run the polyfill :
require("./RequestAnimFrame");

console.log("ONO");


var s = new Synth();
s.tonal = 264;
s.scale = Synth.scale.pentaMinor;

window.onkeydown = function(e) {

	if (e.keyCode == 65) {
		s.playDegree(Math.floor(Math.random()*s.scale.length)+1);
	}

}

var update = function(time) {

};

(function animLoop(time) {
	window.requestAnimationFrame(animLoop);
	update(time);
})()