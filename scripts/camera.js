
function Camera (game)
{
	this.game = game;
}

Camera.prototype.enable = function ()
{
	if (this.game.program) {
		this.game.program.setUniformMat4f ("uView", this.view);
		this.game.program.setUniformMat4f ("uProj", this.proj);
	}
}

Camera.prototype.update = function ()
{
	this.view = mat4.create ();
	this.proj = mat4.create ();
}

