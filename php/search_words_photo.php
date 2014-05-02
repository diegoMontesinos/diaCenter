<?php

	/*********************************************
	 *                S C R I P T                *
 	 *********************************************/
	require 'config_db.php';

	$dbconn = get_db_conn();

	if(!is_null($dbconn)) {
		$response = array(); // Esta es la respuesta

		if(isset($_POST["id_photo"])) {

			$sql = "SELECT DISTINCT * FROM words INNER JOIN photos_words ON words.id=photos_words.id_word WHERE photos_words.id_photo = ".$_POST["id_photo"].";";
			$result = $dbconn->query($sql);
			$words = array();
			while ($row = $result->fetch_array()) {
				array_push($words, array("id" => $row["id"], "word" => $row["word"]));
			}

			echo json_encode($words);
			if($result->num_rows == 0) {
				$result->close();
			}
		}

		mysqli_close($dbconn);
	}

?>