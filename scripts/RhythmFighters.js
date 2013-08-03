var Game = require("./Game");
var Sprite = require("./display/Sprite");

RhythmFighters.prototype = Object.create(Game.prototype);
RhythmFighters.prototype.constructor = RhythmFighters;

function RhythmFighters()
{
	Game.call(this,640,480,"#000000");
	var leftBar = new Sprite(0,0,10,100,"#00FFFF");
	var partition = new Sprite(100,300,400,100,"#FFFFFF");

	var rightBar = new Sprite(partition.width -10,0,10,100,"#FF00FF");

	this.add(partition);

	partition.add(leftBar);
	partition.add(rightBar);
	//partition.add(rightBar);

	this.notes = [];

}



RhythmFighters.prototype.loop = function(time)
{
	Game.prototype.loop.call(this,time);
}

RhythmFighters.prototype.onKeyDown = function(e)
{
	if(e.keyCode == 65)
	{
		this.sendNote();
	}
}

RhythmFighters.prototype.sendNote = function()
{
	console.log("note");

	var note = new Sprite(0, 0, 20, 20, "#FF0000");

	this.notes.push(note);
	this.partition.add(note);

}

module.exports = RhythmFighters;