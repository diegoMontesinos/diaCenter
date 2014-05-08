<?php

	/*********************************************
	 *                S C R I P T                *
 	 *********************************************/

	// Retomamos o abrimos la sesion
	session_start();

	// Si el usuario no esta logeado lo mandamos a logear
	if(!isset($_SESSION["id_user"])) {
		header("location: login.php");
	} else {
		?>

<!-- ADMIN HTML -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
	<head>
		<meta charset="utf-8">
		<title>DIA CENTER - NY</title>

		<link rel="stylesheet" type="text/css" href='http://fonts.googleapis.com/css?family=Playfair+Display:400,700,900,400italic,700italic,900italic'>
		<link rel="stylesheet" type="text/css" href="stylesheets/main.css">
		<link rel="stylesheet" type="text/css" href="stylesheets/admin.css">

		<script type="text/javascript" src="js/jquery-2.1.0.js"></script>
		<script type="text/javascript" src="js/freewall.js"></script>
		<script type="text/javascript" src="js/dropzone.js"></script>
		<script type="text/javascript" src="js/admin_1.js"></script>
	</head>

	<body>
		<div id="dia_container">

			<!-- SEARCH BAR -->
			<div id="search_bar">

				<div id="search_by_id" class="dia_form">
					<span>SEARCH BY ID</span><span id="error_msg">HAY UN ERROR</span>
					<input type="text" id="search_str_id" >
					<button type="button" id="search_id_button">SEARCH</button>
				</div>

				<div id="search_by_word" class="dia_form">
					<span>SEARCH BY WORD</span>
					
					<input type="text" id="search_str_word">
					<button type="button" id="search_id_word">SEARCH</button>
				</div>

				<div id="show_all">
					<button id="show_all_button" type="button">SHOW ALL</button>
				</div>

				<div id="num_selec">0 SELECTED</div>
				<div id="got_to_tag">
					<button id="got_to_tag_button" type="button">GO TO TAG</button>
					<span id="error_msg_2">NOTHING SELECTED!</span>
				</div>

				<div id="upload_tool">
					<div id="upload_header">
						<div id="upload_title">
							<span style="position: absolute; left: 5%; top: 3px;">UPLOAD IMAGE</span>
						</div>
						<div id="upload_unfold" class="admin_unfold">
							<img src="images/toggle_1.jpeg">
						</div>
					</div>

					<div id="upload_content">
						<div id="upload_form" class="dropzone" >
						</div>

						<span id="error_msg_3">HAY UN ERROR</span>
					</div>
				</div>

				<div class="logout_container" style="margin-top: 43px; margin-left: 4%; float: left;">
					<a href="logout.php">LOGOUT</a>
				</div>
			</div>

			<!-- ADMIN CONTENT -->
			<div class="admin_content">
				<input type="hidden" id="selected_photos" value="">

				<div id="admin_options">
				</div>
			</div>

		</div>
	</body>
</html>
<!-- END ADMIN HTML -->
		<?php
	}
?>