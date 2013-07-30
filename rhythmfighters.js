;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
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
},{"./SoundManager.js":2,"./Synth":3,"./RequestAnimFrame":4}],4:[function(require,module,exports){
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
	pentaMinor :[3,2,2,3,2]
}



//for debug
Synth.prototype.playScale = function(tonal,scale)
{
	for(var i=1;i<=scale.length+1;i++)
	{
		this.playDegree(i, tonal, scale,i*200/1000);
	}

}

Synth.prototype.getJamNote = function()
{

}

//degree 1 = tonal
Synth.prototype.playDegree = function(numb,tonal,scale,delay)
{
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

},{"./SoundManager":2}],6:[function(require,module,exports){
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
},{"./SoundContext.js":6}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYmVuamFtaW5nYXR0ZXQvVHJhdmF1eC9SaHl0aG1GaWdodGVycy9zY3JpcHRzL21haW4uanMiLCIvVXNlcnMvYmVuamFtaW5nYXR0ZXQvVHJhdmF1eC9SaHl0aG1GaWdodGVycy9zY3JpcHRzL1JlcXVlc3RBbmltRnJhbWUuanMiLCIvVXNlcnMvYmVuamFtaW5nYXR0ZXQvVHJhdmF1eC9SaHl0aG1GaWdodGVycy9zY3JpcHRzL1NvdW5kTWFuYWdlci5qcyIsIi9Vc2Vycy9iZW5qYW1pbmdhdHRldC9UcmF2YXV4L1JoeXRobUZpZ2h0ZXJzL3NjcmlwdHMvU3ludGguanMiLCIvVXNlcnMvYmVuamFtaW5nYXR0ZXQvVHJhdmF1eC9SaHl0aG1GaWdodGVycy9zY3JpcHRzL1NvdW5kQ29udGV4dC5qcyIsIi9Vc2Vycy9iZW5qYW1pbmdhdHRldC9UcmF2YXV4L1JoeXRobUZpZ2h0ZXJzL3NjcmlwdHMvU291bmQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFNvdW5kTWFuYWdlciA9IHJlcXVpcmUoXCIuL1NvdW5kTWFuYWdlci5qc1wiKTtcbnZhciBTeW50aCA9IHJlcXVpcmUoXCIuL1N5bnRoXCIpO1xuXG4vL2p1c3QgcnVuIHRoZSBwb2x5ZmlsbCA6XG5yZXF1aXJlKFwiLi9SZXF1ZXN0QW5pbUZyYW1lXCIpO1xuXG5jb25zb2xlLmxvZyhcIk9OT1wiKTtcblxuXG52YXIgcyA9IG5ldyBTeW50aCgpO1xucy50b25hbCA9IDI2NDtcbnMuc2NhbGUgPSBTeW50aC5zY2FsZS5wZW50YU1pbm9yO1xuXG53aW5kb3cub25rZXlkb3duID0gZnVuY3Rpb24oZSkge1xuXG5cdGlmIChlLmtleUNvZGUgPT0gNjUpIHtcblx0XHRzLnBsYXlEZWdyZWUoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKnMuc2NhbGUubGVuZ3RoKSsxKTtcblx0fVxuXG59XG5cbnZhciB1cGRhdGUgPSBmdW5jdGlvbih0aW1lKSB7XG5cbn07XG5cbihmdW5jdGlvbiBhbmltTG9vcCh0aW1lKSB7XG5cdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbUxvb3ApO1xuXHR1cGRhdGUodGltZSk7XG59KSgpIiwiLy8gaHR0cDovL3BhdWxpcmlzaC5jb20vMjAxMS9yZXF1ZXN0YW5pbWF0aW9uZnJhbWUtZm9yLXNtYXJ0LWFuaW1hdGluZy9cbi8vIGh0dHA6Ly9teS5vcGVyYS5jb20vZW1vbGxlci9ibG9nLzIwMTEvMTIvMjAvcmVxdWVzdGFuaW1hdGlvbmZyYW1lLWZvci1zbWFydC1lci1hbmltYXRpbmdcbiBcbi8vIHJlcXVlc3RBbmltYXRpb25GcmFtZSBwb2x5ZmlsbCBieSBFcmlrIE3DtmxsZXIuIGZpeGVzIGZyb20gUGF1bCBJcmlzaCBhbmQgVGlubyBaaWpkZWxcbiBcbi8vIE1JVCBsaWNlbnNlXG4gXG4oZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxhc3RUaW1lID0gMDtcbiAgICB2YXIgdmVuZG9ycyA9IFsnbXMnLCAnbW96JywgJ3dlYmtpdCcsICdvJ107XG4gICAgZm9yKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK3gpIHtcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdKydSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcbiAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvcnNbeF0rJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ10gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IHdpbmRvd1t2ZW5kb3JzW3hdKydDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcbiAgICB9XG4gXG4gICAgaWYgKCF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKVxuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oY2FsbGJhY2ssIGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNiAtIChjdXJyVGltZSAtIGxhc3RUaW1lKSk7XG4gICAgICAgICAgICB2YXIgaWQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHsgY2FsbGJhY2soY3VyclRpbWUgKyB0aW1lVG9DYWxsKTsgfSwgXG4gICAgICAgICAgICAgIHRpbWVUb0NhbGwpO1xuICAgICAgICAgICAgbGFzdFRpbWUgPSBjdXJyVGltZSArIHRpbWVUb0NhbGw7XG4gICAgICAgICAgICByZXR1cm4gaWQ7XG4gICAgICAgIH07XG4gXG4gICAgaWYgKCF3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUpXG4gICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQoaWQpO1xuICAgICAgICB9O1xufSgpKTsiLCJ2YXIgU291bmQgPSByZXF1aXJlKFwiLi9Tb3VuZFwiKTtcbnZhciBTb3VuZENvbnRleHQgPSByZXF1aXJlKFwiLi9Tb3VuZENvbnRleHRcIik7XG5cbnZhciBTb3VuZE1hbmFnZXIgPWZ1bmN0aW9uKCl7fTtcblNvdW5kTWFuYWdlci5sb2FkZWQgPSBbXTtcblNvdW5kTWFuYWdlci5jb250ZXh0ID0gU291bmRDb250ZXh0O1xuXG5Tb3VuZE1hbmFnZXIuYmF0Y2hMb2FkID0gZnVuY3Rpb24oaW5wdXRBcnJheSxjYilcbntcblxuXG59XG5cblNvdW5kTWFuYWdlci5sb2FkU291bmQgPSBmdW5jdGlvbih1cmwsY2IpXG57XG5cdHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdHJlcXVlc3Qub3BlbignR0VUJywgdXJsLCB0cnVlKTtcblx0cmVxdWVzdC5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInO1xuXG5cdC8vIERlY29kZSBhc3luY2hyb25vdXNseVxuXHRyZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKClcblx0e1xuXHRcdFNvdW5kTWFuYWdlci5jb250ZXh0LmRlY29kZUF1ZGlvRGF0YShyZXF1ZXN0LnJlc3BvbnNlLCBmdW5jdGlvbihidWZmZXIpXG5cdFx0e1xuXHRcdFx0dmFyIHNvdW5kID0gbmV3IFNvdW5kKGJ1ZmZlcik7XG5cdFx0XHRTb3VuZE1hbmFnZXIubG9hZGVkW3VybF0gPSBzb3VuZDtcblx0XHRcdGlmKGNiICE9IHVuZGVmaW5lZClcblx0XHRcdFx0Y2IuY2FsbCh0aGlzLHNvdW5kKTtcblx0XHR9KTtcblx0fVxuXHRyZXF1ZXN0LnNlbmQoKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gU291bmRNYW5hZ2VyO1xuXG5cbiIsInZhciBTb3VuZE1hbmFnZXIgPSByZXF1aXJlKFwiLi9Tb3VuZE1hbmFnZXJcIilcblxuLy9nYXAgYmV0d2VlbiBub3RlcyBpbiBtYWpvciBzZWNvbmQgKHRvbilcblxudmFyIG9jdGF2ZSA9IDY7XG52YXIgaGFsZnRvbmUgPSAxLjA1OTQ2O1xudmFyIHRvbmUgPSBoYWxmdG9uZSpoYWxmdG9uZTtcblxuZnVuY3Rpb24gU3ludGgoKXtcblx0dGhpcy5zY2FsZSA9IG51bGw7XG5cdHRoaXMudG9uYWwgPSBudWxsO1xuXHR0aGlzLmRlZmF1bHREZWxheSA9IDA7XG5cdHRoaXMuZGVmYXVsdE5vdGVUaW1lID0gMjAwO1xufVxuXG5cbi8vZ2FwIGJldHcgbm90ZXMgaW4gaGFsZnRvbmVcblN5bnRoLnNjYWxlID0ge1xuXHRtYWpvciA6IFsyLDIsMSwyLDIsMiwxXSxcblx0bWlub3IgOiBbMiwxLDIsMiwxLDIsMl0sXG5cdGNocm9tYSA6IFsxLDEsMSwxLDEsMSwxLDEsMSwxLDEsMV0sXG5cdHBlbnRhTWFqb3IgOlsyLDIsMywyLDNdLFxuXHRwZW50YU1pbm9yIDpbMywyLDIsMywyXVxufVxuXG5cblxuLy9mb3IgZGVidWdcblN5bnRoLnByb3RvdHlwZS5wbGF5U2NhbGUgPSBmdW5jdGlvbih0b25hbCxzY2FsZSlcbntcblx0Zm9yKHZhciBpPTE7aTw9c2NhbGUubGVuZ3RoKzE7aSsrKVxuXHR7XG5cdFx0dGhpcy5wbGF5RGVncmVlKGksIHRvbmFsLCBzY2FsZSxpKjIwMC8xMDAwKTtcblx0fVxuXG59XG5cblN5bnRoLnByb3RvdHlwZS5nZXRKYW1Ob3RlID0gZnVuY3Rpb24oKVxue1xuXG59XG5cbi8vZGVncmVlIDEgPSB0b25hbFxuU3ludGgucHJvdG90eXBlLnBsYXlEZWdyZWUgPSBmdW5jdGlvbihudW1iLHRvbmFsLHNjYWxlLGRlbGF5KVxue1xuXHRpZih0b25hbCA9PXVuZGVmaW5lZCB8fCBzY2FsZSA9PSB1bmRlZmluZWQpXG5cdHtcblx0XHR0b25hbCA9IHRoaXMudG9uYWw7XG5cdFx0c2NhbGUgPSB0aGlzLnNjYWxlO1xuXHR9XG5cdHZhciBmcmVxTXVsdGlwbGllciA9IDE7XG5cblx0Zm9yKHZhciBpID0gMDtpPG51bWItMTtpKyspXG5cdHtcblx0XHRmcmVxTXVsdGlwbGllciAqPSBNYXRoLnBvdygxLjA1OTQ2LHNjYWxlW2ldKTtcblx0fVxuXHR0aGlzLnBsYXkodG9uYWwgKiBmcmVxTXVsdGlwbGllcixkZWxheSk7XG59XG5cblN5bnRoLnByb3RvdHlwZS5wbGF5ID0gZnVuY3Rpb24oZnJlcSxkZWxheSlcbntcdFxuXHR2YXIgcyA9IFNvdW5kTWFuYWdlci5jb250ZXh0LmNyZWF0ZU9zY2lsbGF0b3IoKTtcblx0ZGVsYXkgPSBkZWxheSB8IHRoaXMuZGVmYXVsdERlbGF5O1xuXHRkZWxheSA9IFNvdW5kTWFuYWdlci5jb250ZXh0LmN1cnJlbnRUaW1lICsgZGVsYXk7XG5cdHMuY29ubmVjdCggU291bmRNYW5hZ2VyLmNvbnRleHQuZGVzdGluYXRpb24gKTtcblx0cy5mcmVxdWVuY3kudmFsdWUgPSBmcmVxO1xuXHRzLnN0YXJ0KGRlbGF5KTtcblx0cy5zdG9wKGRlbGF5K3RoaXMuZGVmYXVsdE5vdGVUaW1lLzEwMDApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFN5bnRoO1xuIiwiLy9zb3VuZGNvbnRleHQgd3JhcHBlci5cblxudmFyIFNvdW5kQ29udGV4dDtcbnRyeVxue1xuXHR3aW5kb3cuQXVkaW9Db250ZXh0ID0gd2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0O1xuXHRTb3VuZENvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KCk7XG59XG5jYXRjaCAoZSlcbntcblx0YWxlcnQoJ1dlYiBBdWRpbyBBUEkgaXMgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXInKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTb3VuZENvbnRleHQ7IiwidmFyIFNvdW5kQ29udGV4dCA9IHJlcXVpcmUoXCIuL1NvdW5kQ29udGV4dC5qc1wiKTtcblxuLy9XcmFwcGVyIGFyb3VuZCBhIHNvdW5kQnVmZmVyXG5cbnZhciBTb3VuZCA9IGZ1bmN0aW9uKGJ1ZmZlcilcbntcblx0dGhpcy5idWZmZXIgPSBidWZmZXI7XG59XG5cblNvdW5kLnByb3RvdHlwZS5wbGF5ID0gZnVuY3Rpb24oZGVsYXkpIHtcblx0dmFyIHNvdXJjZSA9IFNvdW5kQ29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTsgXG5cdHNvdXJjZS5idWZmZXIgPSB0aGlzLmJ1ZmZlcjsgICAgICAgICAgICAgICAgICAgIFxuXHRzb3VyY2UuY29ubmVjdChTb3VuZENvbnRleHQuZGVzdGluYXRpb24pO1xuXHRzb3VyY2Uuc3RhcnQoZGVsYXkpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTb3VuZDsiXX0=
;