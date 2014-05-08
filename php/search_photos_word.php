<?php
	/*********************************************
	 *                S C R I P T                *
 	 *********************************************/
	require 'config_db.php';

	$dbconn = get_db_conn();

	if(!is_null($dbconn)) {
		$response = array(); // Esta es la respuesta
		$photos = array();
		$successful_words = array();
		$unsuccessful_words = array();

		if(isset($_POST["word"]) && isset($_POST["register"])) {
			$successful = -1; // Variable que nos dira si tuvo exito o no

			// Primero sacamos el id de la palabra
			$sql = "SELECT DISTINCT * FROM words WHERE word='".$_POST["word"]."';";
			$result = $dbconn->query($sql);

			// No existe la palabra
			if($result->num_rows > 0) {
				$successful = 0;
				$row_word = $result->fetch_array();
				$id_word = $row_word["id"];

				$sql = "SELECT DISTINCT * FROM photos INNER JOIN photos_words ON photos.id=photos_words.id_photo WHERE photos_words.id_word=".$id_word.";";
				$result = $dbconn->query($sql);
				if($result->num_rows > 0) {
					$successful = 1; // Tuvo exito
				}

				// Iteramos el resultado
				while ($row = $result->fetch_array()) {
					$photo_id = $row["id"];
					$photo_url = $row["url"];

					$sql_count = "SELECT COUNT(*) FROM photos_words WHERE id_photo = ".$photo_id.";";
					$result_count = $dbconn->query($sql_count);
					$row_count = $result_count->fetch_array();

					array_push($photos, array("id" => $photo_id, "url" => $photo_url, "count" => $row_count[0]));
				}
			}

			// Insertamos dependiendo si tuvo exito o no y si me dijeron que lo insertara
			if($_POST["register"] == "true") {
				$now = date('Y-m-d H:i:s', time());
				if($successful == 1) {
					$sql = "INSERT INTO successful_words VALUES('".$_POST["word"]."', '".$now."');";
				} else if($successful == 0) {
					$sql = "INSERT INTO unsuccessful_words VALUES('".$_POST["word"]."', '".$now."');";
				}
				$result = $dbconn->query($sql);
			}

			// Consultamos las dos listas de palabras
			// Exitosos
			$sql = "SELECT * FROM successful_words ORDER BY timestamp DESC LIMIT 0, 20;";
			$result = $dbconn->query($sql);
			while ($row = $result->fetch_array()) {
				array_push($successful_words, $row["word"]);
			}

			// No exitosos
			$sql = "SELECT * FROM unsuccessful_words ORDER BY timestamp DESC LIMIT 0, 20;";
			$result = $dbconn->query($sql);
			while ($row = $result->fetch_array()) {
				array_push($unsuccessful_words, $row["word"]);
			}
		}

		// Agregamos todos los arreglos
		$response = array("photos" => $photos, "successful_words" => $successful_words, "unsuccessful_words" => $unsuccessful_words);

		echo json_encode($response);
		mysqli_close($dbconn);
	}
?>