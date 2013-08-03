//just run the polyfill :
require("./RequestAnimFrame");

function Game(width,height,backgroundColor)
{
	this.width = width;
	this.height = height;

	this.backgroundColor = backgroundColor;

	this.canvas = document.createElement("canvas");

	this.canvas.width = this.width;
	this.canvas.height = this.height;

	this.canvas.style = "margin : 0 auto";

	document.body.appendChild(this.canvas);
	this.ctx = this.canvas.getContext("2d");
	this.sprites =[];
	
	window.onkeydown = this.onKeyDown.bind(this);
}

Game.prototype.onKeyDown = function(event)
{

}

Game.prototype.add = function(sprite)
{
	this.sprites.push(sprite);
	sprite.ctx = this.ctx;
}

Game.prototype.loop = function()
{
	//shitload weird, apparently can't put this.loop directly as argument
	window.requestAnimationFrame(function(time){this.loop(time)}.bind(this));


	this.canvas.width = this.canvas.width;
	this.ctx.fillStyle = this.backgroundColor;
	this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
	for (var i=0;i<this.sprites.length;i++)
	{
		this.sprites[i].update();
		this.sprites[i].render();
	}
}

module.exports = Game;