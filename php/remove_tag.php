<?php

	/*********************************************
	 *                S C R I P T                *
 	 *********************************************/

	// Iniciamos conexion con la base de datos
	$dbconn = pg_connect("host=localhost dbname=diaCenter user=postgres password=123456789");
	//$dbconn = pg_connect("dbname=laborarc_diaCenter user=laborarc password={Colaborar1881}");

	$response = array(); // Esta es la respuesta

	$sql_images = "SELECT * FROM images;";
	$result_images = pg_query($dbconn, $sql_images);
	$nrows_images = pg_numrows($result_images);

	$row_image;
	$image_id;
	$image_path;
	for($ri = 0; $ri < $nrows_images; $ri++) {
		$row_image = pg_fetch_array($result_images, $ri);

		$image_id = $row_image["id"];
		$image_path = "images/".$row_image["path"];

		$sql_words = "SELECT DISTINCT word FROM words INNER JOIN relation ON words.id=relation.id_word WHERE relation.id_image = ".$image_id.";";
		$result_words = pg_query($dbconn, $sql_words);
		$nrows_words = pg_numrows($result_words);

		$row_word;
		$words = array();
		for($rj = 0; $rj < $nrows_words; $rj++) {
			$row_word = pg_fetch_array($result_words, $rj);

			array_push($words, $row_word["word"]);
		}

		array_push($response, array("id" => $image_id, "path" => $image_path, "words" => $words));
	}

	echo json_encode($response);
	
?>