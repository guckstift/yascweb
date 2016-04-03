
function Game (props)
{
	var self = this;
	
	props = props || {};
	
	this.canvasId = props.canvasId;
	this.bgColor = props.bgColor || [0, 0, 0, 1];
	this.size = props.size || [800, 600];
	this.updateInterval = props.updateInterval || 5;
	this.onPreload = this.onPreload || props.onPreload || $.noop;
	this.onCreate = this.onCreate || props.onCreate || $.noop;
	this.onUpdate = this.onUpdate || props.onUpdate || $.noop;
	this.onRender = this.onRender || props.onRender || $.noop;
	
	this.loadingObjs = [];
	this.cache = {};
	
	this.create = new Factory (this);
	
	if (this.canvasId) {
		this.canvas = $("#" + this.canvasId) [0];
	}
	else {
		this.canvas = $("<canvas>") [0];
		$("body").append (this.canvas);
	}
	
	this.gl = this.canvas.getContext ("webgl", {antialias: false});
	
	this.cache ["standard.vert"] = this.create.shader ("standard.vert", Game.stdVertShaderSource);
	this.cache ["standard.frag"] = this.create.shader ("standard.frag", Game.stdFragShaderSource);
	
	this.stdProgram = this.create.program (["standard.vert", "standard.frag"]);
	this.stdCamera = this.create.camera ();
	
	this.setProgram ();
	this.setCamera ();
	
	this.setBgColor ();
	this.resize ();
}

Game.stdVertShaderSource =
	"attribute vec3 aPos;"+
	"uniform mat4 uView;"+
	"uniform mat4 uProj;"+
	""+
	"void main ()"+
	"{"+
	"	gl_Position = uProj * uView * vec4 (aPos, 1);"+
	"}"+
	""
;

Game.stdFragShaderSource =
	"void main ()"+
	"{"+
	"	gl_FragColor = vec4 (1);"+
	"}"+
	""
;

Game.prototype.launch = function ()
{
	var self = this;
	
	this.onPreload ();
	
	$.when.apply ($, this.loadingObjs).done (this.preloadDone.bind (this));
	
	this.loadingObjs = [];
}

Game.prototype.preloadDone = function ()
{
	var self = this;
	
	this.onCreate ();
	
	setTimeout (this.updateLoop.bind (this), this.updateInterval);
	requestAnimationFrame (this.renderLoop.bind (this));
}

Game.prototype.updateLoop = function ()
{
	this.onUpdate ();
	setTimeout (this.updateLoop.bind (this), this.updateInterval);
}

Game.prototype.renderLoop = function ()
{
	this.gl.clear (this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	this.onRender ();
	requestAnimationFrame (this.renderLoop.bind (this));
}

Game.prototype.setBgColor = function (bgColor)
{
	this.bgColor = bgColor || this.bgColor;
	this.gl.clearColor (
		this.bgColor [0],
		this.bgColor [1],
		this.bgColor [2],
		this.bgColor [3]
	);
}

Game.prototype.setProgram = function (program)
{
	this.program = program || this.stdProgram;
	this.program.use ();
	
	if (this.camera) {
		this.camera.update ();
		this.camera.enable ();
	}
}

Game.prototype.setCamera = function (camera)
{
	this.camera = camera || this.stdCamera;
	this.camera.update ();
	this.camera.enable ();
}

Game.prototype.resize = function (size)
{
	this.size = size || this.size;
	this.canvas.width = this.size [0];
	this.canvas.height = this.size [1];
	this.gl.viewport (
		0,
		0,
		this.size [0],
		this.size [1]
	);
	this.camera.update ();
}

Game.prototype.load = function (url)
{
	var self = this;
	
	if (fileExt (url) == "png") {
		var loadingObj = loadImage (url, function (img) {
			self.cache [url] = self.create.texture (img);
		});
	}
	else if (fileExt (url) == "vert" || fileExt (url) == "frag") {
		var loadingObj = loadText (url, function (text) {
			self.cache [url] = self.create.shader (url, text);
		});
	}
	else {
		var loadingObj = loadText (url, function (text) {
			self.cache [url] = text;
		});
	}
	
	this.loadingObjs.push (loadingObj);
}

Game.prototype.drawTriangles = function (count)
{
	this.gl.drawArrays (this.gl.TRIANGLES, 0, count * 3);
}

Game.prototype.drawTrianglesIndexed = function (count, indexBuf)
{
	indexBuf.bind ();
	
	if (indexBuf.type == "ushort") {
		this.gl.drawElements (this.gl.TRIANGLES, count * 3, this.gl.UNSIGNED_SHORT, 0);
	}
}

