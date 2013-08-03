;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
var SoundManager = require("./SoundManager.js");
var Synth = require("./Synth");
var rf = require("./RhythmFighters")
console.log("ONO");

var rf = new rf();


var s = new Synth();
s.tonal = 264;
s.scale = Synth.scale.pentaMinor;

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

RhythmFighters.prototype = Object.create(Game.prototype);
RhythmFighters.prototype.constructor = RhythmFighters;

function RhythmFighters()
{
	Game.call(this,640,480,"#000000");
	var leftBar = new Sprite(0,0,10,100,"#00FFFF");
	this.partition = new Sprite(100,300,400,100,"#FFFFFF");

	var rightBar = new Sprite(this.partition.width -10,0,10,100,"#FF00FF");

	this.add(this.partition);

	this.partition.add(leftBar);
	this.partition.add(rightBar);
	//partition.add(rightBar);

	this.notes = [];
	this.loop();
}



RhythmFighters.prototype.loop = function(time)
{
	Game.prototype.loop.call(this,time);
	//console.log(this.notes);

	for(var i =0;i<this.notes.length;i++)
	{
		this.notes[i].x ++ ;
	}
}

RhythmFighters.prototype.onKeyDown = function(e)
{
	if(e.keyCode == 65)
	{
		this.sendNote();
	}
}

RhythmFighters.prototype.sendNote = function()
{
	console.log("note");

	var note = new Sprite(0, 0, 20, 20, "#FF0000");

	this.notes.push(note);
	this.partition.add(note);

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
	this.children = [];
	this.parent = null;

	this.ctx;
}

Sprite.prototype.add = function(spr)
{
	spr.ctx = this.ctx;
	this.children.push(spr);
	spr.parent = this;
}

Sprite.prototype.update = function()
{

}

Sprite.prototype.render = function()
{
	//save current matrix
	var pos = {x:this.x,y:this.y};
	
	this.ctx.fillStyle = this.color;

	this.x = this.parent != null ? this.parent.x + this.x : this.x; 
	this.y = this.parent != null ? this.parent.y + this.y : this.y; 

	this.ctx.fillRect(this.x,this.y,this.width,this.height);

	this.renderChildren();

	//restore relative pos;
	this.x = pos.x;
	this.y = pos.y;
}

Sprite.prototype.renderChildren = function()
{

	for(var i =0;i<this.children.length;i++)
	{
		this.children[i].render();
	}	
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
	
	window.onkeydown = this.onKeyDown.bind(this);
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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYmVuamFtaW5nYXR0ZXQvVHJhdmF1eC9SaHl0aG1GaWdodGVycy9zY3JpcHRzL21haW4uanMiLCIvVXNlcnMvYmVuamFtaW5nYXR0ZXQvVHJhdmF1eC9SaHl0aG1GaWdodGVycy9zY3JpcHRzL1NvdW5kTWFuYWdlci5qcyIsIi9Vc2Vycy9iZW5qYW1pbmdhdHRldC9UcmF2YXV4L1JoeXRobUZpZ2h0ZXJzL3NjcmlwdHMvU3ludGguanMiLCIvVXNlcnMvYmVuamFtaW5nYXR0ZXQvVHJhdmF1eC9SaHl0aG1GaWdodGVycy9zY3JpcHRzL1JoeXRobUZpZ2h0ZXJzLmpzIiwiL1VzZXJzL2JlbmphbWluZ2F0dGV0L1RyYXZhdXgvUmh5dGhtRmlnaHRlcnMvc2NyaXB0cy9Tb3VuZENvbnRleHQuanMiLCIvVXNlcnMvYmVuamFtaW5nYXR0ZXQvVHJhdmF1eC9SaHl0aG1GaWdodGVycy9zY3JpcHRzL2Rpc3BsYXkvU3ByaXRlLmpzIiwiL1VzZXJzL2JlbmphbWluZ2F0dGV0L1RyYXZhdXgvUmh5dGhtRmlnaHRlcnMvc2NyaXB0cy9Tb3VuZC5qcyIsIi9Vc2Vycy9iZW5qYW1pbmdhdHRldC9UcmF2YXV4L1JoeXRobUZpZ2h0ZXJzL3NjcmlwdHMvR2FtZS5qcyIsIi9Vc2Vycy9iZW5qYW1pbmdhdHRldC9UcmF2YXV4L1JoeXRobUZpZ2h0ZXJzL3NjcmlwdHMvUmVxdWVzdEFuaW1GcmFtZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbInZhciBTb3VuZE1hbmFnZXIgPSByZXF1aXJlKFwiLi9Tb3VuZE1hbmFnZXIuanNcIik7XG52YXIgU3ludGggPSByZXF1aXJlKFwiLi9TeW50aFwiKTtcbnZhciByZiA9IHJlcXVpcmUoXCIuL1JoeXRobUZpZ2h0ZXJzXCIpXG5jb25zb2xlLmxvZyhcIk9OT1wiKTtcblxudmFyIHJmID0gbmV3IHJmKCk7XG5cblxudmFyIHMgPSBuZXcgU3ludGgoKTtcbnMudG9uYWwgPSAyNjQ7XG5zLnNjYWxlID0gU3ludGguc2NhbGUucGVudGFNaW5vcjtcbiIsInZhciBTb3VuZCA9IHJlcXVpcmUoXCIuL1NvdW5kXCIpO1xudmFyIFNvdW5kQ29udGV4dCA9IHJlcXVpcmUoXCIuL1NvdW5kQ29udGV4dFwiKTtcblxudmFyIFNvdW5kTWFuYWdlciA9ZnVuY3Rpb24oKXt9O1xuU291bmRNYW5hZ2VyLmxvYWRlZCA9IFtdO1xuU291bmRNYW5hZ2VyLmNvbnRleHQgPSBuZXcgU291bmRDb250ZXh0KCk7XG5cblNvdW5kTWFuYWdlci5iYXRjaExvYWQgPSBmdW5jdGlvbihpbnB1dEFycmF5LGNiKVxue1xuXG5cbn1cblxuU291bmRNYW5hZ2VyLmxvYWRTb3VuZCA9IGZ1bmN0aW9uKHVybCxjYilcbntcblx0dmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblx0cmVxdWVzdC5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xuXHRyZXF1ZXN0LnJlc3BvbnNlVHlwZSA9ICdhcnJheWJ1ZmZlcic7XG5cblx0Ly8gRGVjb2RlIGFzeW5jaHJvbm91c2x5XG5cdHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24oKVxuXHR7XG5cdFx0U291bmRNYW5hZ2VyLmNvbnRleHQuZGVjb2RlQXVkaW9EYXRhKHJlcXVlc3QucmVzcG9uc2UsIGZ1bmN0aW9uKGJ1ZmZlcilcblx0XHR7XG5cdFx0XHR2YXIgc291bmQgPSBuZXcgU291bmQoYnVmZmVyKTtcblx0XHRcdFNvdW5kTWFuYWdlci5sb2FkZWRbdXJsXSA9IHNvdW5kO1xuXHRcdFx0aWYoY2IgIT0gdW5kZWZpbmVkKVxuXHRcdFx0XHRjYi5jYWxsKHRoaXMsc291bmQpO1xuXHRcdH0pO1xuXHR9XG5cdHJlcXVlc3Quc2VuZCgpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBTb3VuZE1hbmFnZXI7XG5cblxuIiwidmFyIFNvdW5kTWFuYWdlciA9IHJlcXVpcmUoXCIuL1NvdW5kTWFuYWdlclwiKVxuXG4vL2dhcCBiZXR3ZWVuIG5vdGVzIGluIG1ham9yIHNlY29uZCAodG9uKVxuXG52YXIgb2N0YXZlID0gNjtcbnZhciBoYWxmdG9uZSA9IDEuMDU5NDY7XG52YXIgdG9uZSA9IGhhbGZ0b25lKmhhbGZ0b25lO1xuXG5mdW5jdGlvbiBTeW50aCgpe1xuXHR0aGlzLnNjYWxlID0gbnVsbDtcblx0dGhpcy50b25hbCA9IG51bGw7XG5cdHRoaXMuZGVmYXVsdERlbGF5ID0gMDtcblx0dGhpcy5kZWZhdWx0Tm90ZVRpbWUgPSAyMDA7XG59XG5cblxuLy9nYXAgYmV0dyBub3RlcyBpbiBoYWxmdG9uZVxuU3ludGguc2NhbGUgPSB7XG5cdG1ham9yIDogWzIsMiwxLDIsMiwyLDFdLFxuXHRtaW5vciA6IFsyLDEsMiwyLDEsMiwyXSxcblx0Y2hyb21hIDogWzEsMSwxLDEsMSwxLDEsMSwxLDEsMSwxXSxcblx0cGVudGFNYWpvciA6WzIsMiwzLDIsM10sXG5cdHBlbnRhTWlub3IgOlszLDIsMiwzLDJdLFxuXHRwZW50YUJsdWVOb3RlIDpbMV1cbn1cblxuXG5cbi8vZm9yIGRlYnVnXG5TeW50aC5wcm90b3R5cGUucGxheVNjYWxlID0gZnVuY3Rpb24odG9uYWwsc2NhbGUpXG57XG5cdGZvcih2YXIgaT0xO2k8PXNjYWxlLmxlbmd0aCsxO2krKylcblx0e1xuXHRcdHRoaXMucGxheURlZ3JlZShpLCB0b25hbCwgc2NhbGUsaSoyMDAvMTAwMCk7XG5cdH1cblxufVxuXG4vL2F1dG9tYXRpYyBqYW0sIG5pY2VyIHRoYW4gcmFuZG9tIG5vdGVcblN5bnRoLnByb3RvdHlwZS5nZXRKYW1Ob3RlID0gZnVuY3Rpb24oKVxue1xuXG59XG5cbi8vZGVncmVlIDEgPSB0b25hbFxuU3ludGgucHJvdG90eXBlLnBsYXlEZWdyZWUgPSBmdW5jdGlvbihudW1iLHRvbmFsLHNjYWxlLGRlbGF5KVxue1xuXHQvL2lmIGp1c3QgbnVtYiBkZWZpbmllZCA6IHBsYXkgdGhpcyBzeW50aCB0b25hbCBhbmQgc2NhbGUuXG5cdGlmKHRvbmFsID09dW5kZWZpbmVkIHx8IHNjYWxlID09IHVuZGVmaW5lZClcblx0e1xuXHRcdHRvbmFsID0gdGhpcy50b25hbDtcblx0XHRzY2FsZSA9IHRoaXMuc2NhbGU7XG5cdH1cblx0dmFyIGZyZXFNdWx0aXBsaWVyID0gMTtcblxuXHRmb3IodmFyIGkgPSAwO2k8bnVtYi0xO2krKylcblx0e1xuXHRcdGZyZXFNdWx0aXBsaWVyICo9IE1hdGgucG93KDEuMDU5NDYsc2NhbGVbaV0pO1xuXHR9XG5cdHRoaXMucGxheSh0b25hbCAqIGZyZXFNdWx0aXBsaWVyLGRlbGF5KTtcbn1cblxuU3ludGgucHJvdG90eXBlLnBsYXkgPSBmdW5jdGlvbihmcmVxLGRlbGF5KVxue1x0XG5cdHZhciBzID0gU291bmRNYW5hZ2VyLmNvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xuXHRkZWxheSA9IGRlbGF5IHwgdGhpcy5kZWZhdWx0RGVsYXk7XG5cdGRlbGF5ID0gU291bmRNYW5hZ2VyLmNvbnRleHQuY3VycmVudFRpbWUgKyBkZWxheTtcblx0cy5jb25uZWN0KCBTb3VuZE1hbmFnZXIuY29udGV4dC5kZXN0aW5hdGlvbiApO1xuXHRzLmZyZXF1ZW5jeS52YWx1ZSA9IGZyZXE7XG5cdHMuc3RhcnQoZGVsYXkpO1xuXHRzLnN0b3AoZGVsYXkrdGhpcy5kZWZhdWx0Tm90ZVRpbWUvMTAwMCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU3ludGg7XG4iLCJ2YXIgR2FtZSA9IHJlcXVpcmUoXCIuL0dhbWVcIik7XG52YXIgU3ByaXRlID0gcmVxdWlyZShcIi4vZGlzcGxheS9TcHJpdGVcIik7XG5cblJoeXRobUZpZ2h0ZXJzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR2FtZS5wcm90b3R5cGUpO1xuUmh5dGhtRmlnaHRlcnMucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gUmh5dGhtRmlnaHRlcnM7XG5cbmZ1bmN0aW9uIFJoeXRobUZpZ2h0ZXJzKClcbntcblx0R2FtZS5jYWxsKHRoaXMsNjQwLDQ4MCxcIiMwMDAwMDBcIik7XG5cdHZhciBsZWZ0QmFyID0gbmV3IFNwcml0ZSgwLDAsMTAsMTAwLFwiIzAwRkZGRlwiKTtcblx0dGhpcy5wYXJ0aXRpb24gPSBuZXcgU3ByaXRlKDEwMCwzMDAsNDAwLDEwMCxcIiNGRkZGRkZcIik7XG5cblx0dmFyIHJpZ2h0QmFyID0gbmV3IFNwcml0ZSh0aGlzLnBhcnRpdGlvbi53aWR0aCAtMTAsMCwxMCwxMDAsXCIjRkYwMEZGXCIpO1xuXG5cdHRoaXMuYWRkKHRoaXMucGFydGl0aW9uKTtcblxuXHR0aGlzLnBhcnRpdGlvbi5hZGQobGVmdEJhcik7XG5cdHRoaXMucGFydGl0aW9uLmFkZChyaWdodEJhcik7XG5cdC8vcGFydGl0aW9uLmFkZChyaWdodEJhcik7XG5cblx0dGhpcy5ub3RlcyA9IFtdO1xuXHR0aGlzLmxvb3AoKTtcbn1cblxuXG5cblJoeXRobUZpZ2h0ZXJzLnByb3RvdHlwZS5sb29wID0gZnVuY3Rpb24odGltZSlcbntcblx0R2FtZS5wcm90b3R5cGUubG9vcC5jYWxsKHRoaXMsdGltZSk7XG5cdC8vY29uc29sZS5sb2codGhpcy5ub3Rlcyk7XG5cblx0Zm9yKHZhciBpID0wO2k8dGhpcy5ub3Rlcy5sZW5ndGg7aSsrKVxuXHR7XG5cdFx0dGhpcy5ub3Rlc1tpXS54ICsrIDtcblx0fVxufVxuXG5SaHl0aG1GaWdodGVycy5wcm90b3R5cGUub25LZXlEb3duID0gZnVuY3Rpb24oZSlcbntcblx0aWYoZS5rZXlDb2RlID09IDY1KVxuXHR7XG5cdFx0dGhpcy5zZW5kTm90ZSgpO1xuXHR9XG59XG5cblJoeXRobUZpZ2h0ZXJzLnByb3RvdHlwZS5zZW5kTm90ZSA9IGZ1bmN0aW9uKClcbntcblx0Y29uc29sZS5sb2coXCJub3RlXCIpO1xuXG5cdHZhciBub3RlID0gbmV3IFNwcml0ZSgwLCAwLCAyMCwgMjAsIFwiI0ZGMDAwMFwiKTtcblxuXHR0aGlzLm5vdGVzLnB1c2gobm90ZSk7XG5cdHRoaXMucGFydGl0aW9uLmFkZChub3RlKTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJoeXRobUZpZ2h0ZXJzOyIsIi8vc291bmRjb250ZXh0IHdyYXBwZXIuXG5cbnZhciBTb3VuZENvbnRleHQ7XG50cnlcbntcblx0d2luZG93LkF1ZGlvQ29udGV4dCA9IHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dDtcblx0U291bmRDb250ZXh0ID0gd2luZG93LkF1ZGlvQ29udGV4dDtcbn1cbmNhdGNoIChlKVxue1xuXHRhbGVydCgnV2ViIEF1ZGlvIEFQSSBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlcicpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNvdW5kQ29udGV4dDsiLCJcbmZ1bmN0aW9uIFNwcml0ZSh4LHksdyxoLGNvbG9yKVxue1xuXHR0aGlzLnggPSB4O1xuXHR0aGlzLnkgPSB5O1xuXHR0aGlzLndpZHRoID0gdztcblx0dGhpcy5oZWlnaHQgPSBoO1xuXHR0aGlzLmNvbG9yID0gY29sb3I7XG5cdHRoaXMuY2hpbGRyZW4gPSBbXTtcblx0dGhpcy5wYXJlbnQgPSBudWxsO1xuXG5cdHRoaXMuY3R4O1xufVxuXG5TcHJpdGUucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKHNwcilcbntcblx0c3ByLmN0eCA9IHRoaXMuY3R4O1xuXHR0aGlzLmNoaWxkcmVuLnB1c2goc3ByKTtcblx0c3ByLnBhcmVudCA9IHRoaXM7XG59XG5cblNwcml0ZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKVxue1xuXG59XG5cblNwcml0ZS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKVxue1xuXHQvL3NhdmUgY3VycmVudCBtYXRyaXhcblx0dmFyIHBvcyA9IHt4OnRoaXMueCx5OnRoaXMueX07XG5cdFxuXHR0aGlzLmN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG9yO1xuXG5cdHRoaXMueCA9IHRoaXMucGFyZW50ICE9IG51bGwgPyB0aGlzLnBhcmVudC54ICsgdGhpcy54IDogdGhpcy54OyBcblx0dGhpcy55ID0gdGhpcy5wYXJlbnQgIT0gbnVsbCA/IHRoaXMucGFyZW50LnkgKyB0aGlzLnkgOiB0aGlzLnk7IFxuXG5cdHRoaXMuY3R4LmZpbGxSZWN0KHRoaXMueCx0aGlzLnksdGhpcy53aWR0aCx0aGlzLmhlaWdodCk7XG5cblx0dGhpcy5yZW5kZXJDaGlsZHJlbigpO1xuXG5cdC8vcmVzdG9yZSByZWxhdGl2ZSBwb3M7XG5cdHRoaXMueCA9IHBvcy54O1xuXHR0aGlzLnkgPSBwb3MueTtcbn1cblxuU3ByaXRlLnByb3RvdHlwZS5yZW5kZXJDaGlsZHJlbiA9IGZ1bmN0aW9uKClcbntcblxuXHRmb3IodmFyIGkgPTA7aTx0aGlzLmNoaWxkcmVuLmxlbmd0aDtpKyspXG5cdHtcblx0XHR0aGlzLmNoaWxkcmVuW2ldLnJlbmRlcigpO1xuXHR9XHRcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTcHJpdGU7IiwidmFyIFNvdW5kQ29udGV4dCA9IHJlcXVpcmUoXCIuL1NvdW5kQ29udGV4dC5qc1wiKTtcblxuLy9XcmFwcGVyIGFyb3VuZCBhIHNvdW5kQnVmZmVyXG5cbnZhciBTb3VuZCA9IGZ1bmN0aW9uKGJ1ZmZlcilcbntcblx0dGhpcy5idWZmZXIgPSBidWZmZXI7XG59XG5cblNvdW5kLnByb3RvdHlwZS5wbGF5ID0gZnVuY3Rpb24oZGVsYXkpIHtcblx0dmFyIHNvdXJjZSA9IFNvdW5kQ29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTsgXG5cdHNvdXJjZS5idWZmZXIgPSB0aGlzLmJ1ZmZlcjsgICAgICAgICAgICAgICAgICAgIFxuXHRzb3VyY2UuY29ubmVjdChTb3VuZENvbnRleHQuZGVzdGluYXRpb24pO1xuXHRzb3VyY2Uuc3RhcnQoZGVsYXkpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTb3VuZDsiLCIvL2p1c3QgcnVuIHRoZSBwb2x5ZmlsbCA6XG5yZXF1aXJlKFwiLi9SZXF1ZXN0QW5pbUZyYW1lXCIpO1xuXG5mdW5jdGlvbiBHYW1lKHdpZHRoLGhlaWdodCxiYWNrZ3JvdW5kQ29sb3IpXG57XG5cdHRoaXMud2lkdGggPSB3aWR0aDtcblx0dGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG5cblx0dGhpcy5iYWNrZ3JvdW5kQ29sb3IgPSBiYWNrZ3JvdW5kQ29sb3I7XG5cblx0dGhpcy5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuXG5cdHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy53aWR0aDtcblx0dGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG5cblx0dGhpcy5jYW52YXMuc3R5bGUgPSBcIm1hcmdpbiA6IDAgYXV0b1wiO1xuXG5cdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xuXHR0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcblx0dGhpcy5zcHJpdGVzID1bXTtcblx0XG5cdHdpbmRvdy5vbmtleWRvd24gPSB0aGlzLm9uS2V5RG93bi5iaW5kKHRoaXMpO1xufVxuXG5HYW1lLnByb3RvdHlwZS5vbktleURvd24gPSBmdW5jdGlvbihldmVudClcbntcblxufVxuXG5HYW1lLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihzcHJpdGUpXG57XG5cdHRoaXMuc3ByaXRlcy5wdXNoKHNwcml0ZSk7XG5cdHNwcml0ZS5jdHggPSB0aGlzLmN0eDtcbn1cblxuR2FtZS5wcm90b3R5cGUubG9vcCA9IGZ1bmN0aW9uKClcbntcblx0Ly9zaGl0bG9hZCB3ZWlyZCwgYXBwYXJlbnRseSBjYW4ndCBwdXQgdGhpcy5sb29wIGRpcmVjdGx5IGFzIGFyZ3VtZW50XG5cdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24odGltZSl7dGhpcy5sb29wKHRpbWUpfS5iaW5kKHRoaXMpKTtcblxuXG5cdHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy5jYW52YXMud2lkdGg7XG5cdHRoaXMuY3R4LmZpbGxTdHlsZSA9IHRoaXMuYmFja2dyb3VuZENvbG9yO1xuXHR0aGlzLmN0eC5maWxsUmVjdCgwLDAsdGhpcy5jYW52YXMud2lkdGgsdGhpcy5jYW52YXMuaGVpZ2h0KTtcblx0Zm9yICh2YXIgaT0wO2k8dGhpcy5zcHJpdGVzLmxlbmd0aDtpKyspXG5cdHtcblx0XHR0aGlzLnNwcml0ZXNbaV0udXBkYXRlKCk7XG5cdFx0dGhpcy5zcHJpdGVzW2ldLnJlbmRlcigpO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZTsiLCIvLyBodHRwOi8vcGF1bGlyaXNoLmNvbS8yMDExL3JlcXVlc3RhbmltYXRpb25mcmFtZS1mb3Itc21hcnQtYW5pbWF0aW5nL1xuLy8gaHR0cDovL215Lm9wZXJhLmNvbS9lbW9sbGVyL2Jsb2cvMjAxMS8xMi8yMC9yZXF1ZXN0YW5pbWF0aW9uZnJhbWUtZm9yLXNtYXJ0LWVyLWFuaW1hdGluZ1xuIFxuLy8gcmVxdWVzdEFuaW1hdGlvbkZyYW1lIHBvbHlmaWxsIGJ5IEVyaWsgTcO2bGxlci4gZml4ZXMgZnJvbSBQYXVsIElyaXNoIGFuZCBUaW5vIFppamRlbFxuIFxuLy8gTUlUIGxpY2Vuc2VcbiBcbihmdW5jdGlvbigpIHtcbiAgICB2YXIgbGFzdFRpbWUgPSAwO1xuICAgIHZhciB2ZW5kb3JzID0gWydtcycsICdtb3onLCAnd2Via2l0JywgJ28nXTtcbiAgICBmb3IodmFyIHggPSAwOyB4IDwgdmVuZG9ycy5sZW5ndGggJiYgIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7ICsreCkge1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvcnNbeF0rJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddO1xuICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1t4XSsnQ2FuY2VsQW5pbWF0aW9uRnJhbWUnXSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgd2luZG93W3ZlbmRvcnNbeF0rJ0NhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSddO1xuICAgIH1cbiBcbiAgICBpZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbihjYWxsYmFjaywgZWxlbWVudCkge1xuICAgICAgICAgICAgdmFyIGN1cnJUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICB2YXIgdGltZVRvQ2FsbCA9IE1hdGgubWF4KDAsIDE2IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKTtcbiAgICAgICAgICAgIHZhciBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBjYWxsYmFjayhjdXJyVGltZSArIHRpbWVUb0NhbGwpOyB9LCBcbiAgICAgICAgICAgICAgdGltZVRvQ2FsbCk7XG4gICAgICAgICAgICBsYXN0VGltZSA9IGN1cnJUaW1lICsgdGltZVRvQ2FsbDtcbiAgICAgICAgICAgIHJldHVybiBpZDtcbiAgICAgICAgfTtcbiBcbiAgICBpZiAoIXdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSlcbiAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChpZCk7XG4gICAgICAgIH07XG59KCkpOyJdfQ==
;