var map;
var refreshDiv;
var version = 1;
var polylines = {}; 

function refreshTrafficStatus(trafficData){
	replaceText(trafficData.date);
	trafficData.features.forEach(function(feature){
		var color="#045FB4";
		var lineSymbol;
		var zIndex;
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
		drawTroncon(feature.properties.CODE,color, 0.7, 4, lineSymbol, zIndex);
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
			strokeWeight : weight,
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
	map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
	return controlUI;
}

function replaceText(text){
	map.controls[google.maps.ControlPosition.BOTTOM_CENTER].clear();
	var badge = document.createElement('span');
	badge.id="lastUpdateDate";
	badge.className= 'badge badge-info';
	badge.innerText = text;
	map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(badge);
}

function initialize() {
	var mapOptions = {
		center : new google.maps.LatLng(45.182037,5.727654),
		zoom : 13,
		overviewMapControl : false,
		mapTypeId : google.maps.MapTypeId.ROADMAP,
		panControl: false,
		streetViewControl: false,
		mapTypeControl:false,
		mapTypeControlOptions: {
		      position: google.maps.ControlPosition.RIGHT_BOTTOM
	    },
	    zoomControlOptions:{
	    	position:google.maps.ControlPosition.RIGHT_CENTER
	    },
		styles : [
	      {
	        stylers: [
	          { saturation: -100 }
	        ]
	      }
	    ]};

	map = new google.maps.Map(document.getElementById("mapCanvas"), mapOptions);
	refreshDiv = addControl("Refresh",function(){
		fetchTrafficInfos();
	});
	
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(setPosition, onPositionError);
	} else {
	  console.log("No support for geolocation on this device");
	}
	
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

function setPosition(position){
	var currentPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
	map.panTo(currentPosition);
	marker = new google.maps.Marker({
          map:map,
          draggable:false,
          animation: google.maps.Animation.DROP,
          position: currentPosition
    });
}

function onPositionError(error) {
    var info = "Erreur lors de la gŽolocalisation : ";
    switch(error.code) {
	    case error.TIMEOUT:
	    	info += "Timeout !";
	    	break;
	    case error.PERMISSION_DENIED:
	    	info += "Vous nÕavez pas donnŽ la permission";
	    	break;
	    case error.POSITION_UNAVAILABLE:
	    	info += "La position nÕa pu tre dŽterminŽe";
	    	break;
	    case error.UNKNOWN_ERROR:
	    	info += "Erreur inconnue";
	    	break;
    }
   console.log(info);
}