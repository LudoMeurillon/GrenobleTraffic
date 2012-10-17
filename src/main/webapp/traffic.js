var GrenobleTraffic = {};
GrenobleTraffic.version = 1;
GrenobleTraffic.polylines = {};

GrenobleTraffic.refreshTrafficStatus = function(trafficData){
	GrenobleTraffic.replaceText(trafficData.date);
	trafficData.features.forEach(function(feature){
		var color="#045FB4";
		var zIndex;
		switch(feature.properties.NSV_ID){
		case 1 :
			color = "#73BB02";
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
		GrenobleTraffic.drawTroncon(feature.properties.CODE,color, 0.7, 4, zIndex);
	});
	if(GrenobleTraffic.refreshDiv){
		GrenobleTraffic.refreshDiv.className='gmap-control';
	}
}

GrenobleTraffic.drawTroncon = function(code, color, opacity, weight, lineZIndex){
	var coords = GrenobleTraffic.loadCoords(code);
	var result = new google.maps.Polyline({
		path : coords,
		strokeColor : color,
		strokeOpacity : opacity,
		strokeWeight : weight,
		zIndex : lineZIndex,
		strokeWeight : weight
	});
	if(GrenobleTraffic.polylines[code]){
		//remove polyline from google map
		GrenobleTraffic.polylines[code].setMap(null);
	}
	GrenobleTraffic.polylines[code] = result;
	result.setMap(GrenobleTraffic.map);
}

GrenobleTraffic.fetchTrafficInfos = function(){
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				GrenobleTraffic.refreshTrafficStatus(JSON.parse(xhr.responseText));
			} else {
				console.log("Error: returned status code " + xhr.status + " " + xhr.statusText);
			}
		}
	};
	xhr.open("GET", "traffic", true);
	xhr.send(null);
}

GrenobleTraffic.loadCoords = function(code){
	var points = [];
	var i =0;
	var coordinatesAsString = localStorage[code];
	if(coordinatesAsString){
		var coordinates = JSON.parse(coordinatesAsString);
		for(var i=0; i<coordinates.length; i++) {
			var value = coordinates[i];
			points.push(new google.maps.LatLng(value[1], value[0]));
			i++;
		}
	}
	return points;
}

GrenobleTraffic.storeTroncon = function(troncon){
	var code = troncon.properties.CODE;
	var coordinates = troncon.geometry.coordinates[0];
	localStorage[code]=JSON.stringify(coordinates);
}

GrenobleTraffic.refreshTroncons = function(troncons) {
	localStorage["version"] = GrenobleTraffic.version;
	troncons.features.forEach(GrenobleTraffic.storeTroncon);
	GrenobleTraffic.fetchTrafficInfos();
}

GrenobleTraffic.fetchTroncons = function(){
	localStorage.clear();
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				GrenobleTraffic.refreshTroncons(JSON.parse(xhr.responseText));
			} else {
				console.log("Error: returned status code " + xhr.status+ " " + xhr.statusText);
			}
		}
	};
	xhr.open("GET", "troncons.json", true);
	xhr.send(null);
}

GrenobleTraffic.addControl = function(icon, onclick){
	var controlDiv = document.createElement('DIV');
	controlDiv.className="gmap-control-container gmnoprint";
	var controlUI = document.createElement('DIV');
	controlUI.className= 'gmap-control';
	var iconDiv = document.createElement('i');
	iconDiv.className= 'icon icon-'+icon;
	controlUI.appendChild(iconDiv);
	controlDiv.appendChild(controlUI);
	google.maps.event.addDomListener(controlUI, 'click', function() {
		controlUI.className = 'gmap-control gmap-control-active';
		onclick();
	});
	GrenobleTraffic.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
	return controlUI;
}

GrenobleTraffic.replaceText = function(text){
	GrenobleTraffic.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].clear();
	var badge = document.createElement('span');
	badge.id="lastUpdateDate";
	badge.className= 'badge badge-info';
	badge.innerText = text;
	GrenobleTraffic.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(badge);
}

GrenobleTraffic.switchTheme = function(){
	var saturationValue;
	switch(GrenobleTraffic.currentTheme){
	case "b&w":
		saturationValue = 0;
		GrenobleTraffic.currentTheme = "color";
		GrenobleTraffic.switchThemeDiv.className= 'gmap-control';
		break;
	default:
		saturationValue = -100;
		GrenobleTraffic.currentTheme = "b&w";	
		GrenobleTraffic.switchThemeDiv.className='gmap-control gmap-control-active';
	}
	GrenobleTraffic.map.setOptions({styles : [{stylers: [{saturation: saturationValue }]}]});
}

GrenobleTraffic.start = function() {
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
	    }
	};

	GrenobleTraffic.map = new google.maps.Map(document.getElementById("mapCanvas"), mapOptions);
	GrenobleTraffic.refreshDiv 		= GrenobleTraffic.addControl("refresh", GrenobleTraffic.fetchTrafficInfos);
	GrenobleTraffic.switchThemeDiv 	= GrenobleTraffic.addControl("adjust", GrenobleTraffic.switchTheme);
	GrenobleTraffic.switchTheme();
	
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(GrenobleTraffic.setPosition, GrenobleTraffic.onPositionError);
	} else {
	    console.log("No support for geolocation on this device");
	}
	
	var storedVersion = localStorage["version"];
	if(GrenobleTraffic.version != storedVersion){
		console.log("refreshing local data with new troncons from server");
		setTimeout(GrenobleTraffic.fetchTroncons,200);
	}else{
		GrenobleTraffic.fetchTrafficInfos();
	}
}

GrenobleTraffic.setPosition = function(position){
	var currentPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
	GrenobleTraffic.map.panTo(currentPosition);
	marker = new google.maps.Marker({
          map: GrenobleTraffic.map,
          icon:new google.maps.MarkerImage("marker.png", new google.maps.Size(20,28)),
          draggable:false,
          animation: google.maps.Animation.DROP,
          position: currentPosition
    });
}

GrenobleTraffic.onPositionError = function(error) {
    var info = "Error geolocating user : ";
    switch(error.code) {
	    case error.TIMEOUT:
	    	info += "timeout";
	    	break;
	    case error.PERMISSION_DENIED:
	    	info += "permission denied";
	    	break;
	    case error.POSITION_UNAVAILABLE:
	    	info += "not able to determine position";
	    	break;
	    case error.UNKNOWN_ERROR:
	    	info += "unknown error";
	    	break;
    }
   console.log(info);
}