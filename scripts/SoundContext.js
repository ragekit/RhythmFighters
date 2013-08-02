//soundcontext wrapper.

var SoundContext;
try
{
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	SoundContext = window.AudioContext;
}
catch (e)
{
	alert('Web Audio API is not supported in this browser');
}

module.exports = SoundContext;