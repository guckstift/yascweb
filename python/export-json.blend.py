
import bpy
import json
import os.path

prec = 8

outObj = {
	"jsonType" : "mesh",
	"bbox" : [],
	"vertices" : [],
	"normals" : [],
	"groups" : [],
}

for obj in bpy.data.objects:

	if obj.type == "MESH":
	
		mesh = obj.data
		verts = mesh.vertices
		polys = mesh.polygons
		mats = mesh.materials
		
		for comp in obj.dimensions:
			outObj["bbox"].append (comp)
		
		for vert in verts:
			for i, comp in enumerate (vert.co):
				outObj ["vertices"].append (round (comp, prec))
			for i, comp in enumerate (vert.normal):
				outObj ["normals"].append (round (comp, prec))
		
		for i, mat in enumerate (mats):
		
			diffuseColor = []
			
			for comp in mat.diffuse_color:
				diffuseColor.append (round (comp, prec))
			
			indices = []
			
			for poly in polys:
			
				if poly.material_index == i:
				
					if len (poly.vertices) == 4:
						indices.extend ((poly.vertices[0], poly.vertices[1], poly.vertices[2]))
						indices.extend ((poly.vertices[0], poly.vertices[2], poly.vertices[3]))
					elif len (poly.vertices) == 3:
						indices.extend ((poly.vertices[0], poly.vertices[1], poly.vertices[2]))
					else:
						print ("Can't handle faces with",len (poly.vertices),"vertices")
			
			outObj ["groups"].append ({
				"diffuseColor" : diffuseColor,
				"indices" : indices,
			})

print (
	json.dumps (outObj, separators = (",", ":"), indent = None, sort_keys = True)
)

outFileName = "meshes/" + os.path.basename (os.path.splitext (bpy.data.filepath) [0] + ".json")

open (outFileName, "w").write (
	json.dumps (outObj, separators = (",", ":"), indent = None, sort_keys = True)
)

