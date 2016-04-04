
precision highp float;

uniform sampler2D uGrassland;
uniform sampler2D uMeadow;
uniform sampler2D uBeach;
uniform sampler2D uTextures[3];
uniform vec3 uSun;

varying vec2 vTexCoord;
varying vec3 vNormal;
varying float vUseGrassland;
varying float vUseMeadow;
varying float vUseBeach;

void main ()
{
	float coeff = dot (-uSun, vNormal);
	gl_FragColor =
		texture2D (uGrassland, vTexCoord) * vUseGrassland +
		texture2D (uMeadow, vTexCoord) * vUseMeadow +
		texture2D (uBeach, vTexCoord) * vUseBeach
	;
	gl_FragColor = mix (gl_FragColor, coeff * gl_FragColor, 0.75);
	gl_FragColor.a = 1.0;
}

