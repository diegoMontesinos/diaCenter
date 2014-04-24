<?php
	/*********************************************
	 *                S C R I P T                *
 	 *********************************************/
	require 'config_db.php';

	$dbconn = get_db_conn();

	if(!is_null($dbconn)) {
		$response = array(); // Esta es la respuesta

		if(isset($_POST["word"])) {
			// Primero sacamos el id de la palabra
			$sql = "SELECT DISTINCT * FROM words WHERE word='".$_POST["word"]."';";
			$result = $dbconn->query($sql);

			if($result->num_rows == 0) {
				echo json_encode($response);
			} else {
				$row_word = $result->fetch_array();
				$id_word = $row_word["id"];

				$sql = "SELECT DISTINCT * FROM photos INNER JOIN photos_words ON photos.id=photos_words.id_photo WHERE photos_words.id_word=".$id_word.";";
				$result = $dbconn->query($sql);
				while ($row = $result->fetch_array()) {
					$photo_id = $row["id"];
					$photo_url = $row["url"];

					$sql_count = "SELECT COUNT(*) FROM photos_words WHERE id_photo = ".$photo_id.";";
					$result_count = $dbconn->query($sql_count);
					$row_count = $result_count->fetch_array();

					array_push($response, array("id" => $photo_id, "url" => $photo_url, "count" => $row_count[0]));
				}

				echo json_encode($response);
				if($result->num_rows == 0) {
					$result->close();
				}
			}
		}

		mysqli_close($dbconn);
	}
?>