
/*

void Yasc::resizeWindow (int w, int h)
{
	windowDim[0] = w;
	windowDim[1] = h;
	glViewport (0, 0, w, h);
	
	view = mat4 ();
	
	view = scale (view, vec3 (zoom, zoom, 1));

	view = scale (view, vec3 ( stdScale*2.0/w , -stdScale*2.0/h , 0));
	/*
	view = dot (view, scalingMat (Vec3(1,-1,1)));
	view = dot (view, scalingMat (Vec3(2.0/w,2.0/h,1)));
	view = dot (view, scalingMat (Vec3(64, 64, 0)));
	* /

	view = translate (view, vec3 (center, 0));

	view = rotate (view, radians (90.0f-VIEW_ZENIT), vec3 (1,0,0));
}

void Yasc::scroll (int val)
{
	if (val > 0) {
		zoom *= 1.25;
	}
	else {
		zoom /= 1.25;
	}
	resizeWindow (windowDim[0], windowDim[1]);
}

void Yasc::mouseDrag (int relx, int rely)
{
	center[0] += relx / (stdScale * zoom);
	center[1] += rely / (stdScale * zoom);
	resizeWindow (windowDim[0], windowDim[1]);
}


*/

function MapCamera (yasc)
{
	Camera.call (this, yasc);
	
	this.zoom = 32+16;
	this.x = -64;
	this.y = -64;
}

MapCamera.prototype = Object.create (Camera.prototype, {constructor: Camera});

MapCamera.prototype.update = function ()
{
	Camera.prototype.update.call (this);
	
	mat4.scale (this.proj, this.proj, vec3.fromValues (1,-1,1));
	mat4.translate (this.proj, this.proj, vec3.fromValues (-1,-1,0));
	mat4.scale (this.proj, this.proj, vec3.fromValues (2,2,1));
	mat4.scale (this.proj, this.proj, vec3.fromValues (
		1 / this.game.size [0],
		1 / this.game.size [1],
		1
	));
	mat4.translate (this.proj, this.proj, vec3.fromValues (-this.x, -this.y, 0));
	mat4.scale (this.proj, this.proj, vec3.fromValues (this.zoom, this.zoom, 0));
	mat4.rotateX (this.proj, this.proj, Math.acos (1 / Math.sqrt (3)));
	/*
	mat4.scale (this.proj, this.proj, vec3.fromValues (1,-1,1));
	mat4.translate (this.proj, this.proj, vec3.fromValues (-1,-1,0));
	mat4.scale (this.proj, this.proj, vec3.fromValues (
		1 / this.game.size [0],
		1 / this.game.size [1],
	1));
	mat4.translate (this.proj, this.proj, vec3.fromValues (this.x,this.y,0));
	mat4.scale (this.proj, this.proj, vec3.fromValues (this.zoom,this.zoom,0));
	mat4.rotateX (this.proj, this.proj, -Math.acos (1 / Math.sqrt (3)));
	*/
}

