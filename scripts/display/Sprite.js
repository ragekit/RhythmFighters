
function Sprite(x,y,w,h,color)
{
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
	this.color = color;
	this.children = [];
	this.parent = null;

	this.ctx;
}

Sprite.prototype.add = function(spr)
{
	spr.ctx = this.ctx;
	this.children.push(spr);
	spr.parent = this;
}

Sprite.prototype.update = function()
{

}

Sprite.prototype.render = function()
{
	//save current matrix
	var pos = {x:this.x,y:this.y};
	
	this.ctx.fillStyle = this.color;

	this.x = this.parent != null ? this.parent.x + this.x : this.x; 
	this.y = this.parent != null ? this.parent.y + this.y : this.y; 

	this.ctx.fillRect(this.x,this.y,this.width,this.height);

	this.renderChildren();

	//restore relative pos;
	this.x = pos.x;
	this.y = pos.y;
}

Sprite.prototype.renderChildren = function()
{

	for(var i =0;i<this.children.length;i++)
	{
		this.children[i].render();
	}	
}

module.exports = Sprite;