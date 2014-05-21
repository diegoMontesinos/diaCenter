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
		<link rel="stylesheet" type="text/css" href="stylesheets/jquery.jscrollpane.css">

		<script type="text/javascript" src="js/jquery-2.1.0.js"></script>
		<script type="text/javascript" src="js/jquery.jscrollpane.min.js"></script>
		<script type="text/javascript" src="js/jquery.mousewheel.js"></script>
		<script type="text/javascript" src="js/freewall.js"></script>
		<script type="text/javascript" src="js/dropzone.js"></script>
		<script type="text/javascript" src="js/admin_1.js"></script>
	</head>

	<body>
		<div id="dia_container">

			<!-- SEARCH BAR -->
			<div id="search_bar">

				<div style="width: 100%; height: 83px; float: left;">
					<!-- BUSQUEDA POR ID -->
					<div id="search_by_id" class="dia_form">
						<span style="float: left; position: relative;">SEARCH BY ID</span>
						<span id="error_msg">HAY UN ERROR</span><br>

						<input style="float: left; position: relative;" type="text" id="search_str_id" >
						<button style="width: 23%; padding: 0; margin-left: 1%; margin-top: 3px; font-family: 'Playfair Display', serif; overflow: hidden;" id="search_id_button">SEARCH</button>
					</div>

					<!-- BUSQUEDA POR PALABRAS -->
					<div id="search_by_word" class="dia_form">
						<span style="float: left; position: relative;">SEARCH BY WORD</span><br>
						
						<input style="float: left; position: relative;" type="text" id="search_str_word">
						<button style="width: 23%; padding: 0; margin-left: 1%; margin-top: 3px; font-family: 'Playfair Display', serif; overflow: hidden;" type="button" id="search_id_word" style="width: 23%; padding: 0;">SEARCH</button>
					</div>

					<!-- BUSQUEDA POR TODOS -->
					<div id="show_all">
						<button style="width: 90%; padding: 0; margin-left: 1%; margin-top: 3px; font-family: 'Playfair Display', serif; overflow: hidden;" id="show_all_button" type="button">SHOW ALL</button>
					</div>

					<!-- SELECCIONADOS -->
					<div id="num_selec">0 SELECTED</div>

					<!-- IR A TAGEAR -->
					<div id="got_to_tag">
						<button id="got_to_tag_button" type="button">GO TO TAG</button>
						<span id="error_msg_2">NOTHING SELECTED!</span>
					</div>

					<!-- SUBIR IMAGENES -->
					<div id="upload_tool">
						<div id="upload_header">
							<div id="upload_title">
								<span style="position: absolute; left: 5%; top: 0px;">UPLOAD IMAGE</span>
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

					<!-- SALIR -->
					<div class="logout_container" style="margin-top: 43px; margin-left: 4%; float: left; position: relative; display: inline-block;">
						<a href="logout.php">LOGOUT</a>
					</div>

				</div>

				<div style="width: 100%; height: 32px; float: left;">

					<!-- PALABRAS USADAS -->
					<div id="used_tool">
						<div id="used_header">
							<div id="used_title">
								<span style="position: absolute; left: 5%; top: 0px;">USED WORDS</span>
							</div>
							<div id="used_unfold" class="admin_unfold">
								<img src="images/toggle_1.jpeg">
							</div>
						</div>

						<div id="used_content">
							<input type="text" id="filter_used" style="margin-top: 8px; margin-left: 3%;">
							<br>
							<span id="count_used" style="margin-left: 3%;">99999 USED WORDS:</span>
							<ul id="used_words"></ul>
							<br>
							<span id="no_used">NO RESULTS</span>
						</div>
					</div>
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