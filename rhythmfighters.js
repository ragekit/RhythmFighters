;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
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
},{"./SoundManager.js":2,"./display/Sprite":3,"./Synth":4,"./RequestAnimFrame":5}],3:[function(require,module,exports){

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
},{}],2:[function(require,module,exports){
var Sound = require("./Sound");
var SoundContext = require("./SoundContext");

var SoundManager =function(){};
SoundManager.loaded = [];
SoundManager.context = SoundContext;

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



},{"./Sound":6,"./SoundContext":7}],4:[function(require,module,exports){
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
	pentaBlueNote :[]
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

},{"./SoundManager":2}],7:[function(require,module,exports){
//soundcontext wrapper.

var SoundContext;
try
{
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	SoundContext = new AudioContext();
}
catch (e)
{
	alert('Web Audio API is not supported in this browser');
}

module.exports = SoundContext;
},{}],6:[function(require,module,exports){
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
},{"./SoundContext.js":7}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYmVuamFtaW5nYXR0ZXQvVHJhdmF1eC9SaHl0aG1GaWdodGVycy9zY3JpcHRzL21haW4uanMiLCIvVXNlcnMvYmVuamFtaW5nYXR0ZXQvVHJhdmF1eC9SaHl0aG1GaWdodGVycy9zY3JpcHRzL2Rpc3BsYXkvU3ByaXRlLmpzIiwiL1VzZXJzL2JlbmphbWluZ2F0dGV0L1RyYXZhdXgvUmh5dGhtRmlnaHRlcnMvc2NyaXB0cy9SZXF1ZXN0QW5pbUZyYW1lLmpzIiwiL1VzZXJzL2JlbmphbWluZ2F0dGV0L1RyYXZhdXgvUmh5dGhtRmlnaHRlcnMvc2NyaXB0cy9Tb3VuZE1hbmFnZXIuanMiLCIvVXNlcnMvYmVuamFtaW5nYXR0ZXQvVHJhdmF1eC9SaHl0aG1GaWdodGVycy9zY3JpcHRzL1N5bnRoLmpzIiwiL1VzZXJzL2JlbmphbWluZ2F0dGV0L1RyYXZhdXgvUmh5dGhtRmlnaHRlcnMvc2NyaXB0cy9Tb3VuZENvbnRleHQuanMiLCIvVXNlcnMvYmVuamFtaW5nYXR0ZXQvVHJhdmF1eC9SaHl0aG1GaWdodGVycy9zY3JpcHRzL1NvdW5kLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgU291bmRNYW5hZ2VyID0gcmVxdWlyZShcIi4vU291bmRNYW5hZ2VyLmpzXCIpO1xudmFyIFN5bnRoID0gcmVxdWlyZShcIi4vU3ludGhcIik7XG52YXIgU3ByaXRlID0gcmVxdWlyZShcIi4vZGlzcGxheS9TcHJpdGVcIik7XG5cbi8vanVzdCBydW4gdGhlIHBvbHlmaWxsIDpcbnJlcXVpcmUoXCIuL1JlcXVlc3RBbmltRnJhbWVcIik7XG5cbmNvbnNvbGUubG9nKFwiT05PXCIpO1xuXG5cbnZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjYW52YXMpO1xudmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG52YXIgc3ByaXRlcyA9W107XG5cbnZhciBzID0gbmV3IFN5bnRoKCk7XG5zLnRvbmFsID0gMjY0O1xucy5zY2FsZSA9IFN5bnRoLnNjYWxlLnBlbnRhTWlub3I7XG5cbndpbmRvdy5vbmtleWRvd24gPSBmdW5jdGlvbihlKSB7XG5cdGlmIChlLmtleUNvZGUgPT0gNjUpIHtcblx0XHRzLnBsYXlEZWdyZWUoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKnMuc2NhbGUubGVuZ3RoKSsxKTtcblx0fVxufVxuXG5cbmZ1bmN0aW9uIGFkZChzcHJpdGUsY3R4KVxue1xuXHRzcHJpdGVzLnB1c2goc3ByaXRlKTtcblx0c3ByaXRlLmN0eCA9IGN0eDtcbn1cblxudmFyIHVwZGF0ZSA9IGZ1bmN0aW9uKHRpbWUpIHtcblx0Y2FudmFzLndpZHRoID0gY2FudmFzLndpZHRoO1xuXHRmb3IodmFyIGkgPTA7IGk8c3ByaXRlcy5sZW5ndGg7aSsrKVxuXHR7XG5cdFx0c3ByaXRlc1tpXS51cGRhdGUoKTtcblx0XHRzcHJpdGVzW2ldLnJlbmRlcigpO1xuXHR9XG59O1xuXG52YXIgcyA9IG5ldyBTcHJpdGUoMTAsMTAsNTAsNTAsXCIjRkYwMDAwXCIpO1xuYWRkKHMsY3R4KTtcblxuKGZ1bmN0aW9uIGFuaW1Mb29wKHRpbWUpIHtcblx0d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltTG9vcCk7XG5cdHVwZGF0ZSh0aW1lKTtcbn0pKCkiLCJcbmZ1bmN0aW9uIFNwcml0ZSh4LHksdyxoLGNvbG9yKVxue1xuXHR0aGlzLnggPSB4O1xuXHR0aGlzLnkgPSB5O1xuXHR0aGlzLndpZHRoID0gdztcblx0dGhpcy5oZWlnaHQgPSBoO1xuXHR0aGlzLmNvbG9yID0gY29sb3I7XG5cblx0dGhpcy5jdHg7XG59XG5cblNwcml0ZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKVxue1xuXG59XG5cblNwcml0ZS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKVxue1xuXHR0aGlzLmN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG9yO1xuXHR0aGlzLmN0eC5maWxsUmVjdCh0aGlzLngsdGhpcy55LHRoaXMud2lkdGgsdGhpcy5oZWlnaHQpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNwcml0ZTsiLCIvLyBodHRwOi8vcGF1bGlyaXNoLmNvbS8yMDExL3JlcXVlc3RhbmltYXRpb25mcmFtZS1mb3Itc21hcnQtYW5pbWF0aW5nL1xuLy8gaHR0cDovL215Lm9wZXJhLmNvbS9lbW9sbGVyL2Jsb2cvMjAxMS8xMi8yMC9yZXF1ZXN0YW5pbWF0aW9uZnJhbWUtZm9yLXNtYXJ0LWVyLWFuaW1hdGluZ1xuIFxuLy8gcmVxdWVzdEFuaW1hdGlvbkZyYW1lIHBvbHlmaWxsIGJ5IEVyaWsgTcO2bGxlci4gZml4ZXMgZnJvbSBQYXVsIElyaXNoIGFuZCBUaW5vIFppamRlbFxuIFxuLy8gTUlUIGxpY2Vuc2VcbiBcbihmdW5jdGlvbigpIHtcbiAgICB2YXIgbGFzdFRpbWUgPSAwO1xuICAgIHZhciB2ZW5kb3JzID0gWydtcycsICdtb3onLCAnd2Via2l0JywgJ28nXTtcbiAgICBmb3IodmFyIHggPSAwOyB4IDwgdmVuZG9ycy5sZW5ndGggJiYgIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7ICsreCkge1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvcnNbeF0rJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddO1xuICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1t4XSsnQ2FuY2VsQW5pbWF0aW9uRnJhbWUnXSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgd2luZG93W3ZlbmRvcnNbeF0rJ0NhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSddO1xuICAgIH1cbiBcbiAgICBpZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbihjYWxsYmFjaywgZWxlbWVudCkge1xuICAgICAgICAgICAgdmFyIGN1cnJUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICB2YXIgdGltZVRvQ2FsbCA9IE1hdGgubWF4KDAsIDE2IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKTtcbiAgICAgICAgICAgIHZhciBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBjYWxsYmFjayhjdXJyVGltZSArIHRpbWVUb0NhbGwpOyB9LCBcbiAgICAgICAgICAgICAgdGltZVRvQ2FsbCk7XG4gICAgICAgICAgICBsYXN0VGltZSA9IGN1cnJUaW1lICsgdGltZVRvQ2FsbDtcbiAgICAgICAgICAgIHJldHVybiBpZDtcbiAgICAgICAgfTtcbiBcbiAgICBpZiAoIXdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSlcbiAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChpZCk7XG4gICAgICAgIH07XG59KCkpOyIsInZhciBTb3VuZCA9IHJlcXVpcmUoXCIuL1NvdW5kXCIpO1xudmFyIFNvdW5kQ29udGV4dCA9IHJlcXVpcmUoXCIuL1NvdW5kQ29udGV4dFwiKTtcblxudmFyIFNvdW5kTWFuYWdlciA9ZnVuY3Rpb24oKXt9O1xuU291bmRNYW5hZ2VyLmxvYWRlZCA9IFtdO1xuU291bmRNYW5hZ2VyLmNvbnRleHQgPSBTb3VuZENvbnRleHQ7XG5cblNvdW5kTWFuYWdlci5iYXRjaExvYWQgPSBmdW5jdGlvbihpbnB1dEFycmF5LGNiKVxue1xuXG5cbn1cblxuU291bmRNYW5hZ2VyLmxvYWRTb3VuZCA9IGZ1bmN0aW9uKHVybCxjYilcbntcblx0dmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblx0cmVxdWVzdC5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xuXHRyZXF1ZXN0LnJlc3BvbnNlVHlwZSA9ICdhcnJheWJ1ZmZlcic7XG5cblx0Ly8gRGVjb2RlIGFzeW5jaHJvbm91c2x5XG5cdHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24oKVxuXHR7XG5cdFx0U291bmRNYW5hZ2VyLmNvbnRleHQuZGVjb2RlQXVkaW9EYXRhKHJlcXVlc3QucmVzcG9uc2UsIGZ1bmN0aW9uKGJ1ZmZlcilcblx0XHR7XG5cdFx0XHR2YXIgc291bmQgPSBuZXcgU291bmQoYnVmZmVyKTtcblx0XHRcdFNvdW5kTWFuYWdlci5sb2FkZWRbdXJsXSA9IHNvdW5kO1xuXHRcdFx0aWYoY2IgIT0gdW5kZWZpbmVkKVxuXHRcdFx0XHRjYi5jYWxsKHRoaXMsc291bmQpO1xuXHRcdH0pO1xuXHR9XG5cdHJlcXVlc3Quc2VuZCgpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBTb3VuZE1hbmFnZXI7XG5cblxuIiwidmFyIFNvdW5kTWFuYWdlciA9IHJlcXVpcmUoXCIuL1NvdW5kTWFuYWdlclwiKVxuXG4vL2dhcCBiZXR3ZWVuIG5vdGVzIGluIG1ham9yIHNlY29uZCAodG9uKVxuXG52YXIgb2N0YXZlID0gNjtcbnZhciBoYWxmdG9uZSA9IDEuMDU5NDY7XG52YXIgdG9uZSA9IGhhbGZ0b25lKmhhbGZ0b25lO1xuXG5mdW5jdGlvbiBTeW50aCgpe1xuXHR0aGlzLnNjYWxlID0gbnVsbDtcblx0dGhpcy50b25hbCA9IG51bGw7XG5cdHRoaXMuZGVmYXVsdERlbGF5ID0gMDtcblx0dGhpcy5kZWZhdWx0Tm90ZVRpbWUgPSAyMDA7XG59XG5cblxuLy9nYXAgYmV0dyBub3RlcyBpbiBoYWxmdG9uZVxuU3ludGguc2NhbGUgPSB7XG5cdG1ham9yIDogWzIsMiwxLDIsMiwyLDFdLFxuXHRtaW5vciA6IFsyLDEsMiwyLDEsMiwyXSxcblx0Y2hyb21hIDogWzEsMSwxLDEsMSwxLDEsMSwxLDEsMSwxXSxcblx0cGVudGFNYWpvciA6WzIsMiwzLDIsM10sXG5cdHBlbnRhTWlub3IgOlszLDIsMiwzLDJdLFxuXHRwZW50YUJsdWVOb3RlIDpbXVxufVxuXG5cblxuLy9mb3IgZGVidWdcblN5bnRoLnByb3RvdHlwZS5wbGF5U2NhbGUgPSBmdW5jdGlvbih0b25hbCxzY2FsZSlcbntcblx0Zm9yKHZhciBpPTE7aTw9c2NhbGUubGVuZ3RoKzE7aSsrKVxuXHR7XG5cdFx0dGhpcy5wbGF5RGVncmVlKGksIHRvbmFsLCBzY2FsZSxpKjIwMC8xMDAwKTtcblx0fVxuXG59XG5cbi8vYXV0b21hdGljIGphbSwgbmljZXIgdGhhbiByYW5kb20gbm90ZVxuU3ludGgucHJvdG90eXBlLmdldEphbU5vdGUgPSBmdW5jdGlvbigpXG57XG5cbn1cblxuLy9kZWdyZWUgMSA9IHRvbmFsXG5TeW50aC5wcm90b3R5cGUucGxheURlZ3JlZSA9IGZ1bmN0aW9uKG51bWIsdG9uYWwsc2NhbGUsZGVsYXkpXG57XG5cdC8vaWYganVzdCBudW1iIGRlZmluaWVkIDogcGxheSB0aGlzIHN5bnRoIHRvbmFsIGFuZCBzY2FsZS5cblx0aWYodG9uYWwgPT11bmRlZmluZWQgfHwgc2NhbGUgPT0gdW5kZWZpbmVkKVxuXHR7XG5cdFx0dG9uYWwgPSB0aGlzLnRvbmFsO1xuXHRcdHNjYWxlID0gdGhpcy5zY2FsZTtcblx0fVxuXHR2YXIgZnJlcU11bHRpcGxpZXIgPSAxO1xuXG5cdGZvcih2YXIgaSA9IDA7aTxudW1iLTE7aSsrKVxuXHR7XG5cdFx0ZnJlcU11bHRpcGxpZXIgKj0gTWF0aC5wb3coMS4wNTk0NixzY2FsZVtpXSk7XG5cdH1cblx0dGhpcy5wbGF5KHRvbmFsICogZnJlcU11bHRpcGxpZXIsZGVsYXkpO1xufVxuXG5TeW50aC5wcm90b3R5cGUucGxheSA9IGZ1bmN0aW9uKGZyZXEsZGVsYXkpXG57XHRcblx0dmFyIHMgPSBTb3VuZE1hbmFnZXIuY29udGV4dC5jcmVhdGVPc2NpbGxhdG9yKCk7XG5cdGRlbGF5ID0gZGVsYXkgfCB0aGlzLmRlZmF1bHREZWxheTtcblx0ZGVsYXkgPSBTb3VuZE1hbmFnZXIuY29udGV4dC5jdXJyZW50VGltZSArIGRlbGF5O1xuXHRzLmNvbm5lY3QoIFNvdW5kTWFuYWdlci5jb250ZXh0LmRlc3RpbmF0aW9uICk7XG5cdHMuZnJlcXVlbmN5LnZhbHVlID0gZnJlcTtcblx0cy5zdGFydChkZWxheSk7XG5cdHMuc3RvcChkZWxheSt0aGlzLmRlZmF1bHROb3RlVGltZS8xMDAwKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTeW50aDtcbiIsIi8vc291bmRjb250ZXh0IHdyYXBwZXIuXG5cbnZhciBTb3VuZENvbnRleHQ7XG50cnlcbntcblx0d2luZG93LkF1ZGlvQ29udGV4dCA9IHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dDtcblx0U291bmRDb250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xufVxuY2F0Y2ggKGUpXG57XG5cdGFsZXJ0KCdXZWIgQXVkaW8gQVBJIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU291bmRDb250ZXh0OyIsInZhciBTb3VuZENvbnRleHQgPSByZXF1aXJlKFwiLi9Tb3VuZENvbnRleHQuanNcIik7XG5cbi8vV3JhcHBlciBhcm91bmQgYSBzb3VuZEJ1ZmZlclxuXG52YXIgU291bmQgPSBmdW5jdGlvbihidWZmZXIpXG57XG5cdHRoaXMuYnVmZmVyID0gYnVmZmVyO1xufVxuXG5Tb3VuZC5wcm90b3R5cGUucGxheSA9IGZ1bmN0aW9uKGRlbGF5KSB7XG5cdHZhciBzb3VyY2UgPSBTb3VuZENvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7IFxuXHRzb3VyY2UuYnVmZmVyID0gdGhpcy5idWZmZXI7ICAgICAgICAgICAgICAgICAgICBcblx0c291cmNlLmNvbm5lY3QoU291bmRDb250ZXh0LmRlc3RpbmF0aW9uKTtcblx0c291cmNlLnN0YXJ0KGRlbGF5KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU291bmQ7Il19
;