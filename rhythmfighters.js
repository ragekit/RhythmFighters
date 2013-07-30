;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
var SoundManager = require("./SoundManager.js");
var Synth = require("./Synth");

//just run the polyfill :
require("./RequestAnimFrame");

console.log("ONO");


var s = new Synth();

window.onkeydown = function(e) {

	if (e.keyCode == 65) {
		s.playScale(440, Synth.scale.major);
		console.log("kdown");
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


function Synth(){

}

Synth.scale = {
	major : [1,1,1/2,1,1,1,1/2]
}

Synth.prototype.playScale = function(tonal,scale)
{
	for(var i=1;i<=scale.length+1;i++)
	{
		this.playDegree(i, 440, Synth.scale.major,i*1000/1000);
	}

}


//degree 1 = tonal
Synth.prototype.playDegree = function(numb,tonal,scale,delay)
{
	var freqMultiplier = 1;

	for(var i = 0;i<numb-1;i++)
	{
		freqMultiplier += scale[i]/6;
	}
	console.log(freqMultiplier);
	this.play(tonal * freqMultiplier,delay);
}

Synth.prototype.play = function(freq,delay)
{	
	var s = SoundManager.context.createOscillator();
	delay = SoundManager.context.currentTime + delay;
	s.connect( SoundManager.context.destination );
	s.frequency.value = freq;
	s.start(delay);
	s.stop(delay+500/1000);
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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYmVuamFtaW5nYXR0ZXQvVHJhdmF1eC9SaHl0aG1GaWdodGVycy9zY3JpcHRzL21haW4uanMiLCIvVXNlcnMvYmVuamFtaW5nYXR0ZXQvVHJhdmF1eC9SaHl0aG1GaWdodGVycy9zY3JpcHRzL1JlcXVlc3RBbmltRnJhbWUuanMiLCIvVXNlcnMvYmVuamFtaW5nYXR0ZXQvVHJhdmF1eC9SaHl0aG1GaWdodGVycy9zY3JpcHRzL1NvdW5kTWFuYWdlci5qcyIsIi9Vc2Vycy9iZW5qYW1pbmdhdHRldC9UcmF2YXV4L1JoeXRobUZpZ2h0ZXJzL3NjcmlwdHMvU3ludGguanMiLCIvVXNlcnMvYmVuamFtaW5nYXR0ZXQvVHJhdmF1eC9SaHl0aG1GaWdodGVycy9zY3JpcHRzL1NvdW5kQ29udGV4dC5qcyIsIi9Vc2Vycy9iZW5qYW1pbmdhdHRldC9UcmF2YXV4L1JoeXRobUZpZ2h0ZXJzL3NjcmlwdHMvU291bmQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgU291bmRNYW5hZ2VyID0gcmVxdWlyZShcIi4vU291bmRNYW5hZ2VyLmpzXCIpO1xudmFyIFN5bnRoID0gcmVxdWlyZShcIi4vU3ludGhcIik7XG5cbi8vanVzdCBydW4gdGhlIHBvbHlmaWxsIDpcbnJlcXVpcmUoXCIuL1JlcXVlc3RBbmltRnJhbWVcIik7XG5cbmNvbnNvbGUubG9nKFwiT05PXCIpO1xuXG5cbnZhciBzID0gbmV3IFN5bnRoKCk7XG5cbndpbmRvdy5vbmtleWRvd24gPSBmdW5jdGlvbihlKSB7XG5cblx0aWYgKGUua2V5Q29kZSA9PSA2NSkge1xuXHRcdHMucGxheVNjYWxlKDQ0MCwgU3ludGguc2NhbGUubWFqb3IpO1xuXHRcdGNvbnNvbGUubG9nKFwia2Rvd25cIik7XG5cdH1cblxufVxuXG52YXIgdXBkYXRlID0gZnVuY3Rpb24odGltZSkge1xuXG59O1xuXG4oZnVuY3Rpb24gYW5pbUxvb3AodGltZSkge1xuXHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1Mb29wKTtcblx0dXBkYXRlKHRpbWUpO1xufSkoKSIsIi8vIGh0dHA6Ly9wYXVsaXJpc2guY29tLzIwMTEvcmVxdWVzdGFuaW1hdGlvbmZyYW1lLWZvci1zbWFydC1hbmltYXRpbmcvXG4vLyBodHRwOi8vbXkub3BlcmEuY29tL2Vtb2xsZXIvYmxvZy8yMDExLzEyLzIwL3JlcXVlc3RhbmltYXRpb25mcmFtZS1mb3Itc21hcnQtZXItYW5pbWF0aW5nXG4gXG4vLyByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgcG9seWZpbGwgYnkgRXJpayBNw7ZsbGVyLiBmaXhlcyBmcm9tIFBhdWwgSXJpc2ggYW5kIFRpbm8gWmlqZGVsXG4gXG4vLyBNSVQgbGljZW5zZVxuIFxuKGZ1bmN0aW9uKCkge1xuICAgIHZhciBsYXN0VGltZSA9IDA7XG4gICAgdmFyIHZlbmRvcnMgPSBbJ21zJywgJ21veicsICd3ZWJraXQnLCAnbyddO1xuICAgIGZvcih2YXIgeCA9IDA7IHggPCB2ZW5kb3JzLmxlbmd0aCAmJiAhd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTsgKyt4KSB7XG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1t4XSsnUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ107XG4gICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdKydDYW5jZWxBbmltYXRpb25GcmFtZSddIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCB3aW5kb3dbdmVuZG9yc1t4XSsnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ107XG4gICAgfVxuIFxuICAgIGlmICghd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSlcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKGNhbGxiYWNrLCBlbGVtZW50KSB7XG4gICAgICAgICAgICB2YXIgY3VyclRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgIHZhciB0aW1lVG9DYWxsID0gTWF0aC5tYXgoMCwgMTYgLSAoY3VyclRpbWUgLSBsYXN0VGltZSkpO1xuICAgICAgICAgICAgdmFyIGlkID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IGNhbGxiYWNrKGN1cnJUaW1lICsgdGltZVRvQ2FsbCk7IH0sIFxuICAgICAgICAgICAgICB0aW1lVG9DYWxsKTtcbiAgICAgICAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsO1xuICAgICAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgICB9O1xuIFxuICAgIGlmICghd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKVxuICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGlkKTtcbiAgICAgICAgfTtcbn0oKSk7IiwidmFyIFNvdW5kID0gcmVxdWlyZShcIi4vU291bmRcIik7XG52YXIgU291bmRDb250ZXh0ID0gcmVxdWlyZShcIi4vU291bmRDb250ZXh0XCIpO1xuXG52YXIgU291bmRNYW5hZ2VyID1mdW5jdGlvbigpe307XG5Tb3VuZE1hbmFnZXIubG9hZGVkID0gW107XG5Tb3VuZE1hbmFnZXIuY29udGV4dCA9IFNvdW5kQ29udGV4dDtcblxuU291bmRNYW5hZ2VyLmJhdGNoTG9hZCA9IGZ1bmN0aW9uKGlucHV0QXJyYXksY2IpXG57XG5cblxufVxuXG5Tb3VuZE1hbmFnZXIubG9hZFNvdW5kID0gZnVuY3Rpb24odXJsLGNiKVxue1xuXHR2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXHRyZXF1ZXN0Lm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG5cdHJlcXVlc3QucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJztcblxuXHQvLyBEZWNvZGUgYXN5bmNocm9ub3VzbHlcblx0cmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbigpXG5cdHtcblx0XHRTb3VuZE1hbmFnZXIuY29udGV4dC5kZWNvZGVBdWRpb0RhdGEocmVxdWVzdC5yZXNwb25zZSwgZnVuY3Rpb24oYnVmZmVyKVxuXHRcdHtcblx0XHRcdHZhciBzb3VuZCA9IG5ldyBTb3VuZChidWZmZXIpO1xuXHRcdFx0U291bmRNYW5hZ2VyLmxvYWRlZFt1cmxdID0gc291bmQ7XG5cdFx0XHRpZihjYiAhPSB1bmRlZmluZWQpXG5cdFx0XHRcdGNiLmNhbGwodGhpcyxzb3VuZCk7XG5cdFx0fSk7XG5cdH1cblx0cmVxdWVzdC5zZW5kKCk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IFNvdW5kTWFuYWdlcjtcblxuXG4iLCJ2YXIgU291bmRNYW5hZ2VyID0gcmVxdWlyZShcIi4vU291bmRNYW5hZ2VyXCIpXG5cbi8vZ2FwIGJldHdlZW4gbm90ZXMgaW4gbWFqb3Igc2Vjb25kICh0b24pXG5cbnZhciBvY3RhdmUgPSA2O1xuXG5cbmZ1bmN0aW9uIFN5bnRoKCl7XG5cbn1cblxuU3ludGguc2NhbGUgPSB7XG5cdG1ham9yIDogWzEsMSwxLzIsMSwxLDEsMS8yXVxufVxuXG5TeW50aC5wcm90b3R5cGUucGxheVNjYWxlID0gZnVuY3Rpb24odG9uYWwsc2NhbGUpXG57XG5cdGZvcih2YXIgaT0xO2k8PXNjYWxlLmxlbmd0aCsxO2krKylcblx0e1xuXHRcdHRoaXMucGxheURlZ3JlZShpLCA0NDAsIFN5bnRoLnNjYWxlLm1ham9yLGkqMTAwMC8xMDAwKTtcblx0fVxuXG59XG5cblxuLy9kZWdyZWUgMSA9IHRvbmFsXG5TeW50aC5wcm90b3R5cGUucGxheURlZ3JlZSA9IGZ1bmN0aW9uKG51bWIsdG9uYWwsc2NhbGUsZGVsYXkpXG57XG5cdHZhciBmcmVxTXVsdGlwbGllciA9IDE7XG5cblx0Zm9yKHZhciBpID0gMDtpPG51bWItMTtpKyspXG5cdHtcblx0XHRmcmVxTXVsdGlwbGllciArPSBzY2FsZVtpXS82O1xuXHR9XG5cdGNvbnNvbGUubG9nKGZyZXFNdWx0aXBsaWVyKTtcblx0dGhpcy5wbGF5KHRvbmFsICogZnJlcU11bHRpcGxpZXIsZGVsYXkpO1xufVxuXG5TeW50aC5wcm90b3R5cGUucGxheSA9IGZ1bmN0aW9uKGZyZXEsZGVsYXkpXG57XHRcblx0dmFyIHMgPSBTb3VuZE1hbmFnZXIuY29udGV4dC5jcmVhdGVPc2NpbGxhdG9yKCk7XG5cdGRlbGF5ID0gU291bmRNYW5hZ2VyLmNvbnRleHQuY3VycmVudFRpbWUgKyBkZWxheTtcblx0cy5jb25uZWN0KCBTb3VuZE1hbmFnZXIuY29udGV4dC5kZXN0aW5hdGlvbiApO1xuXHRzLmZyZXF1ZW5jeS52YWx1ZSA9IGZyZXE7XG5cdHMuc3RhcnQoZGVsYXkpO1xuXHRzLnN0b3AoZGVsYXkrNTAwLzEwMDApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFN5bnRoO1xuIiwiLy9zb3VuZGNvbnRleHQgd3JhcHBlci5cblxudmFyIFNvdW5kQ29udGV4dDtcbnRyeVxue1xuXHR3aW5kb3cuQXVkaW9Db250ZXh0ID0gd2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0O1xuXHRTb3VuZENvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KCk7XG59XG5jYXRjaCAoZSlcbntcblx0YWxlcnQoJ1dlYiBBdWRpbyBBUEkgaXMgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXInKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTb3VuZENvbnRleHQ7IiwidmFyIFNvdW5kQ29udGV4dCA9IHJlcXVpcmUoXCIuL1NvdW5kQ29udGV4dC5qc1wiKTtcblxuLy9XcmFwcGVyIGFyb3VuZCBhIHNvdW5kQnVmZmVyXG5cbnZhciBTb3VuZCA9IGZ1bmN0aW9uKGJ1ZmZlcilcbntcblx0dGhpcy5idWZmZXIgPSBidWZmZXI7XG59XG5cblNvdW5kLnByb3RvdHlwZS5wbGF5ID0gZnVuY3Rpb24oZGVsYXkpIHtcblx0dmFyIHNvdXJjZSA9IFNvdW5kQ29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTsgXG5cdHNvdXJjZS5idWZmZXIgPSB0aGlzLmJ1ZmZlcjsgICAgICAgICAgICAgICAgICAgIFxuXHRzb3VyY2UuY29ubmVjdChTb3VuZENvbnRleHQuZGVzdGluYXRpb24pO1xuXHRzb3VyY2Uuc3RhcnQoZGVsYXkpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTb3VuZDsiXX0=
;