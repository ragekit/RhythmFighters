;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
var SoundManager = require("./SoundManager.js");
var Metronome = require("./Metronome");
var Sound = require("./Sound");
console.log("ONO");
SoundManager.loadSound("bip.wav",function(buffer){
	var s = new Sound(buffer);
	var m = new Metronome(s);
	m.play();

})



},{"./SoundManager.js":2,"./Metronome":3,"./Sound":4}],2:[function(require,module,exports){
var SoundManager =function(){};
SoundManager.loaded = [];
SoundManager.init = function(cb)
{	
	try
	{
		// Fix up for prefixing
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		SoundManager.context = new AudioContext();
	}
	catch (e)
	{
		alert('Web Audio API is not supported in this browser');
	}
	cb();
}

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
			if(cb != undefined)
				cb.call(this,buffer);
		});
	}
	request.send();
}
SoundManager.init(function(){
	module.exports = SoundManager;
})


},{}],4:[function(require,module,exports){
var SoundManager = require("./SoundManager.js");

var Sound = function(buffer)
{
	this.buffer = buffer;
}

Sound.prototype.play = function(delay) {
	var source = SoundManager.context.createBufferSource(); 
	source.buffer = this.buffer;                    
	source.connect(SoundManager.context.destination);
	source.start(delay);
};

module.exports = Sound;
},{"./SoundManager.js":2}],3:[function(require,module,exports){
var sm = require("./SoundManager");

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
		var startTime = sm.context.currentTime + 0.100;
	  	
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
},{"./SoundManager":2}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYmVuamFtaW5nYXR0ZXQvVHJhdmF1eC9SaHl0aG1GaWdodGVycy9zY3JpcHRzL21haW4uanMiLCIvVXNlcnMvYmVuamFtaW5nYXR0ZXQvVHJhdmF1eC9SaHl0aG1GaWdodGVycy9zY3JpcHRzL1NvdW5kTWFuYWdlci5qcyIsIi9Vc2Vycy9iZW5qYW1pbmdhdHRldC9UcmF2YXV4L1JoeXRobUZpZ2h0ZXJzL3NjcmlwdHMvU291bmQuanMiLCIvVXNlcnMvYmVuamFtaW5nYXR0ZXQvVHJhdmF1eC9SaHl0aG1GaWdodGVycy9zY3JpcHRzL01ldHJvbm9tZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFNvdW5kTWFuYWdlciA9IHJlcXVpcmUoXCIuL1NvdW5kTWFuYWdlci5qc1wiKTtcbnZhciBNZXRyb25vbWUgPSByZXF1aXJlKFwiLi9NZXRyb25vbWVcIik7XG52YXIgU291bmQgPSByZXF1aXJlKFwiLi9Tb3VuZFwiKTtcbmNvbnNvbGUubG9nKFwiT05PXCIpO1xuU291bmRNYW5hZ2VyLmxvYWRTb3VuZChcImJpcC53YXZcIixmdW5jdGlvbihidWZmZXIpe1xuXHR2YXIgcyA9IG5ldyBTb3VuZChidWZmZXIpO1xuXHR2YXIgbSA9IG5ldyBNZXRyb25vbWUocyk7XG5cdG0ucGxheSgpO1xuXG59KVxuXG5cbiIsInZhciBTb3VuZE1hbmFnZXIgPWZ1bmN0aW9uKCl7fTtcblNvdW5kTWFuYWdlci5sb2FkZWQgPSBbXTtcblNvdW5kTWFuYWdlci5pbml0ID0gZnVuY3Rpb24oY2IpXG57XHRcblx0dHJ5XG5cdHtcblx0XHQvLyBGaXggdXAgZm9yIHByZWZpeGluZ1xuXHRcdHdpbmRvdy5BdWRpb0NvbnRleHQgPSB3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQ7XG5cdFx0U291bmRNYW5hZ2VyLmNvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KCk7XG5cdH1cblx0Y2F0Y2ggKGUpXG5cdHtcblx0XHRhbGVydCgnV2ViIEF1ZGlvIEFQSSBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlcicpO1xuXHR9XG5cdGNiKCk7XG59XG5cblNvdW5kTWFuYWdlci5iYXRjaExvYWQgPSBmdW5jdGlvbihpbnB1dEFycmF5LGNiKVxue1xuXG59XG5cblNvdW5kTWFuYWdlci5sb2FkU291bmQgPSBmdW5jdGlvbih1cmwsY2IpXG57XG5cdHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdHJlcXVlc3Qub3BlbignR0VUJywgdXJsLCB0cnVlKTtcblx0cmVxdWVzdC5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInO1xuXG5cdC8vIERlY29kZSBhc3luY2hyb25vdXNseVxuXHRyZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKClcblx0e1xuXHRcdFNvdW5kTWFuYWdlci5jb250ZXh0LmRlY29kZUF1ZGlvRGF0YShyZXF1ZXN0LnJlc3BvbnNlLCBmdW5jdGlvbihidWZmZXIpXG5cdFx0e1xuXHRcdFx0aWYoY2IgIT0gdW5kZWZpbmVkKVxuXHRcdFx0XHRjYi5jYWxsKHRoaXMsYnVmZmVyKTtcblx0XHR9KTtcblx0fVxuXHRyZXF1ZXN0LnNlbmQoKTtcbn1cblNvdW5kTWFuYWdlci5pbml0KGZ1bmN0aW9uKCl7XG5cdG1vZHVsZS5leHBvcnRzID0gU291bmRNYW5hZ2VyO1xufSlcblxuIiwidmFyIFNvdW5kTWFuYWdlciA9IHJlcXVpcmUoXCIuL1NvdW5kTWFuYWdlci5qc1wiKTtcblxudmFyIFNvdW5kID0gZnVuY3Rpb24oYnVmZmVyKVxue1xuXHR0aGlzLmJ1ZmZlciA9IGJ1ZmZlcjtcbn1cblxuU291bmQucHJvdG90eXBlLnBsYXkgPSBmdW5jdGlvbihkZWxheSkge1xuXHR2YXIgc291cmNlID0gU291bmRNYW5hZ2VyLmNvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7IFxuXHRzb3VyY2UuYnVmZmVyID0gdGhpcy5idWZmZXI7ICAgICAgICAgICAgICAgICAgICBcblx0c291cmNlLmNvbm5lY3QoU291bmRNYW5hZ2VyLmNvbnRleHQuZGVzdGluYXRpb24pO1xuXHRzb3VyY2Uuc3RhcnQoZGVsYXkpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTb3VuZDsiLCJ2YXIgc20gPSByZXF1aXJlKFwiLi9Tb3VuZE1hbmFnZXJcIik7XG5cbnZhciBNZXRyb25vbWUgPSBmdW5jdGlvbihiaXApXG57XG5cdHRoaXMuYmlwID0gYmlwO1xuXHR0aGlzLnRpbWVyO1xuXHR0aGlzLnRlbXBvID0gMTIwO1xufVxuXG5NZXRyb25vbWUucHJvdG90eXBlLnBsYXkgPSBmdW5jdGlvbigpXG57XG5cdChmdW5jdGlvbiBzY2hlZHVsZU5vdGVzKClcblx0e1xuXHRcdHZhciBzdGFydFRpbWUgPSBzbS5jb250ZXh0LmN1cnJlbnRUaW1lICsgMC4xMDA7XG5cdCAgXHRcblx0XHR2YXIgbm90ZVRpbWUgPSAoNjAgLyB0aGlzLnRlbXBvKTtcblxuXHRcdFx0IFxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgNDsgaSsrKSBcblx0XHR7XG5cdFx0XHR0aGlzLmJpcC5wbGF5KHN0YXJ0VGltZSArIGkgKiBub3RlVGltZSk7XG5cdFx0fVxuXHRcdHRoaXMudGltZXIgPSB3aW5kb3cuc2V0VGltZW91dChzY2hlZHVsZU5vdGVzLmJpbmQodGhpcyksbm90ZVRpbWUgKiAxMDAwICogNCk7IFxuXHR9LmJpbmQodGhpcykpKClcblx0Y29uc29sZS5sb2coXCJxc2RcIik7XG5cdFxufVxuXG5NZXRyb25vbWUucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbigpXG57XG5cdHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy50aW1lcik7XG59XG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gTWV0cm9ub21lOyJdfQ==
;