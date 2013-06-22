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

