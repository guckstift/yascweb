
precision highp float;

uniform vec3 uDiffuseColor;
uniform vec3 uSun;

varying vec3 vNormal;

void main ()
{
	float coeff = max (0.0, dot (-uSun, normalize (vNormal)));

	gl_FragColor = vec4 (uDiffuseColor * coeff, 1.0);
}

