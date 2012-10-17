var GrenobleTraffic = {};
GrenobleTraffic.version = 2;
GrenobleTraffic.tronconsByCode = [];
GrenobleTraffic.tronconsJsonFile = "troncons.json";

GrenobleTraffic.common = {};
GrenobleTraffic.common.getJson = function(resource, onSuccess){
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				onSuccess(JSON.parse(xhr.responseText));
			} else {
				console.log("Error: returned status code " + xhr.status + " " + xhr.statusText);
			}
		}
	};
	xhr.open("GET", resource, true);
	xhr.send(null);
}

GrenobleTraffic.stationmobile = {};
GrenobleTraffic.stationmobile.refreshStationMobile = function(){
	var storedVersion = localStorage["version"];
	if(GrenobleTraffic.version != storedVersion){
		console.log("refreshing local data with new troncons from server");
		setTimeout(GrenobleTraffic.stationmobile.fetchTroncons,200);
	}else{
		GrenobleTraffic.stationmobile.fetchTrafficInfos();
	}
}

GrenobleTraffic.stationmobile.fetchTrafficInfos = function(){
	GrenobleTraffic.common.getJson("traffic", function(json){
		GrenobleTraffic.graphic.refreshTrafficStatus(json);
	})
}

GrenobleTraffic.stationmobile.fetchTroncons = function(){
	localStorage.clear();
	GrenobleTraffic.common.getJson(GrenobleTraffic.tronconsJsonFile, function(json){
		localStorage["version"] = GrenobleTraffic.version;
		localStorage[GrenobleTraffic.tronconsJsonFile] = JSON.stringify(json);
		GrenobleTraffic.fetchTrafficInfos();
	})
}

GrenobleTraffic.stationmobile.readTroncons = function(){
	var troncons = JSON.parse(localStorage[GrenobleTraffic.tronconsJsonFile]);
	if(troncons){
		for(var i=0;i<troncons.features.length;i++){
			GrenobleTraffic.tronconsByCode[troncons.features[i].properties.CODE] = troncons.features[i].geometry.coordinates[0];
		}
	}
}

GrenobleTraffic.graphic = {};
GrenobleTraffic.graphic.polylines = {};

GrenobleTraffic.graphic.drawTroncon = function(code, color, opacity, weight, lineZIndex){
	var coords = GrenobleTraffic.graphic.loadCoords(code);
	var result = new google.maps.Polyline({
		path : coords,
		strokeColor : color,
		strokeOpacity : opacity,
		strokeWeight : weight,
		zIndex : lineZIndex,
		strokeWeight : weight
	});
	if(GrenobleTraffic.graphic.polylines[code]){
		//remove polyline from google map
		GrenobleTraffic.graphic.polylines[code].setMap(null);
	}
	GrenobleTraffic.graphic.polylines[code] = result;
	result.setMap(GrenobleTraffic.graphic.map);
}

GrenobleTraffic.graphic.loadCoords = function(code){
	var points = [];
	var i =0;
	var coordinates = GrenobleTraffic.tronconsByCode[code];
	if(coordinates){
		for(var i=0; i<coordinates.length; i++) {
			var value = coordinates[i];
			points.push(new google.maps.LatLng(value[1], value[0]));
			i++;
		}
	}
	return points;
}

GrenobleTraffic.graphic.refreshTrafficStatus = function(trafficData){
	GrenobleTraffic.graphic.replaceText(trafficData.date);
	GrenobleTraffic.stationmobile.readTroncons();
	trafficData.features.forEach(function(feature){
		var color="#045FB4";
		switch(feature.properties.NSV_ID){
		case 1 :
			color = "#73BB02";
			break;
		case 2 :
			color = "#FFBF00";
			break;
		case 3 :
			color = "#DD1717";
			break;
		case 4 :
			color = "#000000"
			break;
		}
		GrenobleTraffic.graphic.drawTroncon(feature.properties.CODE,color, 0.7, 4, feature.properties.NSV_ID);
	});
	if(GrenobleTraffic.graphic.refreshDiv){
		GrenobleTraffic.graphic.refreshDiv.className='gmap-control';
	}
}

GrenobleTraffic.graphic.createIcon = function(icon, onclick){
	var controlUI = document.createElement('DIV');
	controlUI.className= 'gmap-control';
	var iconDiv = document.createElement('i');
	iconDiv.className= 'icon icon-'+icon;
	controlUI.appendChild(iconDiv);
	google.maps.event.addDomListener(controlUI, 'click', function() {
		controlUI.className = 'gmap-control gmap-control-active';
		onclick();
	});
	return controlUI;
}

GrenobleTraffic.graphic.initControls = function(){
	GrenobleTraffic.graphic.refreshDiv 		= GrenobleTraffic.graphic.createIcon("refresh", GrenobleTraffic.stationmobile.fetchTrafficInfos);
	GrenobleTraffic.graphic.switchThemeDiv 	= GrenobleTraffic.graphic.createIcon("adjust", GrenobleTraffic.graphic.switchTheme);
	
	var trafficControls = document.createElement('DIV');
	trafficControls.className="gmap-control-container gmnoprint";
	trafficControls.appendChild(GrenobleTraffic.graphic.refreshDiv);
	trafficControls.appendChild(GrenobleTraffic.graphic.switchThemeDiv);
	GrenobleTraffic.graphic.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(trafficControls);
	GrenobleTraffic.graphic.setPositionDiv 	= GrenobleTraffic.graphic.createIcon("map-marker", GrenobleTraffic.geolocation.refreshPosition);
	
	var geolocationControls = document.createElement('DIV');
	geolocationControls.className="gmap-control-container gmnoprint";
	geolocationControls.appendChild(GrenobleTraffic.graphic.setPositionDiv);
	GrenobleTraffic.graphic.map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(geolocationControls);
}

GrenobleTraffic.graphic.replaceText = function(text){
	GrenobleTraffic.graphic.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].clear();
	var badge = document.createElement('span');
	badge.id="lastUpdateDate";
	badge.className= 'badge badge-info';
	badge.innerText = text;
	GrenobleTraffic.graphic.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(badge);
}

GrenobleTraffic.graphic.switchTheme = function(){
	var saturationValue;
	switch(GrenobleTraffic.graphic.currentTheme){
	case "b&w":
		saturationValue = 0;
		GrenobleTraffic.graphic.currentTheme = "color";
		GrenobleTraffic.graphic.switchThemeDiv.className= 'gmap-control';
		break;
	default:
		saturationValue = -100;
		GrenobleTraffic.graphic.currentTheme = "b&w";	
		GrenobleTraffic.graphic.switchThemeDiv.className='gmap-control gmap-control-active';
	}
	GrenobleTraffic.graphic.map.setOptions({styles : [{stylers: [{saturation: saturationValue }]}]});
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

	GrenobleTraffic.graphic.map = new google.maps.Map(document.getElementById("mapCanvas"), mapOptions);
	GrenobleTraffic.graphic.initControls();
	GrenobleTraffic.graphic.switchTheme();
	
	GrenobleTraffic.geolocation.refreshPosition();
	GrenobleTraffic.stationmobile.refreshStationMobile();
}

GrenobleTraffic.geolocation = {};
GrenobleTraffic.geolocation.refreshPosition = function(){
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(GrenobleTraffic.geolocation.setPosition, GrenobleTraffic.geolocation.onPositionError);
	} else {
	    console.log("No support for geolocation on this device");
	}
	GrenobleTraffic.graphic.setPositionDiv.className = 'gmap-control';
}

GrenobleTraffic.geolocation.setPosition = function(position){
	var currentPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
	GrenobleTraffic.graphic.map.panTo(currentPosition);
	if(!GrenobleTraffic.graphic.marker){
		GrenobleTraffic.graphic.marker = new google.maps.Marker({
	          map: GrenobleTraffic.graphic.map,
	          icon:new google.maps.MarkerImage("marker.png", new google.maps.Size(20,28)),
	          draggable:false,
	          animation: google.maps.Animation.DROP,
	          position: currentPosition
	    });
	}
	GrenobleTraffic.graphic.marker.setPosition(currentPosition);
}

GrenobleTraffic.geolocation.onPositionError = function(error) {
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