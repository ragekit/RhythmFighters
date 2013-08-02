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
