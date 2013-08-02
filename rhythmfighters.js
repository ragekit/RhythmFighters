;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
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


},{"./SoundManager.js":2,"./Synth":3,"./RhythmFighters":4}],2:[function(require,module,exports){
var Sound = require("./Sound");
var SoundContext = require("./SoundContext");

var SoundManager =function(){};
SoundManager.loaded = [];
SoundManager.context = new SoundContext();

SoundManager.batchLoad = function(inputArray,cb)
{


}

SoundManager.loadSound = function(url,cb)
{
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';

	// Decode asynchronously
	request.onload = function()
	{
		SoundManager.context.decodeAudioData(request.response, function(buffer)
		{
			var sound = new Sound(buffer);
			SoundManager.loaded[url] = sound;
			if(cb != undefined)
				cb.call(this,sound);
		});
	}
	request.send();
}
module.exports = SoundManager;



},{"./Sound":5,"./SoundContext":6}],3:[function(require,module,exports){
var SoundManager = require("./SoundManager")

//gap between notes in major second (ton)

var octave = 6;
var halftone = 1.05946;
var tone = halftone*halftone;

function Synth(){
	this.scale = null;
	this.tonal = null;
	this.defaultDelay = 0;
	this.defaultNoteTime = 200;
}


//gap betw notes in halftone
Synth.scale = {
	major : [2,2,1,2,2,2,1],
	minor : [2,1,2,2,1,2,2],
	chroma : [1,1,1,1,1,1,1,1,1,1,1,1],
	pentaMajor :[2,2,3,2,3],
	pentaMinor :[3,2,2,3,2],
	pentaBlueNote :[1]
}



//for debug
Synth.prototype.playScale = function(tonal,scale)
{
	for(var i=1;i<=scale.length+1;i++)
	{
		this.playDegree(i, tonal, scale,i*200/1000);
	}

}

//automatic jam, nicer than random note
Synth.prototype.getJamNote = function()
{

}

//degree 1 = tonal
Synth.prototype.playDegree = function(numb,tonal,scale,delay)
{
	//if just numb definied : play this synth tonal and scale.
	if(tonal ==undefined || scale == undefined)
	{
		tonal = this.tonal;
		scale = this.scale;
	}
	var freqMultiplier = 1;

	for(var i = 0;i<numb-1;i++)
	{
		freqMultiplier *= Math.pow(1.05946,scale[i]);
	}
	this.play(tonal * freqMultiplier,delay);
}

Synth.prototype.play = function(freq,delay)
{	
	var s = SoundManager.context.createOscillator();
	delay = delay | this.defaultDelay;
	delay = SoundManager.context.currentTime + delay;
	s.connect( SoundManager.context.destination );
	s.frequency.value = freq;
	s.start(delay);
	s.stop(delay+this.defaultNoteTime/1000);
}

module.exports = Synth;

},{"./SoundManager":2}],4:[function(require,module,exports){
var Game = require("./Game");
var Sprite = require("./display/Sprite");

RhythmFighters.prototype = Game.prototype;
RhythmFighters.prototype.constructor = RhythmFighters;

function RhythmFighters()
{
	console.log(this);
	Game.call(this,640,480,"#000000");
	var leftBar = new Sprite(100,300,10,100,"#00FFFF");

	var rightBar = new Sprite(500,300,10,100,"#FF00FF");

	this.add(leftBar);
	this.add(rightBar);

}

module.exports = RhythmFighters;
},{"./Game":7,"./display/Sprite":8}],6:[function(require,module,exports){
//soundcontext wrapper.

var SoundContext;
try
{
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	SoundContext = window.AudioContext;
}
catch (e)
{
	alert('Web Audio API is not supported in this browser');
}

module.exports = SoundContext;
},{}],8:[function(require,module,exports){

function Sprite(x,y,w,h,color)
{
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
	this.color = color;

	this.ctx;
}

Sprite.prototype.update = function()
{

}

Sprite.prototype.render = function()
{
	this.ctx.fillStyle = this.color;
	this.ctx.fillRect(this.x,this.y,this.width,this.height);
}

module.exports = Sprite;
},{}],5:[function(require,module,exports){
var SoundContext = require("./SoundContext.js");

//Wrapper around a soundBuffer

var Sound = function(buffer)
{
	this.buffer = buffer;
}

Sound.prototype.play = function(delay) {
	var source = SoundContext.createBufferSource(); 
	source.buffer = this.buffer;                    
	source.connect(SoundContext.destination);
	source.start(delay);
};

module.exports = Sound;
},{"./SoundContext.js":6}],7:[function(require,module,exports){
//just run the polyfill :
require("./RequestAnimFrame");

function Game(width,height,backgroundColor)
{
	this.width = width;
	this.height = height;

	this.backgroundColor = backgroundColor;

	this.canvas = document.createElement("canvas");

	this.canvas.width = this.width;
	this.canvas.height = this.height;

	this.canvas.style = "margin : 0 auto";

	document.body.appendChild(this.canvas);
	this.ctx = this.canvas.getContext("2d");
	this.sprites =[];
	console.log(this);
	this.loop();
}

Game.prototype.onKeyDown = function(event)
{

}

Game.prototype.add = function(sprite)
{
	this.sprites.push(sprite);
	sprite.ctx = this.ctx;
}

Game.prototype.loop = function()
{
	//shitload weird, apparently can't put this.loop directly as argument
	window.requestAnimationFrame(function(time){this.loop(time)}.bind(this));


	this.canvas.width = this.canvas.width;
	this.ctx.fillStyle = this.backgroundColor;
	this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
	for (var i=0;i<this.sprites.length;i++)
	{
		this.sprites[i].update();
		this.sprites[i].render();
	}
}

module.exports = Game;
},{"./RequestAnimFrame":9}],9:[function(require,module,exports){
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
 
// MIT license
 
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
},{}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYmVuamFtaW5nYXR0ZXQvVHJhdmF1eC9SaHl0aG1GaWdodGVycy9zY3JpcHRzL21haW4uanMiLCIvVXNlcnMvYmVuamFtaW5nYXR0ZXQvVHJhdmF1eC9SaHl0aG1GaWdodGVycy9zY3JpcHRzL1NvdW5kTWFuYWdlci5qcyIsIi9Vc2Vycy9iZW5qYW1pbmdhdHRldC9UcmF2YXV4L1JoeXRobUZpZ2h0ZXJzL3NjcmlwdHMvU3ludGguanMiLCIvVXNlcnMvYmVuamFtaW5nYXR0ZXQvVHJhdmF1eC9SaHl0aG1GaWdodGVycy9zY3JpcHRzL1JoeXRobUZpZ2h0ZXJzLmpzIiwiL1VzZXJzL2JlbmphbWluZ2F0dGV0L1RyYXZhdXgvUmh5dGhtRmlnaHRlcnMvc2NyaXB0cy9Tb3VuZENvbnRleHQuanMiLCIvVXNlcnMvYmVuamFtaW5nYXR0ZXQvVHJhdmF1eC9SaHl0aG1GaWdodGVycy9zY3JpcHRzL2Rpc3BsYXkvU3ByaXRlLmpzIiwiL1VzZXJzL2JlbmphbWluZ2F0dGV0L1RyYXZhdXgvUmh5dGhtRmlnaHRlcnMvc2NyaXB0cy9Tb3VuZC5qcyIsIi9Vc2Vycy9iZW5qYW1pbmdhdHRldC9UcmF2YXV4L1JoeXRobUZpZ2h0ZXJzL3NjcmlwdHMvR2FtZS5qcyIsIi9Vc2Vycy9iZW5qYW1pbmdhdHRldC9UcmF2YXV4L1JoeXRobUZpZ2h0ZXJzL3NjcmlwdHMvUmVxdWVzdEFuaW1GcmFtZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgU291bmRNYW5hZ2VyID0gcmVxdWlyZShcIi4vU291bmRNYW5hZ2VyLmpzXCIpO1xudmFyIFN5bnRoID0gcmVxdWlyZShcIi4vU3ludGhcIik7XG52YXIgcmYgPSByZXF1aXJlKFwiLi9SaHl0aG1GaWdodGVyc1wiKVxuY29uc29sZS5sb2coXCJPTk9cIik7XG5cbnZhciByZiA9IG5ldyByZigpO1xuXG5cbnZhciBzID0gbmV3IFN5bnRoKCk7XG5zLnRvbmFsID0gMjY0O1xucy5zY2FsZSA9IFN5bnRoLnNjYWxlLnBlbnRhTWlub3I7XG5cblxud2luZG93Lm9ua2V5ZG93biA9IGZ1bmN0aW9uKGUpIHtcblx0aWYgKGUua2V5Q29kZSA9PSA2NSkge1xuXHRcdHMucGxheURlZ3JlZShNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqcy5zY2FsZS5sZW5ndGgpKzEpO1xuXHR9XG59XG5cbiIsInZhciBTb3VuZCA9IHJlcXVpcmUoXCIuL1NvdW5kXCIpO1xudmFyIFNvdW5kQ29udGV4dCA9IHJlcXVpcmUoXCIuL1NvdW5kQ29udGV4dFwiKTtcblxudmFyIFNvdW5kTWFuYWdlciA9ZnVuY3Rpb24oKXt9O1xuU291bmRNYW5hZ2VyLmxvYWRlZCA9IFtdO1xuU291bmRNYW5hZ2VyLmNvbnRleHQgPSBuZXcgU291bmRDb250ZXh0KCk7XG5cblNvdW5kTWFuYWdlci5iYXRjaExvYWQgPSBmdW5jdGlvbihpbnB1dEFycmF5LGNiKVxue1xuXG5cbn1cblxuU291bmRNYW5hZ2VyLmxvYWRTb3VuZCA9IGZ1bmN0aW9uKHVybCxjYilcbntcblx0dmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblx0cmVxdWVzdC5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xuXHRyZXF1ZXN0LnJlc3BvbnNlVHlwZSA9ICdhcnJheWJ1ZmZlcic7XG5cblx0Ly8gRGVjb2RlIGFzeW5jaHJvbm91c2x5XG5cdHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24oKVxuXHR7XG5cdFx0U291bmRNYW5hZ2VyLmNvbnRleHQuZGVjb2RlQXVkaW9EYXRhKHJlcXVlc3QucmVzcG9uc2UsIGZ1bmN0aW9uKGJ1ZmZlcilcblx0XHR7XG5cdFx0XHR2YXIgc291bmQgPSBuZXcgU291bmQoYnVmZmVyKTtcblx0XHRcdFNvdW5kTWFuYWdlci5sb2FkZWRbdXJsXSA9IHNvdW5kO1xuXHRcdFx0aWYoY2IgIT0gdW5kZWZpbmVkKVxuXHRcdFx0XHRjYi5jYWxsKHRoaXMsc291bmQpO1xuXHRcdH0pO1xuXHR9XG5cdHJlcXVlc3Quc2VuZCgpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBTb3VuZE1hbmFnZXI7XG5cblxuIiwidmFyIFNvdW5kTWFuYWdlciA9IHJlcXVpcmUoXCIuL1NvdW5kTWFuYWdlclwiKVxuXG4vL2dhcCBiZXR3ZWVuIG5vdGVzIGluIG1ham9yIHNlY29uZCAodG9uKVxuXG52YXIgb2N0YXZlID0gNjtcbnZhciBoYWxmdG9uZSA9IDEuMDU5NDY7XG52YXIgdG9uZSA9IGhhbGZ0b25lKmhhbGZ0b25lO1xuXG5mdW5jdGlvbiBTeW50aCgpe1xuXHR0aGlzLnNjYWxlID0gbnVsbDtcblx0dGhpcy50b25hbCA9IG51bGw7XG5cdHRoaXMuZGVmYXVsdERlbGF5ID0gMDtcblx0dGhpcy5kZWZhdWx0Tm90ZVRpbWUgPSAyMDA7XG59XG5cblxuLy9nYXAgYmV0dyBub3RlcyBpbiBoYWxmdG9uZVxuU3ludGguc2NhbGUgPSB7XG5cdG1ham9yIDogWzIsMiwxLDIsMiwyLDFdLFxuXHRtaW5vciA6IFsyLDEsMiwyLDEsMiwyXSxcblx0Y2hyb21hIDogWzEsMSwxLDEsMSwxLDEsMSwxLDEsMSwxXSxcblx0cGVudGFNYWpvciA6WzIsMiwzLDIsM10sXG5cdHBlbnRhTWlub3IgOlszLDIsMiwzLDJdLFxuXHRwZW50YUJsdWVOb3RlIDpbMV1cbn1cblxuXG5cbi8vZm9yIGRlYnVnXG5TeW50aC5wcm90b3R5cGUucGxheVNjYWxlID0gZnVuY3Rpb24odG9uYWwsc2NhbGUpXG57XG5cdGZvcih2YXIgaT0xO2k8PXNjYWxlLmxlbmd0aCsxO2krKylcblx0e1xuXHRcdHRoaXMucGxheURlZ3JlZShpLCB0b25hbCwgc2NhbGUsaSoyMDAvMTAwMCk7XG5cdH1cblxufVxuXG4vL2F1dG9tYXRpYyBqYW0sIG5pY2VyIHRoYW4gcmFuZG9tIG5vdGVcblN5bnRoLnByb3RvdHlwZS5nZXRKYW1Ob3RlID0gZnVuY3Rpb24oKVxue1xuXG59XG5cbi8vZGVncmVlIDEgPSB0b25hbFxuU3ludGgucHJvdG90eXBlLnBsYXlEZWdyZWUgPSBmdW5jdGlvbihudW1iLHRvbmFsLHNjYWxlLGRlbGF5KVxue1xuXHQvL2lmIGp1c3QgbnVtYiBkZWZpbmllZCA6IHBsYXkgdGhpcyBzeW50aCB0b25hbCBhbmQgc2NhbGUuXG5cdGlmKHRvbmFsID09dW5kZWZpbmVkIHx8IHNjYWxlID09IHVuZGVmaW5lZClcblx0e1xuXHRcdHRvbmFsID0gdGhpcy50b25hbDtcblx0XHRzY2FsZSA9IHRoaXMuc2NhbGU7XG5cdH1cblx0dmFyIGZyZXFNdWx0aXBsaWVyID0gMTtcblxuXHRmb3IodmFyIGkgPSAwO2k8bnVtYi0xO2krKylcblx0e1xuXHRcdGZyZXFNdWx0aXBsaWVyICo9IE1hdGgucG93KDEuMDU5NDYsc2NhbGVbaV0pO1xuXHR9XG5cdHRoaXMucGxheSh0b25hbCAqIGZyZXFNdWx0aXBsaWVyLGRlbGF5KTtcbn1cblxuU3ludGgucHJvdG90eXBlLnBsYXkgPSBmdW5jdGlvbihmcmVxLGRlbGF5KVxue1x0XG5cdHZhciBzID0gU291bmRNYW5hZ2VyLmNvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xuXHRkZWxheSA9IGRlbGF5IHwgdGhpcy5kZWZhdWx0RGVsYXk7XG5cdGRlbGF5ID0gU291bmRNYW5hZ2VyLmNvbnRleHQuY3VycmVudFRpbWUgKyBkZWxheTtcblx0cy5jb25uZWN0KCBTb3VuZE1hbmFnZXIuY29udGV4dC5kZXN0aW5hdGlvbiApO1xuXHRzLmZyZXF1ZW5jeS52YWx1ZSA9IGZyZXE7XG5cdHMuc3RhcnQoZGVsYXkpO1xuXHRzLnN0b3AoZGVsYXkrdGhpcy5kZWZhdWx0Tm90ZVRpbWUvMTAwMCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU3ludGg7XG4iLCJ2YXIgR2FtZSA9IHJlcXVpcmUoXCIuL0dhbWVcIik7XG52YXIgU3ByaXRlID0gcmVxdWlyZShcIi4vZGlzcGxheS9TcHJpdGVcIik7XG5cblJoeXRobUZpZ2h0ZXJzLnByb3RvdHlwZSA9IEdhbWUucHJvdG90eXBlO1xuUmh5dGhtRmlnaHRlcnMucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gUmh5dGhtRmlnaHRlcnM7XG5cbmZ1bmN0aW9uIFJoeXRobUZpZ2h0ZXJzKClcbntcblx0Y29uc29sZS5sb2codGhpcyk7XG5cdEdhbWUuY2FsbCh0aGlzLDY0MCw0ODAsXCIjMDAwMDAwXCIpO1xuXHR2YXIgbGVmdEJhciA9IG5ldyBTcHJpdGUoMTAwLDMwMCwxMCwxMDAsXCIjMDBGRkZGXCIpO1xuXG5cdHZhciByaWdodEJhciA9IG5ldyBTcHJpdGUoNTAwLDMwMCwxMCwxMDAsXCIjRkYwMEZGXCIpO1xuXG5cdHRoaXMuYWRkKGxlZnRCYXIpO1xuXHR0aGlzLmFkZChyaWdodEJhcik7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSaHl0aG1GaWdodGVyczsiLCIvL3NvdW5kY29udGV4dCB3cmFwcGVyLlxuXG52YXIgU291bmRDb250ZXh0O1xudHJ5XG57XG5cdHdpbmRvdy5BdWRpb0NvbnRleHQgPSB3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQ7XG5cdFNvdW5kQ29udGV4dCA9IHdpbmRvdy5BdWRpb0NvbnRleHQ7XG59XG5jYXRjaCAoZSlcbntcblx0YWxlcnQoJ1dlYiBBdWRpbyBBUEkgaXMgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXInKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTb3VuZENvbnRleHQ7IiwiXG5mdW5jdGlvbiBTcHJpdGUoeCx5LHcsaCxjb2xvcilcbntcblx0dGhpcy54ID0geDtcblx0dGhpcy55ID0geTtcblx0dGhpcy53aWR0aCA9IHc7XG5cdHRoaXMuaGVpZ2h0ID0gaDtcblx0dGhpcy5jb2xvciA9IGNvbG9yO1xuXG5cdHRoaXMuY3R4O1xufVxuXG5TcHJpdGUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKClcbntcblxufVxuXG5TcHJpdGUucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKClcbntcblx0dGhpcy5jdHguZmlsbFN0eWxlID0gdGhpcy5jb2xvcjtcblx0dGhpcy5jdHguZmlsbFJlY3QodGhpcy54LHRoaXMueSx0aGlzLndpZHRoLHRoaXMuaGVpZ2h0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTcHJpdGU7IiwidmFyIFNvdW5kQ29udGV4dCA9IHJlcXVpcmUoXCIuL1NvdW5kQ29udGV4dC5qc1wiKTtcblxuLy9XcmFwcGVyIGFyb3VuZCBhIHNvdW5kQnVmZmVyXG5cbnZhciBTb3VuZCA9IGZ1bmN0aW9uKGJ1ZmZlcilcbntcblx0dGhpcy5idWZmZXIgPSBidWZmZXI7XG59XG5cblNvdW5kLnByb3RvdHlwZS5wbGF5ID0gZnVuY3Rpb24oZGVsYXkpIHtcblx0dmFyIHNvdXJjZSA9IFNvdW5kQ29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTsgXG5cdHNvdXJjZS5idWZmZXIgPSB0aGlzLmJ1ZmZlcjsgICAgICAgICAgICAgICAgICAgIFxuXHRzb3VyY2UuY29ubmVjdChTb3VuZENvbnRleHQuZGVzdGluYXRpb24pO1xuXHRzb3VyY2Uuc3RhcnQoZGVsYXkpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTb3VuZDsiLCIvL2p1c3QgcnVuIHRoZSBwb2x5ZmlsbCA6XG5yZXF1aXJlKFwiLi9SZXF1ZXN0QW5pbUZyYW1lXCIpO1xuXG5mdW5jdGlvbiBHYW1lKHdpZHRoLGhlaWdodCxiYWNrZ3JvdW5kQ29sb3IpXG57XG5cdHRoaXMud2lkdGggPSB3aWR0aDtcblx0dGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG5cblx0dGhpcy5iYWNrZ3JvdW5kQ29sb3IgPSBiYWNrZ3JvdW5kQ29sb3I7XG5cblx0dGhpcy5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuXG5cdHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy53aWR0aDtcblx0dGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG5cblx0dGhpcy5jYW52YXMuc3R5bGUgPSBcIm1hcmdpbiA6IDAgYXV0b1wiO1xuXG5cdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xuXHR0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcblx0dGhpcy5zcHJpdGVzID1bXTtcblx0Y29uc29sZS5sb2codGhpcyk7XG5cdHRoaXMubG9vcCgpO1xufVxuXG5HYW1lLnByb3RvdHlwZS5vbktleURvd24gPSBmdW5jdGlvbihldmVudClcbntcblxufVxuXG5HYW1lLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihzcHJpdGUpXG57XG5cdHRoaXMuc3ByaXRlcy5wdXNoKHNwcml0ZSk7XG5cdHNwcml0ZS5jdHggPSB0aGlzLmN0eDtcbn1cblxuR2FtZS5wcm90b3R5cGUubG9vcCA9IGZ1bmN0aW9uKClcbntcblx0Ly9zaGl0bG9hZCB3ZWlyZCwgYXBwYXJlbnRseSBjYW4ndCBwdXQgdGhpcy5sb29wIGRpcmVjdGx5IGFzIGFyZ3VtZW50XG5cdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24odGltZSl7dGhpcy5sb29wKHRpbWUpfS5iaW5kKHRoaXMpKTtcblxuXG5cdHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy5jYW52YXMud2lkdGg7XG5cdHRoaXMuY3R4LmZpbGxTdHlsZSA9IHRoaXMuYmFja2dyb3VuZENvbG9yO1xuXHR0aGlzLmN0eC5maWxsUmVjdCgwLDAsdGhpcy5jYW52YXMud2lkdGgsdGhpcy5jYW52YXMuaGVpZ2h0KTtcblx0Zm9yICh2YXIgaT0wO2k8dGhpcy5zcHJpdGVzLmxlbmd0aDtpKyspXG5cdHtcblx0XHR0aGlzLnNwcml0ZXNbaV0udXBkYXRlKCk7XG5cdFx0dGhpcy5zcHJpdGVzW2ldLnJlbmRlcigpO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZTsiLCIvLyBodHRwOi8vcGF1bGlyaXNoLmNvbS8yMDExL3JlcXVlc3RhbmltYXRpb25mcmFtZS1mb3Itc21hcnQtYW5pbWF0aW5nL1xuLy8gaHR0cDovL215Lm9wZXJhLmNvbS9lbW9sbGVyL2Jsb2cvMjAxMS8xMi8yMC9yZXF1ZXN0YW5pbWF0aW9uZnJhbWUtZm9yLXNtYXJ0LWVyLWFuaW1hdGluZ1xuIFxuLy8gcmVxdWVzdEFuaW1hdGlvbkZyYW1lIHBvbHlmaWxsIGJ5IEVyaWsgTcO2bGxlci4gZml4ZXMgZnJvbSBQYXVsIElyaXNoIGFuZCBUaW5vIFppamRlbFxuIFxuLy8gTUlUIGxpY2Vuc2VcbiBcbihmdW5jdGlvbigpIHtcbiAgICB2YXIgbGFzdFRpbWUgPSAwO1xuICAgIHZhciB2ZW5kb3JzID0gWydtcycsICdtb3onLCAnd2Via2l0JywgJ28nXTtcbiAgICBmb3IodmFyIHggPSAwOyB4IDwgdmVuZG9ycy5sZW5ndGggJiYgIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7ICsreCkge1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvcnNbeF0rJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddO1xuICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1t4XSsnQ2FuY2VsQW5pbWF0aW9uRnJhbWUnXSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgd2luZG93W3ZlbmRvcnNbeF0rJ0NhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSddO1xuICAgIH1cbiBcbiAgICBpZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbihjYWxsYmFjaywgZWxlbWVudCkge1xuICAgICAgICAgICAgdmFyIGN1cnJUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICB2YXIgdGltZVRvQ2FsbCA9IE1hdGgubWF4KDAsIDE2IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKTtcbiAgICAgICAgICAgIHZhciBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBjYWxsYmFjayhjdXJyVGltZSArIHRpbWVUb0NhbGwpOyB9LCBcbiAgICAgICAgICAgICAgdGltZVRvQ2FsbCk7XG4gICAgICAgICAgICBsYXN0VGltZSA9IGN1cnJUaW1lICsgdGltZVRvQ2FsbDtcbiAgICAgICAgICAgIHJldHVybiBpZDtcbiAgICAgICAgfTtcbiBcbiAgICBpZiAoIXdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSlcbiAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChpZCk7XG4gICAgICAgIH07XG59KCkpOyJdfQ==
;