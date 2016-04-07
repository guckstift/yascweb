
function Program (game, shaders)
{
	var self = this;
	
	this.game = game;
	this.shaders = shaders;
	
	this.nextTexUnit = 0;
	
	var gl = this.game.gl;
	
	this.prog = gl.createProgram ();
	
	this.shaders.forEach (function (shader) {
		gl.attachShader (self.prog, shader.shader);
	});
	
	gl.linkProgram (this.prog);
	
	if (!gl.getProgramParameter (this.prog, gl.LINK_STATUS)) {
		throw (
			"error linking shader program: " + gl.getProgramInfoLog (this.prog)
		);
	}
}

Program.prototype.use = function ()
{
	var gl = this.game.gl;
	
	gl.useProgram (this.prog);
}

Program.prototype.getAttribute = function (name)
{
	var gl = this.game.gl;
	
	return gl.getAttribLocation (this.prog, name);
}

Program.prototype.getUniform = function (name)
{
	var gl = this.game.gl;
	
	return gl.getUniformLocation (this.prog, name);
}

Program.prototype.enableTexture = function (uniform, texture)
{
	var gl = this.game.gl;
	
	texture.bind (this.nextTexUnit);
	gl.uniform1i (this.getUniform (uniform), this.nextTexUnit);
	
	this.nextTexUnit ++;
}

Program.prototype.enableTextures = function (uniform, textures)
{
	var gl = this.game.gl;

	_.each (textures, function (tex, i) {
		tex.bind (this.nextTexUnit + i);
	}, this);
	
	gl.uniform1iv (
		this.getUniform (uniform),
		_.range (this.nextTexUnit, textures.length)
	);
	
	this.nextTexUnit += textures.length;
}

Program.prototype.disableTextures = function ()
{
	this.nextTexUnit = 0;
}

Program.prototype.enableAttributeArray = function (attribute, buffer)
{
	var gl = this.game.gl;
	
	var attributeLocation = this.getAttribute (attribute);
	
	buffer.bind ();
	gl.enableVertexAttribArray (attributeLocation);

	gl.vertexAttribPointer (
		attributeLocation,
		buffer.components,
		buffer.glType,
		false, 0, 0
	);
}

Program.prototype.setUniformMat4f = function (uniform, value)
{
	var gl = this.game.gl;
	
	gl.uniformMatrix4fv (this.getUniform (uniform), false, value);
}

Program.prototype.setUniformVec = function (uniform, value)
{
	var gl = this.game.gl;
	
	if (value.length == 1) {
		gl.uniform1fv (this.getUniform (uniform), value);
	}
	else if (value.length == 2) {
		gl.uniform2fv (this.getUniform (uniform), value);
	}
	else if (value.length == 3) {
		gl.uniform3fv (this.getUniform (uniform), value);
	}
	else if (value.length == 4) {
		gl.uniform4fv (this.getUniform (uniform), value);
	}
}

Program.prototype.setUniform = function (uniform, value)
{
	var gl = this.game.gl;
	
	gl.uniform1f (this.getUniform (uniform), value);
}

