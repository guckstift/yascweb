
function Shader (game, name, source)
{
	this.game = game;
	this.name = name;
	this.source = source;
	
	var gl = game.gl;
	
	if (fileExt (name) == "vert") {
		this.type = "vertex";
		this.shaderType = gl.VERTEX_SHADER;
	}
	else if (fileExt (name) == "frag") {
		this.type = "fragment";
		this.shaderType = gl.FRAGMENT_SHADER;
	}
	
	this.shader = gl.createShader (this.shaderType);
	gl.shaderSource (this.shader, source);
	gl.compileShader (this.shader);
	
	if (!gl.getShaderParameter (this.shader, gl.COMPILE_STATUS)) {
		throw (
			"error compiling " + this.type + " shader '" + name + "': " +
			gl.getShaderInfoLog (this.shader)
		);
	}
}

