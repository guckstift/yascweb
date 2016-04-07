
precision highp float;

uniform sampler2D uTextures [8];

varying vec2 vTexCoord;
varying vec2 vMapCoord;
varying float vCoeff;
varying float vUseTextures [8];

void main ()
{

	gl_FragColor = vec4 (0.0, 0.0, 0.0, 1.0);
	
	for (int i=0; i<8; i++) {
		gl_FragColor += texture2D (uTextures [i], vTexCoord) * vUseTextures [i];
	}
	
	gl_FragColor.rgb *= vCoeff;
}

