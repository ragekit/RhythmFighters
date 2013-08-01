
function Sprite(x,y,w,h,color)
{
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
	this.color = color;

	this.ctx;
}

Sprite.prototype.update = function()
{

}

Sprite.prototype.render = function()
{
	this.ctx.fillStyle = this.color;
	this.ctx.fillRect(this.x,this.y,this.width,this.height);
}

module.exports = Sprite;