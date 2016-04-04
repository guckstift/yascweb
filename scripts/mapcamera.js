
function MapCamera (yasc)
{
	Camera.call (this, yasc);
	
	this.zoom = 16;
	this.x = 0;
	this.y = 0;
}

MapCamera.prototype = Object.create (Camera.prototype, {constructor: Camera});

MapCamera.prototype.update = function ()
{
	Camera.prototype.update.call (this);
	
	mat4.scale (this.proj, this.proj, vec3.fromValues (1, -1, 1));
	mat4.scale (this.proj, this.proj, vec3.fromValues (
		this.zoom * 2 / this.game.size [0],
		this.zoom * 2 / this.game.size [1],
	0));
	
	mat4.translate (this.view, this.view, vec3.fromValues (
		-this.x,
		-this.y,
	0));
	mat4.rotateX (this.view, this.view, Math.acos (1 / Math.sqrt (3)));
}

MapCamera.prototype.setZoom = function (zoom)
{
	this.zoom = Math.min (512, Math.max (16, zoom));
}

