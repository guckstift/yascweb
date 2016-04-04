
precision mediump float;

uniform sampler2D uMeadow;
uniform vec3 uSun;

varying vec2 vTexCoord;
varying vec3 vNormal;

void main ()
{
	float coeff = dot (-uSun, vNormal);
	gl_FragColor = mix (
		texture2D (uMeadow, vTexCoord),
		coeff * texture2D (uMeadow, vTexCoord),
		1.0
	);
	gl_FragColor.a = 1.0;
}

