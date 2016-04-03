
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

Factory.prototype.buffer = function (data, type, components, isIbo)
{
	return new Buffer (this.game, data, type, components, isIbo);
}

Factory.prototype.buffer1f = function (data)
{
	return this.buffer (data, "float", 1, false);
}

Factory.prototype.buffer2f = function (data)
{
	return this.buffer (data, "float", 2, false);
}

Factory.prototype.buffer3f = function (data)
{
	return this.buffer (data, "float", 3, false);
}

Factory.prototype.indexBuffer1us = function (data)
{
	return this.buffer (data, "ushort", 1, true);
}

Factory.prototype.camera = function ()
{
	return new Camera (this.game);
}

