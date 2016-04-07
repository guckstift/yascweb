
function Buffer (game, data, components, type, isIbo)
{
	this.game = game;
	this.data = data;
	this.components = components || 3;
	this.type = type || "float";
	this.isIbo = isIbo || false;
	
	this.boundTo = "";
	
	var gl = this.game.gl;
	
	if (this.type == "float") { // || this.data instanceof Float32Array) {
		this.arrayType = Float32Array;
		this.glType = gl.FLOAT;
	}
	else if (this.type == "ubyte") { // || this.data instanceof Uint8Array) {
		this.arrayType = Uint8Array;
		this.glType = gl.UNSIGNED_BYTE;
	}
	else if (this.type == "ushort") { // || this.data instanceof Uint16Array) {
		this.arrayType = Uint16Array;
		this.glType = gl.UNSIGNED_SHORT;
	}
	else {
		throw "Missing type";
	}

	if (!(this.data instanceof this.arrayType)) {
		this.data = new this.arrayType (this.data);
	}
	
	if (this.isIbo) {
		this.bufferTarget = gl.ELEMENT_ARRAY_BUFFER;
	}
	else {
		this.bufferTarget = gl.ARRAY_BUFFER;
	}
	
	this.buf = gl.createBuffer ();
	this.bind ();
	gl.bufferData (
		this.bufferTarget,
		this.data,
		gl.STATIC_DRAW
	);
}

Buffer.prototype.bind = function ()
{
	var gl = this.game.gl;
	
	gl.bindBuffer (this.bufferTarget, this.buf);
}

Buffer.prototype.update = function ()
{
	var gl = this.game.gl;
	
	this.bind ();
	gl.bufferSubData (
		this.bufferTarget,
		0,
		this.data
	);
}

