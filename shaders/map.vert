
attribute vec2 aPos;
attribute float aHeight;
attribute vec2 aTexCoord;
attribute vec3 aNormal;
attribute float aTerra;

uniform mat4 uView;
uniform mat4 uProj;

varying vec2 vTexCoord;
varying vec3 vNormal;

varying float vUseGrassland;
varying float vUseMeadow;
varying float vUseBeach;

void main ()
{
	gl_Position = uProj * uView * vec4 (aPos, aHeight, 1);
	vTexCoord = aTexCoord;
	vNormal = aNormal;
	vUseGrassland = (aTerra == 0.0) ? 1.0 : 0.0;
	vUseMeadow = (aTerra == 1.0) ? 1.0 : 0.0;
	vUseBeach = (aTerra == 2.0) ? 1.0 : 0.0;
}

