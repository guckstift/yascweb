
attribute float aHeight;
attribute vec3 aNormal;
attribute float aTerra;
attribute vec2 aMapCoord;

uniform mat4 uView;
uniform mat4 uProj;

varying vec2 vTexCoord;
varying vec2 vMapCoord;
varying vec3 vNormal;

varying float vUseGrassland;
varying float vUseMeadow;
varying float vUseBeach;

float triaHeight = sin (radians (60.0));

void main ()
{
	vec2 pos = vec2 (
		aMapCoord.x + (mod (aMapCoord.y, 2.0) == 1.0 ? 0.5 : 0.0),
		aMapCoord.y * triaHeight
	);
	//gl_Position = uProj * uView * vec4 (aPos, aHeight, 1);
	gl_Position = uProj * uView * vec4 (pos, aHeight, 1);
	vTexCoord = vec2 (pos.x, pos.y / (triaHeight * 2.0));
	vNormal = aNormal;
	vMapCoord = aMapCoord;
	vUseGrassland = (aTerra == 0.0) ? 1.0 : 0.0;
	vUseMeadow = (aTerra == 1.0) ? 1.0 : 0.0;
	vUseBeach = (aTerra == 2.0) ? 1.0 : 0.0;
}

