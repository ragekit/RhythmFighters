;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
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
},{"./SoundManager.js":2,"./Metronome":3,"./Sound":4,"./RequestAnimFrame":5}],5:[function(require,module,exports){
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



},{"./Sound":4,"./SoundContext":6}],4:[function(require,module,exports){
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
},{"./SoundContext.js":6}],3:[function(require,module,exports){
var sm = require("./SoundManager");
var Synth = require("./Synth");

var Metronome = function(bip)
{
	this.bip = bip;
	this.timer;
	this.tempo = 50;
	this.running = false;

	//to test
	this.beatTimes = [];
	this.synth = new Synth();
}

Metronome.prototype.play = function()
{
	if(this.running) return;
	this.running = true;
	(function scheduleNotes()
	{
		var startTime = sm.context.currentTime;
		var noteTime = (60 / this.tempo);
		this.beatTimes = [];

		for (var i = 0; i < 4; i++) 
		{
			this.beatTimes.push(startTime+ i * noteTime);
			this.synth.play(startTime + i * noteTime);
		}
		this.timer = window.setTimeout(scheduleNotes.bind(this),noteTime * 1000 * 4); 
	}.bind(this))()
	
}

Metronome.prototype.stop = function()
{
	this.running = false;
	window.clearTimeout(this.timer);
}

Metronome.prototype.toggle = function()
{
	if(this.running) this.stop();
	else if(!this.running) this.play();
}


module.exports = Metronome;
},{"./SoundManager":2,"./Synth":7}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
var SoundManager = require("./SoundManager")

function Synth(){

}

Synth.prototype.play = function(delay)
{	
	var s = SoundManager.context.createOscillator();
	s.connect( SoundManager.context.destination );
	s.frequency.value = 440.0;
	s.start(delay);
	s.stop(delay+100/1000);
}

module.exports = Synth;

},{"./SoundManager":2}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYmVuamFtaW5nYXR0ZXQvVHJhdmF1eC9SaHl0aG1GaWdodGVycy9zY3JpcHRzL21haW4uanMiLCIvVXNlcnMvYmVuamFtaW5nYXR0ZXQvVHJhdmF1eC9SaHl0aG1GaWdodGVycy9zY3JpcHRzL1JlcXVlc3RBbmltRnJhbWUuanMiLCIvVXNlcnMvYmVuamFtaW5nYXR0ZXQvVHJhdmF1eC9SaHl0aG1GaWdodGVycy9zY3JpcHRzL1NvdW5kTWFuYWdlci5qcyIsIi9Vc2Vycy9iZW5qYW1pbmdhdHRldC9UcmF2YXV4L1JoeXRobUZpZ2h0ZXJzL3NjcmlwdHMvU291bmQuanMiLCIvVXNlcnMvYmVuamFtaW5nYXR0ZXQvVHJhdmF1eC9SaHl0aG1GaWdodGVycy9zY3JpcHRzL01ldHJvbm9tZS5qcyIsIi9Vc2Vycy9iZW5qYW1pbmdhdHRldC9UcmF2YXV4L1JoeXRobUZpZ2h0ZXJzL3NjcmlwdHMvU291bmRDb250ZXh0LmpzIiwiL1VzZXJzL2JlbmphbWluZ2F0dGV0L1RyYXZhdXgvUmh5dGhtRmlnaHRlcnMvc2NyaXB0cy9TeW50aC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFNvdW5kTWFuYWdlciA9IHJlcXVpcmUoXCIuL1NvdW5kTWFuYWdlci5qc1wiKTtcbnZhciBNZXRyb25vbWUgPSByZXF1aXJlKFwiLi9NZXRyb25vbWVcIik7XG52YXIgU291bmQgPSByZXF1aXJlKFwiLi9Tb3VuZFwiKTtcblxuLy9qdXN0IHJ1biB0aGUgcG9seWZpbGwgOlxucmVxdWlyZShcIi4vUmVxdWVzdEFuaW1GcmFtZVwiKTtcblxuY29uc29sZS5sb2coXCJPTk9cIik7XG52YXIgbTtcblNvdW5kTWFuYWdlci5sb2FkU291bmQoXCJiaXAud2F2XCIsIGZ1bmN0aW9uKHNvdW5kKSB7XG5cblx0bSA9IG5ldyBNZXRyb25vbWUoc291bmQpO1xuXG59KTtcbndpbmRvdy5vbmtleWRvd24gPSBmdW5jdGlvbihlKSB7XG5cblx0aWYgKGUua2V5Q29kZSA9PSA2NSkge1xuXHRcdG0udG9nZ2xlKCk7XG5cdH1cblx0XG5cdHZhciBtaW4gPSAxMDAwMDAwO1xuXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgbS5iZWF0VGltZXMubGVuZ3RoOyBpKyspIHtcblx0XHRtaW4gPSBNYXRoLm1pbihNYXRoLmFicyhTb3VuZE1hbmFnZXIuY29udGV4dC5jdXJyZW50VGltZSAtIG0uYmVhdFRpbWVzW2ldKSwgbWluKTtcblx0fVxuXHRjb25zb2xlLmxvZyhtaW4pO1xufVxuXG52YXIgdXBkYXRlID0gZnVuY3Rpb24odGltZSkge1xuXG59O1xuXG4oZnVuY3Rpb24gYW5pbUxvb3AodGltZSkge1xuXHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1Mb29wKTtcblx0dXBkYXRlKHRpbWUpO1xufSkoKSIsIi8vIGh0dHA6Ly9wYXVsaXJpc2guY29tLzIwMTEvcmVxdWVzdGFuaW1hdGlvbmZyYW1lLWZvci1zbWFydC1hbmltYXRpbmcvXG4vLyBodHRwOi8vbXkub3BlcmEuY29tL2Vtb2xsZXIvYmxvZy8yMDExLzEyLzIwL3JlcXVlc3RhbmltYXRpb25mcmFtZS1mb3Itc21hcnQtZXItYW5pbWF0aW5nXG4gXG4vLyByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgcG9seWZpbGwgYnkgRXJpayBNw7ZsbGVyLiBmaXhlcyBmcm9tIFBhdWwgSXJpc2ggYW5kIFRpbm8gWmlqZGVsXG4gXG4vLyBNSVQgbGljZW5zZVxuIFxuKGZ1bmN0aW9uKCkge1xuICAgIHZhciBsYXN0VGltZSA9IDA7XG4gICAgdmFyIHZlbmRvcnMgPSBbJ21zJywgJ21veicsICd3ZWJraXQnLCAnbyddO1xuICAgIGZvcih2YXIgeCA9IDA7IHggPCB2ZW5kb3JzLmxlbmd0aCAmJiAhd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTsgKyt4KSB7XG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1t4XSsnUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ107XG4gICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdKydDYW5jZWxBbmltYXRpb25GcmFtZSddIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCB3aW5kb3dbdmVuZG9yc1t4XSsnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ107XG4gICAgfVxuIFxuICAgIGlmICghd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSlcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKGNhbGxiYWNrLCBlbGVtZW50KSB7XG4gICAgICAgICAgICB2YXIgY3VyclRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgIHZhciB0aW1lVG9DYWxsID0gTWF0aC5tYXgoMCwgMTYgLSAoY3VyclRpbWUgLSBsYXN0VGltZSkpO1xuICAgICAgICAgICAgdmFyIGlkID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IGNhbGxiYWNrKGN1cnJUaW1lICsgdGltZVRvQ2FsbCk7IH0sIFxuICAgICAgICAgICAgICB0aW1lVG9DYWxsKTtcbiAgICAgICAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsO1xuICAgICAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgICB9O1xuIFxuICAgIGlmICghd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKVxuICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGlkKTtcbiAgICAgICAgfTtcbn0oKSk7IiwidmFyIFNvdW5kID0gcmVxdWlyZShcIi4vU291bmRcIik7XG52YXIgU291bmRDb250ZXh0ID0gcmVxdWlyZShcIi4vU291bmRDb250ZXh0XCIpO1xuXG52YXIgU291bmRNYW5hZ2VyID1mdW5jdGlvbigpe307XG5Tb3VuZE1hbmFnZXIubG9hZGVkID0gW107XG5Tb3VuZE1hbmFnZXIuY29udGV4dCA9IFNvdW5kQ29udGV4dDtcblxuU291bmRNYW5hZ2VyLmJhdGNoTG9hZCA9IGZ1bmN0aW9uKGlucHV0QXJyYXksY2IpXG57XG5cblxufVxuXG5Tb3VuZE1hbmFnZXIubG9hZFNvdW5kID0gZnVuY3Rpb24odXJsLGNiKVxue1xuXHR2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXHRyZXF1ZXN0Lm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG5cdHJlcXVlc3QucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJztcblxuXHQvLyBEZWNvZGUgYXN5bmNocm9ub3VzbHlcblx0cmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbigpXG5cdHtcblx0XHRTb3VuZE1hbmFnZXIuY29udGV4dC5kZWNvZGVBdWRpb0RhdGEocmVxdWVzdC5yZXNwb25zZSwgZnVuY3Rpb24oYnVmZmVyKVxuXHRcdHtcblx0XHRcdHZhciBzb3VuZCA9IG5ldyBTb3VuZChidWZmZXIpO1xuXHRcdFx0U291bmRNYW5hZ2VyLmxvYWRlZFt1cmxdID0gc291bmQ7XG5cdFx0XHRpZihjYiAhPSB1bmRlZmluZWQpXG5cdFx0XHRcdGNiLmNhbGwodGhpcyxzb3VuZCk7XG5cdFx0fSk7XG5cdH1cblx0cmVxdWVzdC5zZW5kKCk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IFNvdW5kTWFuYWdlcjtcblxuXG4iLCJ2YXIgU291bmRDb250ZXh0ID0gcmVxdWlyZShcIi4vU291bmRDb250ZXh0LmpzXCIpO1xuXG4vL1dyYXBwZXIgYXJvdW5kIGEgc291bmRCdWZmZXJcblxudmFyIFNvdW5kID0gZnVuY3Rpb24oYnVmZmVyKVxue1xuXHR0aGlzLmJ1ZmZlciA9IGJ1ZmZlcjtcbn1cblxuU291bmQucHJvdG90eXBlLnBsYXkgPSBmdW5jdGlvbihkZWxheSkge1xuXHR2YXIgc291cmNlID0gU291bmRDb250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpOyBcblx0c291cmNlLmJ1ZmZlciA9IHRoaXMuYnVmZmVyOyAgICAgICAgICAgICAgICAgICAgXG5cdHNvdXJjZS5jb25uZWN0KFNvdW5kQ29udGV4dC5kZXN0aW5hdGlvbik7XG5cdHNvdXJjZS5zdGFydChkZWxheSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNvdW5kOyIsInZhciBzbSA9IHJlcXVpcmUoXCIuL1NvdW5kTWFuYWdlclwiKTtcbnZhciBTeW50aCA9IHJlcXVpcmUoXCIuL1N5bnRoXCIpO1xuXG52YXIgTWV0cm9ub21lID0gZnVuY3Rpb24oYmlwKVxue1xuXHR0aGlzLmJpcCA9IGJpcDtcblx0dGhpcy50aW1lcjtcblx0dGhpcy50ZW1wbyA9IDUwO1xuXHR0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcblxuXHQvL3RvIHRlc3Rcblx0dGhpcy5iZWF0VGltZXMgPSBbXTtcblx0dGhpcy5zeW50aCA9IG5ldyBTeW50aCgpO1xufVxuXG5NZXRyb25vbWUucHJvdG90eXBlLnBsYXkgPSBmdW5jdGlvbigpXG57XG5cdGlmKHRoaXMucnVubmluZykgcmV0dXJuO1xuXHR0aGlzLnJ1bm5pbmcgPSB0cnVlO1xuXHQoZnVuY3Rpb24gc2NoZWR1bGVOb3RlcygpXG5cdHtcblx0XHR2YXIgc3RhcnRUaW1lID0gc20uY29udGV4dC5jdXJyZW50VGltZTtcblx0XHR2YXIgbm90ZVRpbWUgPSAoNjAgLyB0aGlzLnRlbXBvKTtcblx0XHR0aGlzLmJlYXRUaW1lcyA9IFtdO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCA0OyBpKyspIFxuXHRcdHtcblx0XHRcdHRoaXMuYmVhdFRpbWVzLnB1c2goc3RhcnRUaW1lKyBpICogbm90ZVRpbWUpO1xuXHRcdFx0dGhpcy5zeW50aC5wbGF5KHN0YXJ0VGltZSArIGkgKiBub3RlVGltZSk7XG5cdFx0fVxuXHRcdHRoaXMudGltZXIgPSB3aW5kb3cuc2V0VGltZW91dChzY2hlZHVsZU5vdGVzLmJpbmQodGhpcyksbm90ZVRpbWUgKiAxMDAwICogNCk7IFxuXHR9LmJpbmQodGhpcykpKClcblx0XG59XG5cbk1ldHJvbm9tZS5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uKClcbntcblx0dGhpcy5ydW5uaW5nID0gZmFsc2U7XG5cdHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy50aW1lcik7XG59XG5cbk1ldHJvbm9tZS5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24oKVxue1xuXHRpZih0aGlzLnJ1bm5pbmcpIHRoaXMuc3RvcCgpO1xuXHRlbHNlIGlmKCF0aGlzLnJ1bm5pbmcpIHRoaXMucGxheSgpO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gTWV0cm9ub21lOyIsIi8vc291bmRjb250ZXh0IHdyYXBwZXIuXG5cbnZhciBTb3VuZENvbnRleHQ7XG50cnlcbntcblx0d2luZG93LkF1ZGlvQ29udGV4dCA9IHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dDtcblx0U291bmRDb250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xufVxuY2F0Y2ggKGUpXG57XG5cdGFsZXJ0KCdXZWIgQXVkaW8gQVBJIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU291bmRDb250ZXh0OyIsInZhciBTb3VuZE1hbmFnZXIgPSByZXF1aXJlKFwiLi9Tb3VuZE1hbmFnZXJcIilcblxuZnVuY3Rpb24gU3ludGgoKXtcblxufVxuXG5TeW50aC5wcm90b3R5cGUucGxheSA9IGZ1bmN0aW9uKGRlbGF5KVxue1x0XG5cdHZhciBzID0gU291bmRNYW5hZ2VyLmNvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xuXHRzLmNvbm5lY3QoIFNvdW5kTWFuYWdlci5jb250ZXh0LmRlc3RpbmF0aW9uICk7XG5cdHMuZnJlcXVlbmN5LnZhbHVlID0gNDQwLjA7XG5cdHMuc3RhcnQoZGVsYXkpO1xuXHRzLnN0b3AoZGVsYXkrMTAwLzEwMDApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFN5bnRoO1xuIl19
;