
function Mesh (game, desc)
{
	this.game = game;
	this.bbox = desc.bbox;
	this.vertices = desc.vertices;
	this.normals = desc.normals;
	
	this.vertBuf = this.game.create.buffer (this.vertices, 3);
	this.normalBuf = this.game.create.buffer (this.normals, 3);
	
	this.groups = [];
	
	_.each (desc.groups, function (group, i) {
		this.groups [i] = new MeshGroup (
			this,
			group.diffuseColor,
			group.indices
		);
	}, this);
}

Mesh.prototype.draw = function (pos)
{
	pos = pos || vec3.create ();
	
	this.game.meshProg.enableAttributeArray ("aPos", this.vertBuf);
	this.game.meshProg.enableAttributeArray ("aNormal", this.normalBuf);
	
	this.game.meshProg.setUniformVec ("uSun", this.game.sun); // TODO: pull this out from yasc
	
	_.each (this.groups, function (group, i) {
		group.draw (pos)
	}, this);
}

