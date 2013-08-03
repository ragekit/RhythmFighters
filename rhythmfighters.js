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
	var partition = new Sprite(100,300,400,100,"#FFFFFF");

	var rightBar = new Sprite(partition.width -10,0,10,100,"#FF00FF");

	this.add(partition);

	partition.add(leftBar);
	partition.add(rightBar);
	//partition.add(rightBar);

	this.notes = [];

}



RhythmFighters.prototype.loop = function(time)
{
	Game.prototype.loop.call(this,time);
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

	this.loop();
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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYmVuamFtaW5nYXR0ZXQvVHJhdmF1eC9SaHl0aG1GaWdodGVycy9zY3JpcHRzL21haW4uanMiLCIvVXNlcnMvYmVuamFtaW5nYXR0ZXQvVHJhdmF1eC9SaHl0aG1GaWdodGVycy9zY3JpcHRzL1NvdW5kTWFuYWdlci5qcyIsIi9Vc2Vycy9iZW5qYW1pbmdhdHRldC9UcmF2YXV4L1JoeXRobUZpZ2h0ZXJzL3NjcmlwdHMvU3ludGguanMiLCIvVXNlcnMvYmVuamFtaW5nYXR0ZXQvVHJhdmF1eC9SaHl0aG1GaWdodGVycy9zY3JpcHRzL1JoeXRobUZpZ2h0ZXJzLmpzIiwiL1VzZXJzL2JlbmphbWluZ2F0dGV0L1RyYXZhdXgvUmh5dGhtRmlnaHRlcnMvc2NyaXB0cy9Tb3VuZENvbnRleHQuanMiLCIvVXNlcnMvYmVuamFtaW5nYXR0ZXQvVHJhdmF1eC9SaHl0aG1GaWdodGVycy9zY3JpcHRzL2Rpc3BsYXkvU3ByaXRlLmpzIiwiL1VzZXJzL2JlbmphbWluZ2F0dGV0L1RyYXZhdXgvUmh5dGhtRmlnaHRlcnMvc2NyaXB0cy9Tb3VuZC5qcyIsIi9Vc2Vycy9iZW5qYW1pbmdhdHRldC9UcmF2YXV4L1JoeXRobUZpZ2h0ZXJzL3NjcmlwdHMvR2FtZS5qcyIsIi9Vc2Vycy9iZW5qYW1pbmdhdHRldC9UcmF2YXV4L1JoeXRobUZpZ2h0ZXJzL3NjcmlwdHMvUmVxdWVzdEFuaW1GcmFtZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFNvdW5kTWFuYWdlciA9IHJlcXVpcmUoXCIuL1NvdW5kTWFuYWdlci5qc1wiKTtcbnZhciBTeW50aCA9IHJlcXVpcmUoXCIuL1N5bnRoXCIpO1xudmFyIHJmID0gcmVxdWlyZShcIi4vUmh5dGhtRmlnaHRlcnNcIilcbmNvbnNvbGUubG9nKFwiT05PXCIpO1xuXG52YXIgcmYgPSBuZXcgcmYoKTtcblxuXG52YXIgcyA9IG5ldyBTeW50aCgpO1xucy50b25hbCA9IDI2NDtcbnMuc2NhbGUgPSBTeW50aC5zY2FsZS5wZW50YU1pbm9yO1xuIiwidmFyIFNvdW5kID0gcmVxdWlyZShcIi4vU291bmRcIik7XG52YXIgU291bmRDb250ZXh0ID0gcmVxdWlyZShcIi4vU291bmRDb250ZXh0XCIpO1xuXG52YXIgU291bmRNYW5hZ2VyID1mdW5jdGlvbigpe307XG5Tb3VuZE1hbmFnZXIubG9hZGVkID0gW107XG5Tb3VuZE1hbmFnZXIuY29udGV4dCA9IG5ldyBTb3VuZENvbnRleHQoKTtcblxuU291bmRNYW5hZ2VyLmJhdGNoTG9hZCA9IGZ1bmN0aW9uKGlucHV0QXJyYXksY2IpXG57XG5cblxufVxuXG5Tb3VuZE1hbmFnZXIubG9hZFNvdW5kID0gZnVuY3Rpb24odXJsLGNiKVxue1xuXHR2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXHRyZXF1ZXN0Lm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG5cdHJlcXVlc3QucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJztcblxuXHQvLyBEZWNvZGUgYXN5bmNocm9ub3VzbHlcblx0cmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbigpXG5cdHtcblx0XHRTb3VuZE1hbmFnZXIuY29udGV4dC5kZWNvZGVBdWRpb0RhdGEocmVxdWVzdC5yZXNwb25zZSwgZnVuY3Rpb24oYnVmZmVyKVxuXHRcdHtcblx0XHRcdHZhciBzb3VuZCA9IG5ldyBTb3VuZChidWZmZXIpO1xuXHRcdFx0U291bmRNYW5hZ2VyLmxvYWRlZFt1cmxdID0gc291bmQ7XG5cdFx0XHRpZihjYiAhPSB1bmRlZmluZWQpXG5cdFx0XHRcdGNiLmNhbGwodGhpcyxzb3VuZCk7XG5cdFx0fSk7XG5cdH1cblx0cmVxdWVzdC5zZW5kKCk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IFNvdW5kTWFuYWdlcjtcblxuXG4iLCJ2YXIgU291bmRNYW5hZ2VyID0gcmVxdWlyZShcIi4vU291bmRNYW5hZ2VyXCIpXG5cbi8vZ2FwIGJldHdlZW4gbm90ZXMgaW4gbWFqb3Igc2Vjb25kICh0b24pXG5cbnZhciBvY3RhdmUgPSA2O1xudmFyIGhhbGZ0b25lID0gMS4wNTk0NjtcbnZhciB0b25lID0gaGFsZnRvbmUqaGFsZnRvbmU7XG5cbmZ1bmN0aW9uIFN5bnRoKCl7XG5cdHRoaXMuc2NhbGUgPSBudWxsO1xuXHR0aGlzLnRvbmFsID0gbnVsbDtcblx0dGhpcy5kZWZhdWx0RGVsYXkgPSAwO1xuXHR0aGlzLmRlZmF1bHROb3RlVGltZSA9IDIwMDtcbn1cblxuXG4vL2dhcCBiZXR3IG5vdGVzIGluIGhhbGZ0b25lXG5TeW50aC5zY2FsZSA9IHtcblx0bWFqb3IgOiBbMiwyLDEsMiwyLDIsMV0sXG5cdG1pbm9yIDogWzIsMSwyLDIsMSwyLDJdLFxuXHRjaHJvbWEgOiBbMSwxLDEsMSwxLDEsMSwxLDEsMSwxLDFdLFxuXHRwZW50YU1ham9yIDpbMiwyLDMsMiwzXSxcblx0cGVudGFNaW5vciA6WzMsMiwyLDMsMl0sXG5cdHBlbnRhQmx1ZU5vdGUgOlsxXVxufVxuXG5cblxuLy9mb3IgZGVidWdcblN5bnRoLnByb3RvdHlwZS5wbGF5U2NhbGUgPSBmdW5jdGlvbih0b25hbCxzY2FsZSlcbntcblx0Zm9yKHZhciBpPTE7aTw9c2NhbGUubGVuZ3RoKzE7aSsrKVxuXHR7XG5cdFx0dGhpcy5wbGF5RGVncmVlKGksIHRvbmFsLCBzY2FsZSxpKjIwMC8xMDAwKTtcblx0fVxuXG59XG5cbi8vYXV0b21hdGljIGphbSwgbmljZXIgdGhhbiByYW5kb20gbm90ZVxuU3ludGgucHJvdG90eXBlLmdldEphbU5vdGUgPSBmdW5jdGlvbigpXG57XG5cbn1cblxuLy9kZWdyZWUgMSA9IHRvbmFsXG5TeW50aC5wcm90b3R5cGUucGxheURlZ3JlZSA9IGZ1bmN0aW9uKG51bWIsdG9uYWwsc2NhbGUsZGVsYXkpXG57XG5cdC8vaWYganVzdCBudW1iIGRlZmluaWVkIDogcGxheSB0aGlzIHN5bnRoIHRvbmFsIGFuZCBzY2FsZS5cblx0aWYodG9uYWwgPT11bmRlZmluZWQgfHwgc2NhbGUgPT0gdW5kZWZpbmVkKVxuXHR7XG5cdFx0dG9uYWwgPSB0aGlzLnRvbmFsO1xuXHRcdHNjYWxlID0gdGhpcy5zY2FsZTtcblx0fVxuXHR2YXIgZnJlcU11bHRpcGxpZXIgPSAxO1xuXG5cdGZvcih2YXIgaSA9IDA7aTxudW1iLTE7aSsrKVxuXHR7XG5cdFx0ZnJlcU11bHRpcGxpZXIgKj0gTWF0aC5wb3coMS4wNTk0NixzY2FsZVtpXSk7XG5cdH1cblx0dGhpcy5wbGF5KHRvbmFsICogZnJlcU11bHRpcGxpZXIsZGVsYXkpO1xufVxuXG5TeW50aC5wcm90b3R5cGUucGxheSA9IGZ1bmN0aW9uKGZyZXEsZGVsYXkpXG57XHRcblx0dmFyIHMgPSBTb3VuZE1hbmFnZXIuY29udGV4dC5jcmVhdGVPc2NpbGxhdG9yKCk7XG5cdGRlbGF5ID0gZGVsYXkgfCB0aGlzLmRlZmF1bHREZWxheTtcblx0ZGVsYXkgPSBTb3VuZE1hbmFnZXIuY29udGV4dC5jdXJyZW50VGltZSArIGRlbGF5O1xuXHRzLmNvbm5lY3QoIFNvdW5kTWFuYWdlci5jb250ZXh0LmRlc3RpbmF0aW9uICk7XG5cdHMuZnJlcXVlbmN5LnZhbHVlID0gZnJlcTtcblx0cy5zdGFydChkZWxheSk7XG5cdHMuc3RvcChkZWxheSt0aGlzLmRlZmF1bHROb3RlVGltZS8xMDAwKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTeW50aDtcbiIsInZhciBHYW1lID0gcmVxdWlyZShcIi4vR2FtZVwiKTtcbnZhciBTcHJpdGUgPSByZXF1aXJlKFwiLi9kaXNwbGF5L1Nwcml0ZVwiKTtcblxuUmh5dGhtRmlnaHRlcnMucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHYW1lLnByb3RvdHlwZSk7XG5SaHl0aG1GaWdodGVycy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBSaHl0aG1GaWdodGVycztcblxuZnVuY3Rpb24gUmh5dGhtRmlnaHRlcnMoKVxue1xuXHRHYW1lLmNhbGwodGhpcyw2NDAsNDgwLFwiIzAwMDAwMFwiKTtcblx0dmFyIGxlZnRCYXIgPSBuZXcgU3ByaXRlKDAsMCwxMCwxMDAsXCIjMDBGRkZGXCIpO1xuXHR2YXIgcGFydGl0aW9uID0gbmV3IFNwcml0ZSgxMDAsMzAwLDQwMCwxMDAsXCIjRkZGRkZGXCIpO1xuXG5cdHZhciByaWdodEJhciA9IG5ldyBTcHJpdGUocGFydGl0aW9uLndpZHRoIC0xMCwwLDEwLDEwMCxcIiNGRjAwRkZcIik7XG5cblx0dGhpcy5hZGQocGFydGl0aW9uKTtcblxuXHRwYXJ0aXRpb24uYWRkKGxlZnRCYXIpO1xuXHRwYXJ0aXRpb24uYWRkKHJpZ2h0QmFyKTtcblx0Ly9wYXJ0aXRpb24uYWRkKHJpZ2h0QmFyKTtcblxuXHR0aGlzLm5vdGVzID0gW107XG5cbn1cblxuXG5cblJoeXRobUZpZ2h0ZXJzLnByb3RvdHlwZS5sb29wID0gZnVuY3Rpb24odGltZSlcbntcblx0R2FtZS5wcm90b3R5cGUubG9vcC5jYWxsKHRoaXMsdGltZSk7XG59XG5cblJoeXRobUZpZ2h0ZXJzLnByb3RvdHlwZS5vbktleURvd24gPSBmdW5jdGlvbihlKVxue1xuXHRpZihlLmtleUNvZGUgPT0gNjUpXG5cdHtcblx0XHR0aGlzLnNlbmROb3RlKCk7XG5cdH1cbn1cblxuUmh5dGhtRmlnaHRlcnMucHJvdG90eXBlLnNlbmROb3RlID0gZnVuY3Rpb24oKVxue1xuXHRjb25zb2xlLmxvZyhcIm5vdGVcIik7XG5cblx0dmFyIG5vdGUgPSBuZXcgU3ByaXRlKDAsIDAsIDIwLCAyMCwgXCIjRkYwMDAwXCIpO1xuXG5cdHRoaXMubm90ZXMucHVzaChub3RlKTtcblx0dGhpcy5wYXJ0aXRpb24uYWRkKG5vdGUpO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmh5dGhtRmlnaHRlcnM7IiwiLy9zb3VuZGNvbnRleHQgd3JhcHBlci5cblxudmFyIFNvdW5kQ29udGV4dDtcbnRyeVxue1xuXHR3aW5kb3cuQXVkaW9Db250ZXh0ID0gd2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0O1xuXHRTb3VuZENvbnRleHQgPSB3aW5kb3cuQXVkaW9Db250ZXh0O1xufVxuY2F0Y2ggKGUpXG57XG5cdGFsZXJ0KCdXZWIgQXVkaW8gQVBJIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU291bmRDb250ZXh0OyIsIlxuZnVuY3Rpb24gU3ByaXRlKHgseSx3LGgsY29sb3IpXG57XG5cdHRoaXMueCA9IHg7XG5cdHRoaXMueSA9IHk7XG5cdHRoaXMud2lkdGggPSB3O1xuXHR0aGlzLmhlaWdodCA9IGg7XG5cdHRoaXMuY29sb3IgPSBjb2xvcjtcblx0dGhpcy5jaGlsZHJlbiA9IFtdO1xuXHR0aGlzLnBhcmVudCA9IG51bGw7XG5cblx0dGhpcy5jdHg7XG59XG5cblNwcml0ZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24oc3ByKVxue1xuXHRzcHIuY3R4ID0gdGhpcy5jdHg7XG5cdHRoaXMuY2hpbGRyZW4ucHVzaChzcHIpO1xuXHRzcHIucGFyZW50ID0gdGhpcztcbn1cblxuU3ByaXRlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpXG57XG5cbn1cblxuU3ByaXRlLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpXG57XG5cdC8vc2F2ZSBjdXJyZW50IG1hdHJpeFxuXHR2YXIgcG9zID0ge3g6dGhpcy54LHk6dGhpcy55fTtcblx0XG5cdHRoaXMuY3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3I7XG5cblx0dGhpcy54ID0gdGhpcy5wYXJlbnQgIT0gbnVsbCA/IHRoaXMucGFyZW50LnggKyB0aGlzLnggOiB0aGlzLng7IFxuXHR0aGlzLnkgPSB0aGlzLnBhcmVudCAhPSBudWxsID8gdGhpcy5wYXJlbnQueSArIHRoaXMueSA6IHRoaXMueTsgXG5cblx0dGhpcy5jdHguZmlsbFJlY3QodGhpcy54LHRoaXMueSx0aGlzLndpZHRoLHRoaXMuaGVpZ2h0KTtcblxuXHR0aGlzLnJlbmRlckNoaWxkcmVuKCk7XG5cblx0Ly9yZXN0b3JlIHJlbGF0aXZlIHBvcztcblx0dGhpcy54ID0gcG9zLng7XG5cdHRoaXMueSA9IHBvcy55O1xufVxuXG5TcHJpdGUucHJvdG90eXBlLnJlbmRlckNoaWxkcmVuID0gZnVuY3Rpb24oKVxue1xuXG5cdGZvcih2YXIgaSA9MDtpPHRoaXMuY2hpbGRyZW4ubGVuZ3RoO2krKylcblx0e1xuXHRcdHRoaXMuY2hpbGRyZW5baV0ucmVuZGVyKCk7XG5cdH1cdFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNwcml0ZTsiLCJ2YXIgU291bmRDb250ZXh0ID0gcmVxdWlyZShcIi4vU291bmRDb250ZXh0LmpzXCIpO1xuXG4vL1dyYXBwZXIgYXJvdW5kIGEgc291bmRCdWZmZXJcblxudmFyIFNvdW5kID0gZnVuY3Rpb24oYnVmZmVyKVxue1xuXHR0aGlzLmJ1ZmZlciA9IGJ1ZmZlcjtcbn1cblxuU291bmQucHJvdG90eXBlLnBsYXkgPSBmdW5jdGlvbihkZWxheSkge1xuXHR2YXIgc291cmNlID0gU291bmRDb250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpOyBcblx0c291cmNlLmJ1ZmZlciA9IHRoaXMuYnVmZmVyOyAgICAgICAgICAgICAgICAgICAgXG5cdHNvdXJjZS5jb25uZWN0KFNvdW5kQ29udGV4dC5kZXN0aW5hdGlvbik7XG5cdHNvdXJjZS5zdGFydChkZWxheSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNvdW5kOyIsIi8vanVzdCBydW4gdGhlIHBvbHlmaWxsIDpcbnJlcXVpcmUoXCIuL1JlcXVlc3RBbmltRnJhbWVcIik7XG5cbmZ1bmN0aW9uIEdhbWUod2lkdGgsaGVpZ2h0LGJhY2tncm91bmRDb2xvcilcbntcblx0dGhpcy53aWR0aCA9IHdpZHRoO1xuXHR0aGlzLmhlaWdodCA9IGhlaWdodDtcblxuXHR0aGlzLmJhY2tncm91bmRDb2xvciA9IGJhY2tncm91bmRDb2xvcjtcblxuXHR0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG5cblx0dGhpcy5jYW52YXMud2lkdGggPSB0aGlzLndpZHRoO1xuXHR0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLmhlaWdodDtcblxuXHR0aGlzLmNhbnZhcy5zdHlsZSA9IFwibWFyZ2luIDogMCBhdXRvXCI7XG5cblx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG5cdHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuXHR0aGlzLnNwcml0ZXMgPVtdO1xuXG5cdHRoaXMubG9vcCgpO1xuXHR3aW5kb3cub25rZXlkb3duID0gdGhpcy5vbktleURvd24uYmluZCh0aGlzKTtcbn1cblxuR2FtZS5wcm90b3R5cGUub25LZXlEb3duID0gZnVuY3Rpb24oZXZlbnQpXG57XG5cbn1cblxuR2FtZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24oc3ByaXRlKVxue1xuXHR0aGlzLnNwcml0ZXMucHVzaChzcHJpdGUpO1xuXHRzcHJpdGUuY3R4ID0gdGhpcy5jdHg7XG59XG5cbkdhbWUucHJvdG90eXBlLmxvb3AgPSBmdW5jdGlvbigpXG57XG5cdC8vc2hpdGxvYWQgd2VpcmQsIGFwcGFyZW50bHkgY2FuJ3QgcHV0IHRoaXMubG9vcCBkaXJlY3RseSBhcyBhcmd1bWVudFxuXHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKHRpbWUpe3RoaXMubG9vcCh0aW1lKX0uYmluZCh0aGlzKSk7XG5cblxuXHR0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMuY2FudmFzLndpZHRoO1xuXHR0aGlzLmN0eC5maWxsU3R5bGUgPSB0aGlzLmJhY2tncm91bmRDb2xvcjtcblx0dGhpcy5jdHguZmlsbFJlY3QoMCwwLHRoaXMuY2FudmFzLndpZHRoLHRoaXMuY2FudmFzLmhlaWdodCk7XG5cdGZvciAodmFyIGk9MDtpPHRoaXMuc3ByaXRlcy5sZW5ndGg7aSsrKVxuXHR7XG5cdFx0dGhpcy5zcHJpdGVzW2ldLnVwZGF0ZSgpO1xuXHRcdHRoaXMuc3ByaXRlc1tpXS5yZW5kZXIoKTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWU7IiwiLy8gaHR0cDovL3BhdWxpcmlzaC5jb20vMjAxMS9yZXF1ZXN0YW5pbWF0aW9uZnJhbWUtZm9yLXNtYXJ0LWFuaW1hdGluZy9cbi8vIGh0dHA6Ly9teS5vcGVyYS5jb20vZW1vbGxlci9ibG9nLzIwMTEvMTIvMjAvcmVxdWVzdGFuaW1hdGlvbmZyYW1lLWZvci1zbWFydC1lci1hbmltYXRpbmdcbiBcbi8vIHJlcXVlc3RBbmltYXRpb25GcmFtZSBwb2x5ZmlsbCBieSBFcmlrIE3DtmxsZXIuIGZpeGVzIGZyb20gUGF1bCBJcmlzaCBhbmQgVGlubyBaaWpkZWxcbiBcbi8vIE1JVCBsaWNlbnNlXG4gXG4oZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxhc3RUaW1lID0gMDtcbiAgICB2YXIgdmVuZG9ycyA9IFsnbXMnLCAnbW96JywgJ3dlYmtpdCcsICdvJ107XG4gICAgZm9yKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK3gpIHtcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdKydSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcbiAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvcnNbeF0rJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ10gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IHdpbmRvd1t2ZW5kb3JzW3hdKydDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcbiAgICB9XG4gXG4gICAgaWYgKCF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKVxuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oY2FsbGJhY2ssIGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNiAtIChjdXJyVGltZSAtIGxhc3RUaW1lKSk7XG4gICAgICAgICAgICB2YXIgaWQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHsgY2FsbGJhY2soY3VyclRpbWUgKyB0aW1lVG9DYWxsKTsgfSwgXG4gICAgICAgICAgICAgIHRpbWVUb0NhbGwpO1xuICAgICAgICAgICAgbGFzdFRpbWUgPSBjdXJyVGltZSArIHRpbWVUb0NhbGw7XG4gICAgICAgICAgICByZXR1cm4gaWQ7XG4gICAgICAgIH07XG4gXG4gICAgaWYgKCF3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUpXG4gICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQoaWQpO1xuICAgICAgICB9O1xufSgpKTsiXX0=
;