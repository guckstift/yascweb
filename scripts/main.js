
var yasc;

$(main);

function main ()
{
	yasc = new Yasc ();
	yasc.launch ();
	
	$window.resize (onWindowResize);
	onWindowResize ();
}

function onWindowResize ()
{
	yasc.resize ([
		$window.width (),
		$window.height ()
	]);
}

