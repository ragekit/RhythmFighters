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