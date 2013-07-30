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
