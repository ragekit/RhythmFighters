;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
var SoundManager = require("./SoundManager.js");
var Metronome = require("./Metronome");
var Sound = require("./Sound");
console.log("ONO");
SoundManager.loadSound("bip.wav",function(sound){
	
	var m = new Metronome(sound);
	//m.play();

})



},{"./SoundManager.js":2,"./Metronome":3,"./Sound":4}],2:[function(require,module,exports){
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



},{"./Sound":4,"./SoundContext":5}],4:[function(require,module,exports){
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
},{"./SoundContext.js":5}],3:[function(require,module,exports){
var sm = require("./SoundManager");
var SoundContext = require("./SoundContext");

var Metronome = function(bip)
{
	this.bip = bip;
	this.timer;
	this.tempo = 120;
}

Metronome.prototype.play = function()
{
	(function scheduleNotes()
	{
		var startTime = SoundContext.currentTime + 0.100;
	  	
		var noteTime = (60 / this.tempo);

			 
		for (var i = 0; i < 4; i++) 
		{
			this.bip.play(startTime + i * noteTime);
		}
		this.timer = window.setTimeout(scheduleNotes.bind(this),noteTime * 1000 * 4); 
	}.bind(this))()
	console.log("qsd");
	
}

Metronome.prototype.stop = function()
{
	window.clearTimeout(this.timer);
}




module.exports = Metronome;
},{"./SoundManager":2,"./SoundContext":5}],5:[function(require,module,exports){
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
},{}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYmVuamFtaW5nYXR0ZXQvVHJhdmF1eC9SaHl0aG1GaWdodGVycy9zY3JpcHRzL21haW4uanMiLCIvVXNlcnMvYmVuamFtaW5nYXR0ZXQvVHJhdmF1eC9SaHl0aG1GaWdodGVycy9zY3JpcHRzL1NvdW5kTWFuYWdlci5qcyIsIi9Vc2Vycy9iZW5qYW1pbmdhdHRldC9UcmF2YXV4L1JoeXRobUZpZ2h0ZXJzL3NjcmlwdHMvU291bmQuanMiLCIvVXNlcnMvYmVuamFtaW5nYXR0ZXQvVHJhdmF1eC9SaHl0aG1GaWdodGVycy9zY3JpcHRzL01ldHJvbm9tZS5qcyIsIi9Vc2Vycy9iZW5qYW1pbmdhdHRldC9UcmF2YXV4L1JoeXRobUZpZ2h0ZXJzL3NjcmlwdHMvU291bmRDb250ZXh0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgU291bmRNYW5hZ2VyID0gcmVxdWlyZShcIi4vU291bmRNYW5hZ2VyLmpzXCIpO1xudmFyIE1ldHJvbm9tZSA9IHJlcXVpcmUoXCIuL01ldHJvbm9tZVwiKTtcbnZhciBTb3VuZCA9IHJlcXVpcmUoXCIuL1NvdW5kXCIpO1xuY29uc29sZS5sb2coXCJPTk9cIik7XG5Tb3VuZE1hbmFnZXIubG9hZFNvdW5kKFwiYmlwLndhdlwiLGZ1bmN0aW9uKHNvdW5kKXtcblx0XG5cdHZhciBtID0gbmV3IE1ldHJvbm9tZShzb3VuZCk7XG5cdC8vbS5wbGF5KCk7XG5cbn0pXG5cblxuIiwidmFyIFNvdW5kID0gcmVxdWlyZShcIi4vU291bmRcIik7XG52YXIgU291bmRDb250ZXh0ID0gcmVxdWlyZShcIi4vU291bmRDb250ZXh0XCIpO1xuXG52YXIgU291bmRNYW5hZ2VyID1mdW5jdGlvbigpe307XG5Tb3VuZE1hbmFnZXIubG9hZGVkID0gW107XG5cblxuXG5Tb3VuZE1hbmFnZXIuYmF0Y2hMb2FkID0gZnVuY3Rpb24oaW5wdXRBcnJheSxjYilcbntcblxuXG59XG5cblNvdW5kTWFuYWdlci5sb2FkU291bmQgPSBmdW5jdGlvbih1cmwsY2IpXG57XG5cdHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdHJlcXVlc3Qub3BlbignR0VUJywgdXJsLCB0cnVlKTtcblx0cmVxdWVzdC5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInO1xuXG5cdC8vIERlY29kZSBhc3luY2hyb25vdXNseVxuXHRyZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKClcblx0e1xuXHRcdFNvdW5kQ29udGV4dC5kZWNvZGVBdWRpb0RhdGEocmVxdWVzdC5yZXNwb25zZSwgZnVuY3Rpb24oYnVmZmVyKVxuXHRcdHtcblx0XHRcdHZhciBzb3VuZCA9IG5ldyBTb3VuZChidWZmZXIpO1xuXHRcdFx0U291bmRNYW5hZ2VyLmxvYWRlZFt1cmxdID0gc291bmQ7XG5cdFx0XHRpZihjYiAhPSB1bmRlZmluZWQpXG5cdFx0XHRcdGNiLmNhbGwodGhpcyxzb3VuZCk7XG5cdFx0fSk7XG5cdH1cblx0cmVxdWVzdC5zZW5kKCk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IFNvdW5kTWFuYWdlcjtcblxuXG4iLCJ2YXIgU291bmRDb250ZXh0ID0gcmVxdWlyZShcIi4vU291bmRDb250ZXh0LmpzXCIpO1xuXG52YXIgU291bmQgPSBmdW5jdGlvbihidWZmZXIpXG57XG5cdHRoaXMuYnVmZmVyID0gYnVmZmVyO1xufVxuXG5Tb3VuZC5wcm90b3R5cGUucGxheSA9IGZ1bmN0aW9uKGRlbGF5KSB7XG5cdHZhciBzb3VyY2UgPSBTb3VuZENvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7IFxuXHRzb3VyY2UuYnVmZmVyID0gdGhpcy5idWZmZXI7ICAgICAgICAgICAgICAgICAgICBcblx0c291cmNlLmNvbm5lY3QoU291bmRDb250ZXh0LmRlc3RpbmF0aW9uKTtcblx0c291cmNlLnN0YXJ0KGRlbGF5KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU291bmQ7IiwidmFyIHNtID0gcmVxdWlyZShcIi4vU291bmRNYW5hZ2VyXCIpO1xudmFyIFNvdW5kQ29udGV4dCA9IHJlcXVpcmUoXCIuL1NvdW5kQ29udGV4dFwiKTtcblxudmFyIE1ldHJvbm9tZSA9IGZ1bmN0aW9uKGJpcClcbntcblx0dGhpcy5iaXAgPSBiaXA7XG5cdHRoaXMudGltZXI7XG5cdHRoaXMudGVtcG8gPSAxMjA7XG59XG5cbk1ldHJvbm9tZS5wcm90b3R5cGUucGxheSA9IGZ1bmN0aW9uKClcbntcblx0KGZ1bmN0aW9uIHNjaGVkdWxlTm90ZXMoKVxuXHR7XG5cdFx0dmFyIHN0YXJ0VGltZSA9IFNvdW5kQ29udGV4dC5jdXJyZW50VGltZSArIDAuMTAwO1xuXHQgIFx0XG5cdFx0dmFyIG5vdGVUaW1lID0gKDYwIC8gdGhpcy50ZW1wbyk7XG5cblx0XHRcdCBcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IDQ7IGkrKykgXG5cdFx0e1xuXHRcdFx0dGhpcy5iaXAucGxheShzdGFydFRpbWUgKyBpICogbm90ZVRpbWUpO1xuXHRcdH1cblx0XHR0aGlzLnRpbWVyID0gd2luZG93LnNldFRpbWVvdXQoc2NoZWR1bGVOb3Rlcy5iaW5kKHRoaXMpLG5vdGVUaW1lICogMTAwMCAqIDQpOyBcblx0fS5iaW5kKHRoaXMpKSgpXG5cdGNvbnNvbGUubG9nKFwicXNkXCIpO1xuXHRcbn1cblxuTWV0cm9ub21lLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24oKVxue1xuXHR3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpO1xufVxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IE1ldHJvbm9tZTsiLCIvL1NpbmdsZXRvbiB0byBlbnN1cmUgdGhlcmUncyBvbmx5IG9uZSBzb3VuZCBDb250ZXh0XG5cbnZhciBTb3VuZENvbnRleHQ7XG50cnlcbntcblx0d2luZG93LkF1ZGlvQ29udGV4dCA9IHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dDtcblx0U291bmRDb250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xufVxuY2F0Y2ggKGUpXG57XG5cdGFsZXJ0KCdXZWIgQXVkaW8gQVBJIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU291bmRDb250ZXh0OyJdfQ==
;