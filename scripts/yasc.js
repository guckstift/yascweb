
var $window;

function Yasc ()
{
	$window = $(window);
	
	Game.call (this, {
		canvasId: "viewport",
		bgColor: [0, 0.5, 0.5, 1],
	});

	this.moving = false;
	this.twoTouchDist= 0;
}

Yasc.prototype = Object.create (Game.prototype, {constructor: Game});

Yasc.prototype.onPreload = function ()
{
	this.load ("images/grassland.png");
	this.load ("images/meadow.png");
	this.load ("images/beach.png");
	
	this.load ("shaders/map.vert");
	this.load ("shaders/map.frag");
	
	this.load ("meshes/tree.json");
}

Yasc.prototype.onCreate = function ()
{
	this.mapProg = this.create.program (["shaders/map.vert", "shaders/map.frag"]);
	this.mapCam = new MapCamera (this);
	this.map = new Map (this, 180);
	//this.map = new Map (this, 64);
	this.mapCam.x = this.map.size / 2;
	this.mapCam.y = this.map.size / 2;
	this.sun = vec3.fromValues (0, 0, -1);
	
	var sunTransform = mat4.create ();
	mat4.rotateZ (sunTransform, sunTransform, radians (30));
	mat4.rotateX (sunTransform, sunTransform, radians (-45));
	vec3.transformMat4 (this.sun, this.sun, sunTransform);
}

Yasc.prototype.onUpdate = function ()
{
}

Yasc.prototype.onRender = function ()
{
	this.setProgram (this.mapProg);
	this.setCamera (this.mapCam);
	this.map.draw ();
}

Yasc.prototype.onMouseDown = function ()
{
	this.lockPointer ();
	this.moving = true;
}

Yasc.prototype.onMouseUp = function ()
{
	this.releasePointer ();
	this.moving = false;
}

Yasc.prototype.onMouseMove = function ()
{
	if (this.moving) {
		this.moveCamera (this.mouseRelX, this.mouseRelY);
	}
}

Yasc.prototype.onMouseWheelUp = function ()
{
	this.zoomInCamera ();
}

Yasc.prototype.onMouseWheelDown = function ()
{
	this.zoomOutCamera ();
}

Yasc.prototype.onTouchMove = function (e)
{
	if (e.touches.length == 1) {
		this.moveCamera (this.touchRelX, this.touchRelY);
	}
	else if (e.touches.length == 2) {
		var newTwoTouchDist = Math.sqrt (
			Math.pow (e.touches[1].clientX - e.touches[0].clientX, 2) +
			Math.pow (e.touches[1].clientY - e.touches[0].clientY, 2)
		);
		this.zoomCamera (newTwoTouchDist - this.twoTouchDist);
		this.twoTouchDist = newTwoTouchDist;
	}
}

Yasc.prototype.onTouchStart = function (e)
{
	if (e.touches.length == 2) {
		this.twoTouchDist = Math.sqrt (
			Math.pow (e.touches[1].clientX - e.touches[0].clientX, 2) +
			Math.pow (e.touches[1].clientY - e.touches[0].clientY, 2)
		);
	}
}

Yasc.prototype.moveCamera = function (relX, relY)
{
	this.camera.x += relX / this.camera.zoom;
	this.camera.y += relY / this.camera.zoom;
}

Yasc.prototype.zoomInCamera = function ()
{
	this.camera.setZoom (this.camera.zoom * 1.25);
}

Yasc.prototype.zoomOutCamera = function ()
{
	this.camera.setZoom (this.camera.zoom / 1.25);
}

Yasc.prototype.zoomCamera = function (dist)
{
	this.camera.setZoom (this.camera.zoom + dist);
}

