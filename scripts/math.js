
abs = Math.abs;
acos = Math.acos;
asin = Math.asin;
atan = Math.atan;
ceil = Math.ceil;
cos = Math.cos;
exp = Math.exp;
floor = Math.floor;
log = Math.log;
max = Math.max;
min = Math.min;
pow = Math.pow;
sin = Math.sin;
sqrt = Math.sqrt;
tan = Math.tan;
pi = Math.PI

function radians (d)
{
	return d * pi / 180;
}

function degrees (r)
{
	return r * 180 / pi;
}

function clamp (minval, maxval, val)
{
	return max (minval, min (maxval, val));
}

function nextPot (n)
{
	n--;
	n |= n >> 1;
	n |= n >> 2;
	n |= n >> 4;
	n |= n >> 8;
	n |= n >> 16;
	n++;
	
	return n;
}

function _Vec2 (x, y)
{
	this.data = vec2.fromValues (
		x || 0,
		y || 0
	);
}

Vec2 = function (x, y)
{
	return new _Vec2 (x, y);
}

_Vec2.prototype.add = function (other)
{
	vec2.add (this.data, this.data, other.data);
	return this;
}

_Vec2.prototype.sub = function (other)
{
	vec2.sub (this.data, this.data, other.data);
	return this;
}

_Vec2.prototype.mul = function (other)
{
	vec2.mul (this.data, this.data, other.data);
	return this;
}

_Vec2.prototype.div = function (other)
{
	vec2.div (this.data, this.data, other.data);
	return this;
}

function _Vec3 (x, y, z)
{
	this.data = vec3.fromValues (
		x || 0,
		y || 0,
		z || 0
	);
}

Vec3 = function (x, y)
{
	return new _Vec3 (x, y);
}

_Vec3.prototype.add = function (other)
{
	vec3.add (this.data, this.data, other.data);
	return this;
}

_Vec3.prototype.sub = function (other)
{
	vec3.sub (this.data, this.data, other.data);
	return this;
}

_Vec3.prototype.mul = function (other)
{
	vec3.mul (this.data, this.data, other.data);
	return this;
}

_Vec3.prototype.div = function (other)
{
	vec3.div (this.data, this.data, other.data);
	return this;
}

function _Vec4 (x, y, z, w)
{
	this.data = vec4.fromValues (
		x || 0,
		y || 0,
		z || 0,
		w || 0
	);
}

Vec4 = function (x, y)
{
	return new _Vec4 (x, y);
}

_Vec4.prototype.add = function (other)
{
	vec4.add (this.data, this.data, other.data);
	return this;
}

_Vec4.prototype.sub = function (other)
{
	vec4.sub (this.data, this.data, other.data);
	return this;
}

_Vec4.prototype.mul = function (other)
{
	vec4.mul (this.data, this.data, other.data);
	return this;
}

_Vec4.prototype.div = function (other)
{
	vec4.div (this.data, this.data, other.data);
	return this;
}

