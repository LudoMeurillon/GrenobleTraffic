<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
<link rel="icon" type="image/png" href="favicon.ico">
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

.gmap-control-container {
    margin: 5px;
}
.gmap-control {
    cursor: pointer;
    background-color: -moz-linear-gradient(center top , #FEFEFE, #F3F3F3);
    background-color: #FEFEFE;
    border: 1px solid #A9BBDF;
    border-radius: 2px;
    padding: 0px 6px 0px 6px;
    line-height: 160%;
    font-size: 12px;
    font-family: Arial,sans-serif;
    box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.35);
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;
}
.gmap-control:hover {
    border: 1px solid #678AC7;
}
.gmap-control-active {
    background-color: -moz-linear-gradient(center top , #6D8ACC, #7B98D9);
    background-color: #6D8ACC;
    color: #fff;
    font-weight: bold;
    border: 1px solid #678AC7;
}
</style>
<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key=AIzaSyDtbwVck1pzpdxE2ETSmv9f8pGdjtusOtE&sensor=false">
</script>
<script type="text/javascript">
	var map;
	var refreshDiv;
	var version = 1;
	
	function refreshTrafficStatus(trafficData){
		trafficData.features.forEach(function(feature){
			var color="#045FB4";
			var lineSymbol;
			switch(feature.properties.NSV_ID){
			case 1 :
				color = "#73BB02";break;
			case 2 :
				color = "#FFBF00";break;
			case 3 :
				color = "#DD1717";
				lineSymbol= {path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW};
				break;
			}
			drawTroncon(feature.properties.CODE,color, 0.7, 3, lineSymbol);
		});
		if(refreshDiv){
			refreshDiv.className='gmap-control';
		}
	}
	
	function drawTroncon(code, color, opacity, weight, lineSymbol){
		var coords = loadCoords(code);
		
		if(lineSymbol){
			var result = new google.maps.Polyline({
				path : coords,
				strokeColor : color,
				strokeOpacity : opacity,
				strokeWeight : weight,
				icons: [{icon: lineSymbol, offset: '100%'}]
			});
		}else{
			var result = new google.maps.Polyline({
				path : coords,
				strokeColor : color,
				strokeOpacity : opacity,
				strokeWeight : weight
			});
		}
		result.setMap(map);
	}
	
	function fetchTrafficInfos(){
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
	
	function storeTroncon(troncon){
		var code = troncon.properties.CODE;
		var coordinates = troncon.geometry.coordinates[0];
		
		for(var i=0; i<coordinates.length; i++) {
			storeCoord(code, coordinates);
		}
	}

	function refreshTroncons(troncons) {
		localStorage["version"] = version;
		troncons.features.forEach(storeTroncon);
		fetchTrafficInfos();
	}
	
	function fetchTroncons(){
		localStorage.clear();
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					refreshTroncons(JSON.parse(xhr.responseText));
				} else {
					console.log("Error: returned status code " + xhr.status+ " " + xhr.statusText);
				}
			}
		};
		xhr.open("GET", "troncons.json", true);
		xhr.send(null);
	}
	
	function addControl(text, onclick){
		var controlDiv = document.createElement('DIV');
		controlDiv.className="gmap-control-container gmnoprint";
		var controlUI = document.createElement('DIV');
		controlUI.className= 'gmap-control';
		controlUI.innerText = text;
		controlDiv.appendChild(controlUI);
		google.maps.event.addDomListener(controlUI, 'click', function() {
			controlUI.className = 'gmap-control gmap-control-active';
			onclick();
		});
		map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlDiv);
		return controlUI;
	}
	
	function initialize() {
		var mapOptions = {
			center : new google.maps.LatLng(45.182037,5.727654),
			zoom : 13,
			overviewMapControl : true,
			mapTypeId : google.maps.MapTypeId.ROADMAP
		};
		map = new google.maps.Map(document.getElementById("map_canvas"),
				mapOptions);

		refreshDiv = addControl("Refresh",function(){
			fetchTrafficInfos();
		});
		
		var storedVersion = 0;
		if(localStorage["version"]){
			storedVersion = localStorage["version"];
		}
		if(version != storedVersion){
			setTimeout(fetchTroncons,200);
		}else{
			fetchTrafficInfos();
		}
	}
</script>
</head>
<body onload="initialize()">
	<div id="map_canvas" style="width: 100%; height: 100%"></div>
</body>
</html>