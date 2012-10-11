<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
<style type="text/css">
html {
	height: 100%
}

body {
	height: 100%;
	margin: 0;
	padding: 0
}

#map_canvas {
	height: 100%
}
</style>
<script type="text/javascript"
	src="http://maps.googleapis.com/maps/api/js?key=AIzaSyDtbwVck1pzpdxE2ETSmv9f8pGdjtusOtE&sensor=false">
	
</script>
<script type="text/javascript">
	var map;
	var tempResult;
	
	function addCoord(value){
		tempResult.push(new google.maps.LatLng(value[1], value[0]));
	}
	
	function drawTroncon(troncon){
		tempResult = [];
		troncon.geometry.coordinates[0].forEach(addCoord);
		var result = new google.maps.Polyline({
			path : tempResult,
			strokeColor : "#FF0000",
			strokeOpacity : 1.0,
			strokeWeight : 2
		});
	
		result.setMap(map);
	}

	function draw(troncons) {
		troncons.features.forEach(drawTroncon);
	}

	function initialize() {
		var mapOptions = {
			center : new google.maps.LatLng(45.184166, 5.715542),
			zoom : 12,
			mapTypeId : google.maps.MapTypeId.ROADMAP
		};
		map = new google.maps.Map(document.getElementById("map_canvas"),
				mapOptions);

		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					draw(JSON.parse(xhr.responseText));
				} else {
					window.alert("Error: returned status code " + xhr.status
							+ " " + xhr.statusText);
				}
			}
		};
		xhr.open("GET", "troncons.json", true);
		xhr.send(null);

	}
</script>
</head>
<body onload="initialize()">
	<div id="map_canvas" style="width: 100%; height: 100%"></div>
</body>
</html>