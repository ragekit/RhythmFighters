var SoundManager = require("./SoundManager.js");
var Synth = require("./Synth");

//just run the polyfill :
require("./RequestAnimFrame");

console.log("ONO");


var s = new Synth();

window.onkeydown = function(e) {

	if (e.keyCode == 65) {
		s.playScale(264, Synth.scale.pentaMinor);
		console.log("kdown");
	}

}

var update = function(time) {

};

(function animLoop(time) {
	window.requestAnimationFrame(animLoop);
	update(time);
})()