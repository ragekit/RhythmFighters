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