
function Texture (game, img, width, height)
{
	this.game = game;
	this.img = img;
	this.width = width || img.width;
	this.height = height || img.height;
	
	var gl = this.game.gl;
	
	this.tex = gl.createTexture ();
	
	this.bind ();
	
	if (this.img instanceof HTMLImageElement) {
		gl.texImage2D (gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.img);
	}
	else {
		gl.texImage2D (gl.TEXTURE_2D, 0, gl.RGBA,
			this.width,
			this.height,
			0, gl.RGBA, gl.UNSIGNED_BYTE, this.img
		);
	}
	
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
}

Texture.prototype.bind = function (texUnit)
{
	texUnit = texUnit || 0;
	
	var gl = this.game.gl;
	
	gl.activeTexture (gl ["TEXTURE" + texUnit], this.tex);
	gl.bindTexture (gl.TEXTURE_2D, this.tex);
}

