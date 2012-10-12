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
	var version = 1;
	
	function refreshTrafficStatus(trafficData){
		console.log("content="+trafficData);
		trafficData.features.forEach(function(feature){
			var color="#045FB4";
			switch(feature.properties.NSV_ID){
			case 1 :
				color = "#73BB02";break;
			case 2 :
				color = "#FFBF00";break;
			case 3 :
				color = "#DD1717";break;
			}
			doDrawTroncon(feature.properties.CODE,color,1.0, 3);
		});
	}
	
	function startTrafficRefresh(){
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					refreshTrafficStatus(JSON.parse(xhr.responseText));
				} else {
					window.alert("Error: returned status code " + xhr.status
							+ " " + xhr.statusText);
				}
			}
		};
		xhr.open("GET", "traffic", true);
		xhr.send(null);
	}
	
	function storeCoord(code, value){
		localStorage[code]=JSON.stringify(value);
	}
	
	function loadCoords(code){
		var array = [];
		var i =0;
		var coordinatesAsString = localStorage[code];
		if(coordinatesAsString){
			var coordinates = JSON.parse(coordinatesAsString);
			for(var i=0; i<coordinates.length; i++) {
				var value = coordinates[i];
				array.push(new google.maps.LatLng(value[1], value[0]));
				i++;
			}
		}
		return array;
	}
	
	function doDrawTroncon(code, color, opacity, weight){
		var coords = loadCoords(code);
		var result = new google.maps.Polyline({
			path : coords,
			strokeColor : color,
			strokeOpacity : opacity,
			strokeWeight : weight
		});
		result.setMap(map);
	}
	
	function drawTroncon(troncon){
		doDrawTroncon(troncon.properties.CODE, "#AAAAAA", 0.7, 1);
	}
	
	function storeTroncon(troncon){
		var code = troncon.properties.CODE;
		var coordinates = troncon.geometry.coordinates[0];
		
		for(var i=0; i<coordinates.length; i++) {
			storeCoord(code, coordinates);
		}
	}

	function draw(troncons) {
		troncons.features.forEach(storeTroncon);
		/*
		setTimeout(function(){
			troncons.features.forEach(drawTroncon);
		},1000);
		*/
		drawTraffic();
	}
	
	function updateTroncons(){
		localStorage.clear();
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					draw(JSON.parse(xhr.responseText));
					localStorage["version"] = version;
				} else {
					window.alert("Error: returned status code " + xhr.status
							+ " " + xhr.statusText);
				}
			}
		};
		xhr.open("GET", "troncons.json", true);
		xhr.send(null);
	}
	
	function drawTraffic(){
		startTrafficRefresh();
	}

	function initialize() {
		var mapOptions = {
			center : new google.maps.LatLng(45.182037,5.727654),
			zoom : 13,
			mapTypeId : google.maps.MapTypeId.ROADMAP
		};
		map = new google.maps.Map(document.getElementById("map_canvas"),
				mapOptions);
		var trafficLayer = new google.maps.TrafficLayer();
		trafficLayer.setMap(map);
		
		var storedVersion = 0;
		if(localStorage["version"]){
			storedVersion = localStorage["version"];
		}
		if(version != storedVersion){
			setTimeout(updateTroncons,200);
		}else{
			drawTraffic();
		}
	}
</script>
</head>
<body onload="initialize()">
	<div id="map_canvas" style="width: 100%; height: 100%"></div>
</body>
</html>