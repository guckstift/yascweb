
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
	this.onMouseMove = this.onMouseMove || props.onMouseMove || $.noop;
	this.onMouseDown = this.onMouseDown || props.onMouseDown || $.noop;
	this.onMouseUp = this.onMouseUp || props.onMouseUp || $.noop;
	this.onMouseWheelDown = this.onMouseWheelDown || props.onMouseWheelDown || $.noop;
	this.onMouseWheelUp = this.onMouseWheelUp || props.onMouseWheelUp || $.noop;
	this.onTouchMove = this.onTouchMove || props.onTouchMove || $.noop;
	this.onTouchStart = this.onTouchStart || props.onTouchStart || $.noop;
	
	this.loadingObjs = [];
	this.cache = {};
	this.mouseX = 0;
	this.mouseY = 0;
	this.mouseRelX = 0;
	this.mouseRelY = 0;
	this.touchX = 0;
	this.touchY = 0;
	this.touchRelX = 0;
	this.touchRelY = 0;
	
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
	
	this.gl.enable (this.gl.CULL_FACE);
	this.gl.cullFace (this.gl.BACK);
	this.gl.frontFace (this.gl.CW);
	this.gl.enable (this.gl.DEPTH_TEST);
	this.gl.depthFunc (this.gl.GREATER);
	this.gl.clearDepth (0);
	
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
	
	this.load ("shaders/mesh.vert");
	this.load ("shaders/mesh.frag");
	
	this.onPreload ();
	
	$.when.apply ($, this.loadingObjs).done (this.preloadDone.bind (this));
	
	this.loadingObjs = [];
}

Game.prototype.preloadDone = function ()
{
	var self = this;
	
	this.meshProg = this.create.program (["shaders/mesh.vert", "shaders/mesh.frag"]);
	
	this.onCreate ();
	
	document.addEventListener ("mousemove", function (eventObject) {
		self.mouseX = eventObject.clientX;
		self.mouseY = eventObject.clientY;
		self.mouseRelX = eventObject.movementX;
		self.mouseRelY = eventObject.movementY;
		self.onMouseMove ();
	});
	
	document.addEventListener ("mousedown", function (eventObject) {
		self.mouseX = eventObject.clientX;
		self.mouseY = eventObject.clientY;
		self.mouseRelX = eventObject.movementX;
		self.mouseRelY = eventObject.movementY;
		self.onMouseDown ();
	});
	
	document.addEventListener ("mouseup", function (eventObject) {
		self.mouseX = eventObject.clientX;
		self.mouseY = eventObject.clientY;
		self.mouseRelX = eventObject.movementX;
		self.mouseRelY = eventObject.movementY;
		self.onMouseUp ();
	});
	
	document.addEventListener ("wheel", function (eventObject) {
		self.mouseX = eventObject.clientX;
		self.mouseY = eventObject.clientY;
		self.mouseRelX = eventObject.movementX;
		self.mouseRelY = eventObject.movementY;
		if (eventObject.deltaY > 0) {
			self.onMouseWheelDown ();
		}
		else {
			self.onMouseWheelUp ();
		}
	});
	
	document.addEventListener ("touchmove", function (eventObject) {
		self.touchRelX = eventObject.touches[0].clientX - self.touchX;
		self.touchRelY = eventObject.touches[0].clientY - self.touchY;
		self.touchX = eventObject.touches[0].clientX;
		self.touchY = eventObject.touches[0].clientY;
		self.onTouchMove (eventObject);
	});
	
	document.addEventListener ("touchstart", function (eventObject) {
		self.touchX = eventObject.touches[0].clientX;
		self.touchY = eventObject.touches[0].clientY;
		self.onTouchStart (eventObject);
	});
	
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
	else if (fileExt (url) == "json") {
		var loadingObj = loadJson (url, function (json) {
			if (json.jsonType == "mesh") {
				self.cache [url] = new Mesh (self, json);
			}
			else {
				self.cache [url] = json;
			}
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

Game.prototype.lockPointer = function ()
{
	this.canvas.requestPointerLock ();
}

Game.prototype.releasePointer = function ()
{
	document.exitPointerLock ();
}

