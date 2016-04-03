
$(mapInit);

function mapInit ()
{
	Map.triaHeight = Math.sin (radians (60));
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
	
	this.vertices = new Float32Array (this.numVerts * 2);
	this.heights = new Float32Array (this.numVerts);
	this.indices = new Uint16Array (this.numTrias * 3);
	
	for (var x=0; x<this.numVertsPerRow; x++) {
		for (var y=0; y<this.numVertRows; y++) {
			var i = ((y * this.numVertsPerRow) + x) * 2;
			this.vertices [i + 0] = x + 0.5 * (y % 2);
			this.vertices [i + 1] = Map.triaHeight * y;
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
		//this.heights [i] = Math.floor (Math.random () * 2) * 0.5;
		this.heights [i] = Math.random ()
	}
	
	this.createBuffers ();
}

Map.prototype.createBuffers = function ()
{
	var fullVertices = new Float32Array (this.numTrias * 3 * 2);
	var fullHeights = new Float32Array (this.numTrias * 3);
	var fullTexCoords = new Float32Array (this.numTrias * 3 * 2);
	var fullNormals = new Float32Array (this.numTrias * 3 * 3);
	
	for (var x=0; x<this.numTriasPerRow; x++)
	{
		for (var y=0; y<this.numTriaRows; y++)
		{
			var i = (y * this.numTriasPerRow + x) * 3;
			var vs = Array (3);
			
			for (var v=0; v<3; v++) {
				var j = i + v;
				vs [v] = vec3.fromValues (
					this.vertices [this.indices [j] * 2 + 0],
					this.vertices [this.indices [j] * 2 + 1],
					this.heights [this.indices [j]]
				);
				fullVertices [j * 2 + 0] = vs [v][0];
				fullVertices [j * 2 + 1] = vs [v][1];
				fullHeights [j] = vs [v][2];
			}
			
			if ((x+y) % 2 == 0) {
				fullTexCoords [i * 2 + 0*2 + 0] = 0;
				fullTexCoords [i * 2 + 0*2 + 1] = 0.5;
				fullTexCoords [i * 2 + 1*2 + 0] = 1;
				fullTexCoords [i * 2 + 1*2 + 1] = 0.5;
				fullTexCoords [i * 2 + 2*2 + 0] = 0.5;
				fullTexCoords [i * 2 + 2*2 + 1] = 1;
			}
			else {
				fullTexCoords [i * 2 + 0*2 + 0] = 0.5;
				fullTexCoords [i * 2 + 0*2 + 1] = 0;
				fullTexCoords [i * 2 + 1*2 + 0] = 1;
				fullTexCoords [i * 2 + 1*2 + 1] = 0.5;
				fullTexCoords [i * 2 + 2*2 + 0] = 0;
				fullTexCoords [i * 2 + 2*2 + 1] = 0.5;
			}
			
			var u = vec3.sub (vec3.create (), vs [0], vs [1]);
			var v = vec3.sub (vec3.create (), vs [0], vs [2]);
			var c = vec3.cross (vec3.create (), u, v);
			c = vec3.normalize (c, c);
			
			fullNormals [i * 3 + 0] = fullNormals [i * 3 + 3] = fullNormals [i * 3 + 6] = c [0];
			fullNormals [i * 3 + 1] = fullNormals [i * 3 + 4] = fullNormals [i * 3 + 7] = c [1];
			fullNormals [i * 3 + 2] = fullNormals [i * 3 + 5] = fullNormals [i * 3 + 8] = c [2];
		}
	}
	
	/*
	for (var x=0; x<this.numTriasPerRow; x++) {
		for (var y=0; y<this.numTriaRows; y++) {
			var i = (y * this.numTriasPerRow + x) * 3;
			var v0 = this.vertices [this.indices [i] * 2 + 0];
			var v1 = this.vertices [this.indices [i] * 2 + 1];
			var u = vec3.fromValules (
				this.vertices [this.indices [i] * 2 + 0];
			);
		}
	}
	*/
	
	this.vertexBuf = yasc.create.buffer2f (fullVertices);
	this.heightBuf = yasc.create.buffer1f (fullHeights);
	this.texCoordBuf = yasc.create.buffer2f (fullTexCoords);
	this.normalBuf = yasc.create.buffer3f (fullNormals);
}

Map.prototype.draw = function ()
{
	this.yasc.setProgram (this.yasc.mapProg);

	this.yasc.mapProg.enableAttributeArray ("aPos", this.vertexBuf);
	this.yasc.mapProg.enableAttributeArray ("aHeight", this.heightBuf);
	this.yasc.mapProg.enableAttributeArray ("aTexCoord", this.texCoordBuf);
	this.yasc.mapProg.enableAttributeArray ("aNormal", this.normalBuf);
	
	this.yasc.mapProg.enableTexture ("uMeadow", this.yasc.cache ["images/meadow.png"]);
	this.yasc.mapProg.setUniformVec ("uSun", this.yasc.sun);
	
	this.yasc.drawTriangles (this.numTrias);
	
	this.yasc.mapProg.disableTextures ();
}


