
function Factory (game)
{
	this.game = game;
}

Factory.prototype.shader = function (name, source)
{
	source = source || this.game.cache [name];
	return new Shader (this.game, name, source);
}

Factory.prototype.program = function (shaders)
{
	for (var i=0; i<shaders.length; i++) {
		if (typeof shaders [i] == "string") {
			shaders [i] = this.game.cache [shaders [i]];
		}
	}
	
	return new Program (this.game, shaders);
}

Factory.prototype.texture = function (img)
{
	return new Texture (this.game, img);
}

Factory.prototype.buffer = function (data, components, type, isIbo)
{
	return new Buffer (this.game, data, components, type, isIbo);
}

Factory.prototype.camera = function ()
{
	return new Camera (this.game);
}

