var SoundManager = require("./SoundManager.js");
var Synth = require("./Synth");
var Sprite = require("./display/Sprite");

//just run the polyfill :
require("./RequestAnimFrame");

console.log("ONO");


var canvas = document.createElement("canvas");
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");
var sprites =[];

var s = new Synth();
s.tonal = 264;
s.scale = Synth.scale.pentaMinor;

window.onkeydown = function(e) {
	if (e.keyCode == 65) {
		s.playDegree(Math.floor(Math.random()*s.scale.length)+1);
	}
}


function add(sprite,ctx)
{
	sprites.push(sprite);
	sprite.ctx = ctx;
}

var update = function(time) {
	canvas.width = canvas.width;
	for(var i =0; i<sprites.length;i++)
	{
		sprites[i].update();
		sprites[i].render();
	}
};

var s = new Sprite(10,10,50,50,"#FF0000");
add(s,ctx);

(function animLoop(time) {
	window.requestAnimationFrame(animLoop);
	update(time);
})()