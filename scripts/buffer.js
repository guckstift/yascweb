
function Buffer (game, data, type, components, isIbo)
{
	this.game = game;
	this.data = data;
	this.type = type || "float";
	this.components = components || 3;
	this.isIbo = isIbo || false;
	
	this.boundTo = "";
	
	var gl = this.game.gl;
	
	if (this.type == "float" || this.data instanceof Float32Array) {
		this.arrayType = Float32Array;
	}
	else if (this.type == "ushort" || this.data instanceof Uint16Array) {
		this.arrayType = Uint16Array;
	}

	if (!this.data instanceof this.arrayType) {
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

