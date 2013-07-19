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
