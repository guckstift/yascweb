
function Texture (game, img)
{
	this.game = game;
	this.img = img;
	
	var gl = this.game.gl;
	
	this.tex = gl.createTexture ();
	
	this.bind ();
	gl.texImage2D (gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.img);
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
}

Texture.prototype.bind = function (texUnit)
{
	texUnit = texUnit || 0;
	
	var gl = this.game.gl;
	
	gl.activeTexture (gl ["TEXTURE" + texUnit], this.tex);
	gl.bindTexture (gl.TEXTURE_2D, this.tex);
}

