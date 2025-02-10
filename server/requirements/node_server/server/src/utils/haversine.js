

function haversine(pos1, pos2)
{
	const earth_radius = 6378000;
	const radius = (n) => n  * (Math.PI / 180);

	pos1[0] = radius(pos1[0]);
	pos1[1] = radius(pos1[1]);
	pos2[0] = radius(pos2[0]);
	pos2[1] = radius(pos2[1]);

	const distance =  2 * earth_radius * Math.asin(
		Math.sqrt(
			Math.pow(Math.sin((pos2[0] - pos1[0]) / 2), 2)
			+ ((Math.cos(pos1[0]) * Math.cos(pos2[0]))
			* Math.pow(Math.sin((pos2[1] - pos1[1]) / 2), 2))
		)
	)

	console.log(`distance : ${(distance / 1000).toFixed(2)} km`);
}

haversine([45.649563, 0.144134], [47.412006, 2.921693]);