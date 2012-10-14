var map;
var refreshDiv;
var version = 1;
var polylines = {}; 

function refreshTrafficStatus(trafficData){
	trafficData.features.forEach(function(feature){
		var color="#045FB4";
		var lineSymbol;
		var zIndex = 10;
		switch(feature.properties.NSV_ID){
		case 1 :
			color = "#73BB02";break;
			zIndex = 100;
			break;
		case 2 :
			color = "#FFBF00";
			zIndex = 50;
			break;
		case 3 :
			color = "#DD1717";
			zIndex = 25;
			break;
		case 4 :
			color = "#000000"
			zIndex = 10;
			break;
		}
		drawTroncon(feature.properties.CODE,color, 0.7, 3, lineSymbol, zIndex);
	});
	if(refreshDiv){
		refreshDiv.className='gmap-control';
	}
}

function drawTroncon(code, color, opacity, weight, lineSymbol, lineZIndex){
	var coords = loadCoords(code);
	
	if(lineSymbol){
		var result = new google.maps.Polyline({
			path : coords,
			strokeColor : color,
			strokeOpacity : opacity,
			strokeWeight : weight,
			zIndex : lineZIndex,
			icons: [{icon: lineSymbol, offset: '100%'}]
		});
	}else{
		var result = new google.maps.Polyline({
			path : coords,
			strokeColor : color,
			strokeOpacity : opacity,
			zIndex : lineZIndex,
			strokeWeight : weight
		});
	}
	if(polylines[code]){
		polylines[code].setMap(null);
	}
	polylines[code] = result;
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