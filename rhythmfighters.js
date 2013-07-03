;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
var SoundManager = require("./SoundManager.js");
var Metronome = require("./Metronome");
var Sound = require("./Sound");
var Raf = require("./RequestAnimFrame");
var sc = require("./SoundContext");

console.log("ONO");
var m;
SoundManager.loadSound("bip.wav",function(sound){
	
	m = new Metronome(sound);

});


window.onkeydown = function(e)
{
	if(e.keyCode == 65) 
		{
			m.toggle();
		}
	var min = 1000000;
	for(var i =0; i<m.beatTimes.length;i++)
	{
		min = Math.min(Math.abs(sc.currentTime - m.beatTimes[i]),min);
	}
	console.log(min);
}


var update = function(time)
{

};

(function animLoop(time)
{
	Raf(animLoop);
	update(time);
})()
	




},{"./SoundManager.js":2,"./Metronome":3,"./Sound":4,"./RequestAnimFrame":5,"./SoundContext":6}],5:[function(require,module,exports){
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

module.exports = window.requestAnimationFrame;
},{}],6:[function(require,module,exports){
//Singleton to ensure there's only one sound Context

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
},{}],2:[function(require,module,exports){
var Sound = require("./Sound");
var SoundContext = require("./SoundContext");

var SoundManager =function(){};
SoundManager.loaded = [];

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
		SoundContext.decodeAudioData(request.response, function(buffer)
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
var SoundContext = require("./SoundContext");

var Metronome = function(bip)
{
	this.bip = bip;
	this.timer;
	this.tempo = 50;
	this.running = false;

	//to test
	this.beatTimes = [];
}

Metronome.prototype.play = function()
{
	if(this.running) return;
	this.running = true;
	(function scheduleNotes()
	{
		var startTime = SoundContext.currentTime;
		var noteTime = (60 / this.tempo);
		this.beatTimes = [];

		for (var i = 0; i < 4; i++) 
		{
			this.beatTimes.push(startTime+ i * noteTime);
			this.bip.play(startTime + i * noteTime);
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
},{"./SoundContext":6,"./SoundManager":2}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYmVuamFtaW5nYXR0ZXQvVHJhdmF1eC9SaHl0aG1GaWdodGVycy9zY3JpcHRzL21haW4uanMiLCIvVXNlcnMvYmVuamFtaW5nYXR0ZXQvVHJhdmF1eC9SaHl0aG1GaWdodGVycy9zY3JpcHRzL1JlcXVlc3RBbmltRnJhbWUuanMiLCIvVXNlcnMvYmVuamFtaW5nYXR0ZXQvVHJhdmF1eC9SaHl0aG1GaWdodGVycy9zY3JpcHRzL1NvdW5kQ29udGV4dC5qcyIsIi9Vc2Vycy9iZW5qYW1pbmdhdHRldC9UcmF2YXV4L1JoeXRobUZpZ2h0ZXJzL3NjcmlwdHMvU291bmRNYW5hZ2VyLmpzIiwiL1VzZXJzL2JlbmphbWluZ2F0dGV0L1RyYXZhdXgvUmh5dGhtRmlnaHRlcnMvc2NyaXB0cy9Tb3VuZC5qcyIsIi9Vc2Vycy9iZW5qYW1pbmdhdHRldC9UcmF2YXV4L1JoeXRobUZpZ2h0ZXJzL3NjcmlwdHMvTWV0cm9ub21lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFNvdW5kTWFuYWdlciA9IHJlcXVpcmUoXCIuL1NvdW5kTWFuYWdlci5qc1wiKTtcbnZhciBNZXRyb25vbWUgPSByZXF1aXJlKFwiLi9NZXRyb25vbWVcIik7XG52YXIgU291bmQgPSByZXF1aXJlKFwiLi9Tb3VuZFwiKTtcbnZhciBSYWYgPSByZXF1aXJlKFwiLi9SZXF1ZXN0QW5pbUZyYW1lXCIpO1xudmFyIHNjID0gcmVxdWlyZShcIi4vU291bmRDb250ZXh0XCIpO1xuXG5jb25zb2xlLmxvZyhcIk9OT1wiKTtcbnZhciBtO1xuU291bmRNYW5hZ2VyLmxvYWRTb3VuZChcImJpcC53YXZcIixmdW5jdGlvbihzb3VuZCl7XG5cdFxuXHRtID0gbmV3IE1ldHJvbm9tZShzb3VuZCk7XG5cbn0pO1xuXG5cbndpbmRvdy5vbmtleWRvd24gPSBmdW5jdGlvbihlKVxue1xuXHRpZihlLmtleUNvZGUgPT0gNjUpIFxuXHRcdHtcblx0XHRcdG0udG9nZ2xlKCk7XG5cdFx0fVxuXHR2YXIgbWluID0gMTAwMDAwMDtcblx0Zm9yKHZhciBpID0wOyBpPG0uYmVhdFRpbWVzLmxlbmd0aDtpKyspXG5cdHtcblx0XHRtaW4gPSBNYXRoLm1pbihNYXRoLmFicyhzYy5jdXJyZW50VGltZSAtIG0uYmVhdFRpbWVzW2ldKSxtaW4pO1xuXHR9XG5cdGNvbnNvbGUubG9nKG1pbik7XG59XG5cblxudmFyIHVwZGF0ZSA9IGZ1bmN0aW9uKHRpbWUpXG57XG5cbn07XG5cbihmdW5jdGlvbiBhbmltTG9vcCh0aW1lKVxue1xuXHRSYWYoYW5pbUxvb3ApO1xuXHR1cGRhdGUodGltZSk7XG59KSgpXG5cdFxuXG5cblxuIiwiLy8gaHR0cDovL3BhdWxpcmlzaC5jb20vMjAxMS9yZXF1ZXN0YW5pbWF0aW9uZnJhbWUtZm9yLXNtYXJ0LWFuaW1hdGluZy9cbi8vIGh0dHA6Ly9teS5vcGVyYS5jb20vZW1vbGxlci9ibG9nLzIwMTEvMTIvMjAvcmVxdWVzdGFuaW1hdGlvbmZyYW1lLWZvci1zbWFydC1lci1hbmltYXRpbmdcbiBcbi8vIHJlcXVlc3RBbmltYXRpb25GcmFtZSBwb2x5ZmlsbCBieSBFcmlrIE3DtmxsZXIuIGZpeGVzIGZyb20gUGF1bCBJcmlzaCBhbmQgVGlubyBaaWpkZWxcbiBcbi8vIE1JVCBsaWNlbnNlXG4gXG4oZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxhc3RUaW1lID0gMDtcbiAgICB2YXIgdmVuZG9ycyA9IFsnbXMnLCAnbW96JywgJ3dlYmtpdCcsICdvJ107XG4gICAgZm9yKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK3gpIHtcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdKydSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcbiAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvcnNbeF0rJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ10gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IHdpbmRvd1t2ZW5kb3JzW3hdKydDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcbiAgICB9XG4gXG4gICAgaWYgKCF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKVxuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oY2FsbGJhY2ssIGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNiAtIChjdXJyVGltZSAtIGxhc3RUaW1lKSk7XG4gICAgICAgICAgICB2YXIgaWQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHsgY2FsbGJhY2soY3VyclRpbWUgKyB0aW1lVG9DYWxsKTsgfSwgXG4gICAgICAgICAgICAgIHRpbWVUb0NhbGwpO1xuICAgICAgICAgICAgbGFzdFRpbWUgPSBjdXJyVGltZSArIHRpbWVUb0NhbGw7XG4gICAgICAgICAgICByZXR1cm4gaWQ7XG4gICAgICAgIH07XG4gXG4gICAgaWYgKCF3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUpXG4gICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQoaWQpO1xuICAgICAgICB9O1xufSgpKTtcblxubW9kdWxlLmV4cG9ydHMgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyIsIi8vU2luZ2xldG9uIHRvIGVuc3VyZSB0aGVyZSdzIG9ubHkgb25lIHNvdW5kIENvbnRleHRcblxudmFyIFNvdW5kQ29udGV4dDtcbnRyeVxue1xuXHR3aW5kb3cuQXVkaW9Db250ZXh0ID0gd2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0O1xuXHRTb3VuZENvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KCk7XG59XG5jYXRjaCAoZSlcbntcblx0YWxlcnQoJ1dlYiBBdWRpbyBBUEkgaXMgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXInKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTb3VuZENvbnRleHQ7IiwidmFyIFNvdW5kID0gcmVxdWlyZShcIi4vU291bmRcIik7XG52YXIgU291bmRDb250ZXh0ID0gcmVxdWlyZShcIi4vU291bmRDb250ZXh0XCIpO1xuXG52YXIgU291bmRNYW5hZ2VyID1mdW5jdGlvbigpe307XG5Tb3VuZE1hbmFnZXIubG9hZGVkID0gW107XG5cblNvdW5kTWFuYWdlci5iYXRjaExvYWQgPSBmdW5jdGlvbihpbnB1dEFycmF5LGNiKVxue1xuXG5cbn1cblxuU291bmRNYW5hZ2VyLmxvYWRTb3VuZCA9IGZ1bmN0aW9uKHVybCxjYilcbntcblx0dmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblx0cmVxdWVzdC5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xuXHRyZXF1ZXN0LnJlc3BvbnNlVHlwZSA9ICdhcnJheWJ1ZmZlcic7XG5cblx0Ly8gRGVjb2RlIGFzeW5jaHJvbm91c2x5XG5cdHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24oKVxuXHR7XG5cdFx0U291bmRDb250ZXh0LmRlY29kZUF1ZGlvRGF0YShyZXF1ZXN0LnJlc3BvbnNlLCBmdW5jdGlvbihidWZmZXIpXG5cdFx0e1xuXHRcdFx0dmFyIHNvdW5kID0gbmV3IFNvdW5kKGJ1ZmZlcik7XG5cdFx0XHRTb3VuZE1hbmFnZXIubG9hZGVkW3VybF0gPSBzb3VuZDtcblx0XHRcdGlmKGNiICE9IHVuZGVmaW5lZClcblx0XHRcdFx0Y2IuY2FsbCh0aGlzLHNvdW5kKTtcblx0XHR9KTtcblx0fVxuXHRyZXF1ZXN0LnNlbmQoKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gU291bmRNYW5hZ2VyO1xuXG5cbiIsInZhciBTb3VuZENvbnRleHQgPSByZXF1aXJlKFwiLi9Tb3VuZENvbnRleHQuanNcIik7XG5cbnZhciBTb3VuZCA9IGZ1bmN0aW9uKGJ1ZmZlcilcbntcblx0dGhpcy5idWZmZXIgPSBidWZmZXI7XG59XG5cblNvdW5kLnByb3RvdHlwZS5wbGF5ID0gZnVuY3Rpb24oZGVsYXkpIHtcblx0dmFyIHNvdXJjZSA9IFNvdW5kQ29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTsgXG5cdHNvdXJjZS5idWZmZXIgPSB0aGlzLmJ1ZmZlcjsgICAgICAgICAgICAgICAgICAgIFxuXHRzb3VyY2UuY29ubmVjdChTb3VuZENvbnRleHQuZGVzdGluYXRpb24pO1xuXHRzb3VyY2Uuc3RhcnQoZGVsYXkpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTb3VuZDsiLCJ2YXIgc20gPSByZXF1aXJlKFwiLi9Tb3VuZE1hbmFnZXJcIik7XG52YXIgU291bmRDb250ZXh0ID0gcmVxdWlyZShcIi4vU291bmRDb250ZXh0XCIpO1xuXG52YXIgTWV0cm9ub21lID0gZnVuY3Rpb24oYmlwKVxue1xuXHR0aGlzLmJpcCA9IGJpcDtcblx0dGhpcy50aW1lcjtcblx0dGhpcy50ZW1wbyA9IDUwO1xuXHR0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcblxuXHQvL3RvIHRlc3Rcblx0dGhpcy5iZWF0VGltZXMgPSBbXTtcbn1cblxuTWV0cm9ub21lLnByb3RvdHlwZS5wbGF5ID0gZnVuY3Rpb24oKVxue1xuXHRpZih0aGlzLnJ1bm5pbmcpIHJldHVybjtcblx0dGhpcy5ydW5uaW5nID0gdHJ1ZTtcblx0KGZ1bmN0aW9uIHNjaGVkdWxlTm90ZXMoKVxuXHR7XG5cdFx0dmFyIHN0YXJ0VGltZSA9IFNvdW5kQ29udGV4dC5jdXJyZW50VGltZTtcblx0XHR2YXIgbm90ZVRpbWUgPSAoNjAgLyB0aGlzLnRlbXBvKTtcblx0XHR0aGlzLmJlYXRUaW1lcyA9IFtdO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCA0OyBpKyspIFxuXHRcdHtcblx0XHRcdHRoaXMuYmVhdFRpbWVzLnB1c2goc3RhcnRUaW1lKyBpICogbm90ZVRpbWUpO1xuXHRcdFx0dGhpcy5iaXAucGxheShzdGFydFRpbWUgKyBpICogbm90ZVRpbWUpO1xuXHRcdH1cblx0XHR0aGlzLnRpbWVyID0gd2luZG93LnNldFRpbWVvdXQoc2NoZWR1bGVOb3Rlcy5iaW5kKHRoaXMpLG5vdGVUaW1lICogMTAwMCAqIDQpOyBcblx0fS5iaW5kKHRoaXMpKSgpXG5cdFxufVxuXG5NZXRyb25vbWUucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbigpXG57XG5cdHRoaXMucnVubmluZyA9IGZhbHNlO1xuXHR3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpO1xufVxuXG5NZXRyb25vbWUucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uKClcbntcblx0aWYodGhpcy5ydW5uaW5nKSB0aGlzLnN0b3AoKTtcblx0ZWxzZSBpZighdGhpcy5ydW5uaW5nKSB0aGlzLnBsYXkoKTtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IE1ldHJvbm9tZTsiXX0=
;