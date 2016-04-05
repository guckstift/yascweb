
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

Factory.prototype.buffer1f = function (data)
{
	return this.buffer (data, 1, "float", false);
}

Factory.prototype.buffer2f = function (data)
{
	return this.buffer (data, 2, "float", false);
}

Factory.prototype.buffer3f = function (data)
{
	return this.buffer (data, 3, "float", false);
}

Factory.prototype.buffer1ub = function (data)
{
	return this.buffer (data, 1, "ubyte", false);
}

Factory.prototype.buffer2ub = function (data)
{
	return this.buffer (data, 2, "ubyte", false);
}

Factory.prototype.buffer3ub = function (data)
{
	return this.buffer (data, 3, "ubyte", false);
}

Factory.prototype.buffer1us = function (data)
{
	return this.buffer (data, 1, "ushort", false);
}

Factory.prototype.buffer2us = function (data)
{
	return this.buffer (data, 2, "ushort", false);
}

Factory.prototype.buffer3us = function (data)
{
	return this.buffer (data, 3, "ushort", false);
}

Factory.prototype.indexBuffer1us = function (data)
{
	return this.buffer (data, 1, "ushort", true);
}

Factory.prototype.camera = function ()
{
	return new Camera (this.game);
}

