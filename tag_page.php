<?php
	require 'php/config_db.php';

	$dbconn = get_db_conn();

	$selectedPhotos =  explode(",", $_GET["selPhotos"]);
	$selectionData = array();
	foreach ($selectedPhotos as &$select) {
		if($select != "") {
			$sql_photo = "SELECT * FROM photos WHERE id=".$select.";";
			$result_photo = $dbconn->query($sql_photo);

			$row = $result_photo->fetch_array();
			$photo_url = $row["url"];

			$sql_words = "SELECT DISTINCT * FROM words INNER JOIN photos_words ON words.id=photos_words.id_word WHERE photos_words.id_photo = ".$select.";";
			$result_words = $dbconn->query($sql_words);
			$words = array();
			while ($row_word = $result_words->fetch_array()) {
				array_push($words, array("id" => $row_word["id"], "word" => $row_word["word"]));
			}

			array_push($selectionData, array("id" => $select, "url" => $photo_url, "words" => $words));
		}
	}

	// Sacando las primeras palabras del diccionario
	$dictionary_words = array();
	$sql_dictionary = "SELECT DISTINCT * FROM words LIMIT 0, 100;";
	$result_dictionary = $dbconn->query($sql_dictionary);
	while ($row_dict_word = $result_dictionary->fetch_array()) {
		array_push($dictionary_words, array("id" => $row_dict_word["id"], "word" => $row_dict_word["word"]));
	}
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
	<head>
		<title>DIA CENTER - NY</title>

		<link rel="stylesheet" type="text/css" href="stylesheets/main.css">
		<link rel="stylesheet" type="text/css" href="stylesheets/admin.css">
		<link rel="stylesheet" type="text/css" href="stylesheets/jquery.jscrollpane.css">

		<script type="text/javascript" src="js/jquery-2.1.0.js"></script>
		<script type="text/javascript" src="js/jquery.jscrollpane.min.js"></script>
		<script type="text/javascript" src="js/jquery.mousewheel.js"></script>
		<script type="text/javascript" src="js/freewall.js"></script>
		<script type="text/javascript" src="js/admin_2.js"></script>
	</head>

	<body>
		<div id="dia_container">

			<!-- SEARCH BAR -->
			<div id="tools_bar">
				<div id="back">
					<button id="back_button" type="button">BACK</button>
				</div>

				<div id="dictionary_tool">
					<div id="dictionary_header">
						<div id="dictionary_title">
							<span style="position: absolute; left: 5%; top: 3px;">ENGLISH DICTIONARY</span>
						</div>
						<div id="dictionary_unfold">&or;</div>
					</div>

					<div id="dictionary_content">

						<div id="dictionary_actions">
							<div id="dictionary_all">&lt; ASSOCIATE TO ALL</div>
						</div>

						<input type="text" id="search_dictionay" onkeypress="filter_dictionary(this, event);" style="margin-top: 8px;">

						<div id="words_dictionary_container">
							<ul id="words_dictionary">
								<?php
									foreach ($dictionary_words as &$dict_word) {
										echo "<li onclick='selectDictionaryWord(this);' id-word='".$dict_word["id"]."'>".$dict_word["word"]."</li>";
									}
								?>
							</ul>
						</div>
					</div>
				</div>

			</div>

			<!-- ADMIN CONTENT -->
			<div class="admin_content">
				<div id="admin_selection">
				<?php
					foreach ($selectionData as &$data) {
						$html_str = 
						"<div class='photo_selection' id-photo='".$data["id"]."'>
							<div class='info_selection'>[".$data["id"]."]</div>
							<img src='".$data["url"]."'>

							<div class='words_photo_container'>
								<span style='font-family: sans-serif; font-size: 0.89em; margin-left: 15%;'>ASSIGNED</span>
								<input type='text' class='input_new_word' onkeypress='adding_word_press(this, event);' onkeyup='adding_word(this, event);'>

								<ul class='words_select'>";

						foreach ($data["words"] as &$word) {
							$html_str = $html_str."<li id-word='".$word["id"]."'>".$word["word"]." <span onclick='delete_word(this, event);'>[x]</span></li>";
						}

						$html_str =	$html_str."</ul></div></div>";

						echo $html_str;
					}
				?>
				</div>
			</div>
		</div>
	</body>

</html>