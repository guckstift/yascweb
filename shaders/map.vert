
attribute vec2 aMapCoord;
attribute float aHeight;
attribute vec3 aNormal;
attribute float aTerra;

const float triaHeight = sqrt (3.0) / 2.0;

uniform mat4 uView;
uniform mat4 uProj;
uniform float uTexZoom;
uniform vec3 uSun;

varying vec2 vTexCoord;
varying vec2 vMapCoord;
varying float vCoeff;
varying float vUseTextures [8];

void main ()
{
	vec4 worldPos = vec4 (
		aMapCoord.x + mod (aMapCoord.y, 2.0) * 0.5,
		aMapCoord.y * triaHeight,
		aHeight,
		1.0
	);
	
	vTexCoord = vec2 (
		worldPos.x / uTexZoom,
		worldPos.y / (triaHeight * 2.0) / uTexZoom
	);
	vMapCoord = aMapCoord;
	vCoeff = pow (dot (-uSun, aNormal), 2.0) * 1.5;
	
	for (int i=0; i<8; i++) {
		vUseTextures [i] = (aTerra == float (i)) ? 1.0 : 0.0;
	}

	gl_Position = uProj * uView * worldPos;
}

