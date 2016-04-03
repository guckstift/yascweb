
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
		Math.max (0, $window.width () - 256),
		$window.height ()
	]);
}

