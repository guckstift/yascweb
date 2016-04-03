
var $window;

function Yasc ()
{
	$window = $(window);
	
	Game.call (this, {
		canvasId: "viewport",
		bgColor: [0, 0.5, 0.5, 1],
	});
}

Yasc.prototype = Object.create (Game.prototype, {constructor: Game});

Yasc.prototype.onPreload = function ()
{
	this.load ("images/meadow.png");
	this.load ("shaders/map.vert");
	this.load ("shaders/map.frag");
}

Yasc.prototype.onCreate = function ()
{
	this.mapProg = this.create.program (["shaders/map.vert", "shaders/map.frag"]);
	this.mapCam = new MapCamera (this);
	this.map = new Map (this, 16);
	this.sun = vec3.transformMat4 (
		vec3.create (),
		vec3.fromValues (0, 0, -1),
		mat4.rotateX (mat4.create (),
			mat4.rotateZ (mat4.create (), mat4.create (), -radians (45)),
			-radians (45)
		)
	);
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

