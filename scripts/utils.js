
function loadText (url, callback)
{
	return $.get (url, {}, callback, "text");
}

function loadJson (url, callback)
{
	return $.getJSON (url, callback);
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

