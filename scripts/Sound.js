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