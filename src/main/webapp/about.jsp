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
	<div class="navbar navbar-static-top">
		<div class="navbar-inner">
			<div class="container">
				<a class="brand" href="#">Grenoble Traffic</a>
				<ul class="nav">
					<li><a href="index.jsp">Traffic</a></li>
					<li><a href="#"><i class="icon-question-sign"></i></a></li>
				</ul>
			</div>
		</div>
	</div>
	<div class="container">
		<h3>What is it ?</h3>
		<p>Grenoble Traffic is a very simple way to watch traffic evolution in Grenoble area.</p>
		<h3>Where the data come from ?</h3>
		<p>For now, all traffic and geographic data come from <a href="http://stationmobile.fr">Station Mobile</a> website. Maps and controls come from Google MAps Javascript API</p>
		<h3>How is it done ?</h3>
		<p>Developed with Java/Twitter Bootstrap, build with CloudBees and Run on AppEngine</p>
		<p>More dev stuff to come here</p>
		<h3>Who did it ?</h3>
		<p><a href="http://twitter.com/LudoMeurillon">@LudoMeurillon</a></p>
	</div>
	
</body>
</html>