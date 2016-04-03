
function loadText (url, callback)
{
	return $.get (url, {}, callback, "text");
}

function loadImage (url, callback)
{
	return $.Deferred (function (deferred) {
		var $img = $("<img>")
		$img.load (function (eventObj) {
			callback (eventObj.target);
			deferred.resolve ();
		})
		$img.attr ("src", url);
	});
}

function fileExt (filename)
{
	return filename.split (".").pop ();
}

function radians (d)
{
	return d * Math.PI / 180;
}

function degrees (r)
{
	return r * 180 / Math.PI;
}

