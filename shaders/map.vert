
attribute vec2 aPos;
attribute float aHeight;
attribute vec2 aTexCoord;
attribute vec3 aNormal;

uniform mat4 uView;
uniform mat4 uProj;

varying vec2 vTexCoord;
varying vec3 vNormal;

void main ()
{
	gl_Position = uProj * uView * vec4 (aPos, aHeight, 1);
	vTexCoord = aTexCoord;
	vNormal = aNormal;
}

