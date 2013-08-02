var Game = require("./Game");
var Sprite = require("./display/Sprite");

RhythmFighters.prototype = Game.prototype;
RhythmFighters.prototype.constructor = RhythmFighters;

function RhythmFighters()
{
	console.log(this);
	Game.call(this,640,480,"#000000");
	var leftBar = new Sprite(100,300,10,100,"#00FFFF");

	var rightBar = new Sprite(500,300,10,100,"#FF00FF");

	this.add(leftBar);
	this.add(rightBar);

}

module.exports = RhythmFighters;