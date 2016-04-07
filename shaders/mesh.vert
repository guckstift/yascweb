
attribute vec3 aPos;
attribute vec3 aNormal;

uniform vec3 uPos;
uniform mat4 uView;
uniform mat4 uProj;

varying vec3 vNormal;

void main ()
{
	vNormal = aNormal;
	
	gl_Position = uProj * uView * vec4 (aPos + uPos, 1.0);
}

