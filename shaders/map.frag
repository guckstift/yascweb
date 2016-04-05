
precision highp float;

uniform sampler2D uGrassland;
uniform sampler2D uMeadow;
uniform sampler2D uBeach;
uniform vec3 uSun;

varying vec2 vTexCoord;
varying vec3 vNormal;
varying vec2 vMapCoord;
varying float vUseGrassland;
varying float vUseMeadow;
varying float vUseBeach;

void main ()
{
	//float coeff = dot (-uSun, normal.xyz);
	float coeff = pow (dot (-uSun, vNormal.xyz), 3.0) * 2.0;
	gl_FragColor =
		texture2D (uGrassland, vTexCoord) * vUseGrassland +
		texture2D (uMeadow, vTexCoord) * vUseMeadow +
		texture2D (uBeach, vTexCoord) * vUseBeach
	;
	//gl_FragColor = mix (gl_FragColor, coeff * gl_FragColor, 0.901);
	gl_FragColor = coeff * gl_FragColor;
	gl_FragColor.a = 1.0;
}

