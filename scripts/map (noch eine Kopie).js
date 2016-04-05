
$(mapInit);

function mapInit ()
{
	Map.triaHeight = sin (radians (60));
}

function Map (yasc, size)
{
	this.yasc = yasc;
	this.size = size || 8;
	this.numVertsPerRow = this.size + 1;
	this.numVertRows = this.size * 2 + 1;
	this.numVerts = this.numVertRows * this.numVertsPerRow;
	this.numTriasPerRow = this.size * 2;
	this.numTriaRows = this.size * 2;
	this.numTrias = this.numTriaRows * this.numTriasPerRow;
	
	this.mapCoords = new Uint16Array (this.numVerts * 2);
	this.normals = new Float32Array (this.numVerts * 3);
	this.heights = new Float32Array (this.numVerts);
	this.terra = new Uint8Array (this.numVerts);
	this.indices = new Uint16Array (this.numTrias * 3);
	
	//this.normalBytes = new Uint8Array (this.numVerts * 4);
	this.normalTextureHeight = nextPot (ceil (this.numVerts/1024));
	this.normalBytes = new Uint8Array (
		1024 * this.normalTextureHeight * 4
	);
	
	for (var x=0; x<this.numVertsPerRow; x++) {
		for (var y=0; y<this.numVertRows; y++) {
			var i = this.linearCoord (x, y) * 2;
			this.mapCoords [i + 0] = x;
			this.mapCoords [i + 1] = y;
		}
	}
	
	for (var x=0; x<this.numTriasPerRow; x++) {
		for (var y=0; y<this.numTriaRows; y++) {
			var i = (y * this.numTriasPerRow + x) * 3;
			var j = y * this.numVertsPerRow;
			var halfX = Math.floor (x/2);
			if (y % 2 == 0) {
				if (x % 2 == 0) {
					this.indices [i + 0] = j + halfX;
					this.indices [i + 1] = j + halfX + 1;
					this.indices [i + 2] = j + halfX + this.numVertsPerRow;
				}
				else {
					this.indices [i + 0] = j + halfX + 1;
					this.indices [i + 1] = j + halfX + this.numVertsPerRow + 1;
					this.indices [i + 2] = j + halfX + this.numVertsPerRow;
				}
			}
			else {
				if (x % 2 == 0) {
					this.indices [i + 0] = j + halfX;
					this.indices [i + 1] = j + halfX + this.numVertsPerRow + 1;
					this.indices [i + 2] = j + halfX + this.numVertsPerRow;
				}
				else {
					this.indices [i + 0] = j + halfX;
					this.indices [i + 1] = j + halfX + 1;
					this.indices [i + 2] = j + halfX + this.numVertsPerRow + 1;
				}
			}
		}
	}
	
	for (var i=0; i<this.heights.length; i++) {
		//this.heights [i] = Math.random () * 0.5;
		//this.heights [i] = floor (Math.random () * 2) * 0.5;
		//this.terra [i] = floor (Math.random () * 3);
	}
	
	//this.setHeight (8, 8, 0.5);
	
	this.createBuffers ();
	
	var gl = this.yasc.gl;
	
	this.normalTexture = new Texture (yasc,
		this.normalBytes, 1024, this.normalTextureHeight //this.numVertsPerRow, this.numVertRows
	);
	/*
	this.normalTexture = gl.createTexture ();
	gl.bindTexture (gl.TEXTURE_2D, this.normalTexture);
	gl.texImage2D (
		gl.TEXTURE_2D, 0, gl.RGB,
		this.numVertsPerRow,
		this.numVertRows,
		0, gl.RGB, gl.UNSIGNED_BYTE, this.normalBytes
	);
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	*/
}

Map.prototype.createBuffers = function ()
{
	for (var x=0; x<this.numVertsPerRow; x++) {
		for (var y=0; y<this.numVertRows; y++) {
			var i = this.linearCoord (x, y);
			var vm = this.getVertex (x, y);
			var vs = [
				this.getVertex (x - 1, y),
				this.getVertex.apply (this, this.leftUpFrom (x, y)),
				this.getVertex.apply (this, this.rightUpFrom (x, y)),
				this.getVertex (x + 1, y),
				this.getVertex.apply (this, this.rightDownFrom (x, y)),
				this.getVertex.apply (this, this.leftDownFrom (x, y)),
			];
			var cs = [
				vec3.cross (vec3.create (), vs [0], vs [1]),
				vec3.cross (vec3.create (), vs [1], vs [2]),
				vec3.cross (vec3.create (), vs [2], vs [3]),
				vec3.cross (vec3.create (), vs [3], vs [4]),
				vec3.cross (vec3.create (), vs [4], vs [5]),
				vec3.cross (vec3.create (), vs [5], vs [0]),
			];
			var ct = vec3.create ();
			for (var k = 0; k < 6; k++) {
				vec3.add (ct, ct, cs [k]);
			}
			vec3.normalize (ct, ct);
			this.normals [i * 3 + 0] = ct [0];
			this.normals [i * 3 + 1] = ct [1];
			this.normals [i * 3 + 2] = ct [2];
			
			var h = y * 1024 + x;
			
			this.normalBytes [i * 4 + 0] = ct [0] * 128 + 128;
			this.normalBytes [i * 4 + 1] = ct [1] * 128 + 128;
			this.normalBytes [i * 4 + 2] = ct [2] * 128 + 128;
		}
	}
	
	this.heightBuf = yasc.create.buffer (this.heights, 1);
	this.normalBuf = yasc.create.buffer (this.normals, 3);
	this.terraBuf = yasc.create.buffer (this.terra, 1, "ubyte");
	this.mapCoordBuf = yasc.create.buffer (this.mapCoords, 2, "ushort");
	this.indexBuf = yasc.create.buffer (this.indices, 1, "ushort", true);
}

Map.prototype.draw = function ()
{
	this.yasc.setProgram (this.yasc.mapProg);

	this.yasc.mapProg.enableAttributeArray ("aHeight", this.heightBuf);
	//this.yasc.mapProg.enableAttributeArray ("aNormal", this.normalBuf);
	this.yasc.mapProg.enableAttributeArray ("aTerra", this.terraBuf);
	this.yasc.mapProg.enableAttributeArray ("aMapCoord", this.mapCoordBuf);
	
	this.yasc.mapProg.enableTexture ("uNormals", this.normalTexture);
	this.yasc.mapProg.enableTexture ("uGrassland", this.yasc.cache ["images/grassland.png"]);
	this.yasc.mapProg.enableTexture ("uMeadow", this.yasc.cache ["images/meadow.png"]);
	this.yasc.mapProg.enableTexture ("uBeach", this.yasc.cache ["images/beach.png"]);
	
	this.yasc.mapProg.setUniformVec ("uSun", this.yasc.sun);
	this.yasc.mapProg.setUniform ("uNormalTextureHeight", this.normalTextureHeight);
	this.yasc.mapProg.setUniform ("uNumVerticesPerRow", this.numVertsPerRow);
	
	this.yasc.drawTrianglesIndexed (this.numTrias, this.indexBuf);
	
	this.yasc.mapProg.disableTextures ();
}

Map.prototype.getTerra = function (x, y)
{
	var i = this.linearCoord (x, y);
	return this.terra [i];
}


Map.prototype.setTerra = function (x, y, v)
{
	var i = this.linearCoord (x, y);
	this.terra [i] = v;
}


Map.prototype.getHeight = function (x, y)
{
	var i = this.linearCoord (x, y);
	return this.heights [i];
}


Map.prototype.setHeight = function (x, y, v)
{
	var i = this.linearCoord (x, y);
	this.heights [i] = v;
}

Map.prototype.getVertex = function (x, y)
{
	var i = this.linearCoord (x, y);
	return vec3.fromValues (
		x + (y % 2) * 0.5,
		y * Map.triaHeight,
		this.heights [i]
	);
}

Map.prototype.linearCoord = function (x, y)
{
	x = clamp (0, this.numVertsPerRow - 1, x);
	y = clamp (0, this.numVertRows - 1, y);
	return y * this.numVertsPerRow + x;
}

Map.prototype.leftUpFrom = function (x, y)
{
	return [x - 1 + (y % 2), y - 1];
}


Map.prototype.rightUpFrom = function (x, y)
{
	return [x + (y % 2), y - 1];
}


Map.prototype.leftDownFrom = function (x, y)
{
	return [x - 1 + (y % 2), y + 1];
}


Map.prototype.rightDownFrom = function (x, y)
{
	return [x + (y % 2), y + 1];
}

