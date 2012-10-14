<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<title>Grenoble Traffic - Map</title>
<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style"
	content="black-translucent">

<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="apple-touch-icon-precomposed" href="/apple-touch-icon.png" />
<link rel="icon" type="image/png" href="favicon.ico" />


<link rel="stylesheet" href="bootstrap/css/bootstrap.css" />
<link rel="stylesheet" href="traffic.css" />

<script type="text/javascript"
	src="http://maps.googleapis.com/maps/api/js?key=AIzaSyDtbwVck1pzpdxE2ETSmv9f8pGdjtusOtE&sensor=false"></script>
<script type="text/javascript" src="traffic.js"></script>
</head>
<body onload="initialize()">
	<div class="navbar navbar-fixed-top">
		<div class="navbar-inner">
			<div class="container">
				<a class="brand" href="#">Grenoble Traffic</a>
				<ul class="nav">
					<li class="active"><a href="#">Traffic</a></li>
					<li><a href="about.jsp"><i class="icon-question-sign"></i></a></li>
				</ul>
				
				
			</div>
		</div>
	</div>
	<div id="mapCanvas" style="width: 100%; height: 100%;"></div>
</body>
</html>