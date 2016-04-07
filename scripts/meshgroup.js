
function MeshGroup (mesh, diffuseColor, indices)
{
	this.mesh = mesh;
	this.game = this.mesh.game;
	this.diffuseColor = diffuseColor;
	this.indices = indices;
	
	this.indexBuf = this.game.create.buffer (this.indices, 1, "ushort", true);
}

MeshGroup.prototype.draw = function (pos)
{
	this.game.meshProg.setUniformVec ("uPos", pos);
	this.game.meshProg.setUniformVec ("uDiffuseColor", this.diffuseColor);
	
	this.game.drawTrianglesIndexed (this.indices.length / 3, this.indexBuf);
}

