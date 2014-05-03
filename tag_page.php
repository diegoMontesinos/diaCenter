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

	$categories = array();
	$sql_categories = "SELECT DISTINCT * FROM categories;";
	$result_categories = $dbconn->query($sql_categories);
	while($row_category = $result_categories->fetch_array()) {
		array_push($categories, array("id" => $row_category["id"], "title" => $row_category["title"]));
	}
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
	<head>
		<title>DIA CENTER - NY</title>

		<link rel="stylesheet" type="text/css" href='http://fonts.googleapis.com/css?family=Playfair+Display:400,700,900,400italic,700italic,900italic'>
		<link rel="stylesheet" type="text/css" href="stylesheets/main.css">
		<link rel="stylesheet" type="text/css" href="stylesheets/admin.css">
		<link rel="stylesheet" type="text/css" href="stylesheets/jquery.jscrollpane.css">

		<script type="text/javascript" src="js/jquery-2.1.0.js"></script>
		<script type="text/javascript" src="js/jquery.jscrollpane.min.js"></script>
		<script type="text/javascript" src="js/jquery.mousewheel.js"></script>
		<script type="text/javascript" src="js/freewall.js"></script>
		<script type="text/javascript" src="js/jquery.elevateZoom-3.0.8.min.js"></script>
		<script type="text/javascript" src="js/admin_2.js"></script>
	</head>

	<body>
		<div id="dia_container">

			<!-- SEARCH BAR -->
			<div id="tools_bar">
				
				<div id="back">
					<button id="back_button" type="button">BACK</button>
				</div>

				<!-- SINONIMOS -->
				<div id="synonyms_tool">
					
					<div id="synonyms_header">
						<div id="synonyms_title">
							<span style="position: absolute; left: 5%; top: 3px;">SYNONYMS</span>
						</div>
						<div id="synonyms_unfold">&or;</div>
					</div>

					<div id="synonyms_content">
						
						<div id="synonyms_actions">
							<div id="synonyms_one">&lt; ASSIGN TO
								<div id="synonyms_one_wrapper">
									<div id="synonyms_one_conatiner">
										<ul id="synonyms_one_options">
											<?php
												foreach ($selectionData as &$data) {
													echo "<li onclick='associate_synonyms_one(this);' id-photo='".$data["id"]."'>".$data["id"]."</li>";
												}
											?>
										</ul>
									</div>
								</div>
							</div>

							<div id="synonyms_all">&lt; ASSIGN TO ALL</div>
						</div>

						<input type="text" id="synonyms_input" onkeypress="typing_input(this, event);" onkeyup="searching_synonyms(this, event);" style="margin-top: 8px; margin-left: 3%;">

						<div id="synonyms_container">
							<div id="no_synonyms">NO SYNONYMS FOUNDED</div>
							<ul id="synonyms"></ul>
						</div>

					</div>
				</div>

				<!-- ASIGNA TODO -->
				<div id="assign_all_tool">
					<div id="assign_all_header">
						<div id="assign_all_title">
							<span style="position: absolute; left: 5%; top: 3px;">ASSIGN TO ALL</span>
						</div>
						<div id="assign_all_unfold">&or;</div>
					</div>

					<div id="assign_all_content">
						<input type="text" id="assign_all_input" onkeypress="typing_input(this, event);" onkeyup="adding_word_all(this, event);" style="margin-top: 8px; margin-left: 3%;">
					</div>
				</div>

				<!-- DICCIONARIO -->
				<div id="dictionary_tool">
					<div id="dictionary_header">
						<div id="dictionary_title">
							<span style="position: absolute; left: 5%; top: 3px;">ENGLISH DICTIONARY</span>
						</div>
						<div id="dictionary_unfold">&or;</div>
					</div>

					<div id="dictionary_content">
						<div id="dictionary_actions">
							<div id="dictionary_one">&lt; ASSIGN TO
								<div id="dictionary_one_wrapper">
									<div id="dictionary_one_conatiner">
										<ul id="dictionary_one_options">
											<?php
												foreach ($selectionData as &$data) {
													echo "<li onclick='associate_dictionary_one(this);' id-photo='".$data["id"]."'>".$data["id"]."</li>";
												}
											?>
										</ul>
									</div>
								</div>
							</div>

							<div id="dictionary_all">&lt; ASSIGN TO ALL</div>
						</div>

						<input type="text" id="search_dictionay" onkeypress="filter_dictionary(this, event);" style="margin-top: 8px; margin-left: 3%;">

						<div id="words_dictionary_container">
							<ul id="words_dictionary">
								<?php
									foreach ($dictionary_words as &$dict_word) {
										echo "<li onclick='select_dictionary_word(this);' word='".$dict_word["word"]."' id-word='".$dict_word["id"]."'>".$dict_word["word"]." <span class='definition_mark' onclick='show_definition(this, event);'>?</span></li>";
									}
								?>
							</ul>
						</div>
					</div>
				</div>

				<!-- CATEGORIAS -->
				<div id="categories_tool">
					<div id="categories_header">
						<div id="categories_title">
							<span style="position: absolute; left: 5%; top: 3px;">CATEGORIES</span>
						</div>
						<div id="categories_unfold">&or;</div>
					</div>

					<div id="categories_content">
						<div id="categories_actions">
							<div id="categories_one">&lt; ASSIGN TO
								<div id="categories_one_wrapper">
									<div id="categories_one_conatiner">
										<ul id="categories_one_options">
											<?php
												foreach ($selectionData as &$data) {
													echo "<li onclick='associate_category_one(this);' id-photo='".$data["id"]."'>".$data["id"]."</li>";
												}
											?>
										</ul>
									</div>
								</div>
							</div>

							<div id="categories_all">&lt; ASSIGN TO ALL</div>
						</div>

						<input type="text" id="add_category" onkeypress="typing_input(this, event);" onkeyup="adding_category(this, event);" style="margin-top: 8px; margin-left: 3%;">

						<div id="categories_container">
							<ul id="categories">
								<?php
									foreach ($categories as $category) {
										echo "<li onclick='select_category(this);' id-category='".$category["id"]."' category='".$category["title"]."'>".$category["title"]."<span style='margin-left: 5%;' onclick='delete_category(this, event);'> [x]</span></li>";
									}
								?>
							</ul>
						</div>

						<input type="text" id="add_category_word" onkeypress="typing_input(this, event);" onkeyup="adding_word_category(this, event);" style="margin-top: 8px; margin-left: 3%;">

						<div id="categories_words_container">
							<ul id="categories_words"></ul>
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
							<img class='photo_img' src='".$data["url"]."' data-zoom-image='".$data["url"]."' />

							<div class='words_photo_container'>
								<span style=\"font-family: 'Playfair Display', serif; font-size: 0.89em; margin-left: 15%;\">ASSIGNED</span>
								<input type='text' class='input_new_word' onkeypress='typing_input(this, event);' onkeyup='adding_word_photo(this, event);' play='0' />
								<div class='play_button'>
									<img src='images/shuffle.png' style='width: 69%; height: 19px; margin-left: 13%; margin-top: 2px;' />
								</div>

								<ul class='words_select'>";

						foreach ($data["words"] as &$word) {
							$html_str = $html_str."<li id-word='".$word["id"]."' word='".$word["word"]."'>".$word["word"]." <span style='margin-left: 4%;' onclick='delete_word_photo(this, event);'>[x]</span></li>";
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