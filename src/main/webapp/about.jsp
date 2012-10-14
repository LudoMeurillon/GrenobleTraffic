<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<title>Grenoble Traffic - About</title>
	<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
	
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
	<link rel="apple-touch-icon-precomposed" href="/apple-touch-icon.png" />
	<link rel="icon" type="image/png" href="favicon.ico" />
	
	
	<link rel="stylesheet" href="bootstrap/css/bootstrap.css" />
</head>
<body onload="initialize()">
	<div class="container navbar navbar-fixed-top">
		<div class="navbar-inner">
			<a class="brand" style="padding-left: 40px;" href="index.jsp">Grenoble Traffic</a>
			<ul class="nav">
				<li><a href="index.jsp">Traffic</a></li>
				<li><a href="#"><i class="icon-question-sign"></i></a></li>
			</ul>
		</div>
	</div>
	<div class="container" style="margin-top:40px;">
		<div class="row">
			<div class="span6">
				<h4>What is it ?</h4>
			</div>
		</div>
		<div class="row">
			<div class="span5 offset1">
				<p>Grenoble Traffic is a very simple way to watch traffic evolution in Grenoble area.</p>
			</div>
		</div>
		<div class="row">
			<div class="span6">
				<h4>Where the data come from ?</h4>
			</div>
		</div>
		<div class="row">
			<div class="span5 offset1">
				<p>For now, all traffic and geographic data come from <img src="http://www.stationmobile.fr/images/structure/logo_station-mobile.png" class="img-circle" style="height:30px"/><a href="http://stationmobile.fr">Station Mobile</a> website.</p>
				<p>Maps and controls come from Google Maps Javascript API</p>
			</div>
		</div>
		<div class="row">
			<div class="span6">
				<h4>How is it done ?</h4>
			</div>
		</div>
		<div class="row">
			<div class="span5 offset1">
				<p>Developed with Java/Twitter Bootstrap, build with CloudBees and Run on AppEngine</p>
				<p>More dev stuff to come here</p>
			</div>
		</div>
		<div class="row">
			<div class="span6">
				<h4>Who did it ?</h4>
			</div>
		</div>
		<div class="row">
			<div class="span5 offset1">
				<p><a href="http://twitter.com/LudoMeurillon">@LudoMeurillon</a></p>
			</div>
		</div>
	</div>
</body>
</html>