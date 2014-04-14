<?php

	/*********************************************
	 *                S C R I P T                *
 	 *********************************************/
	require 'config_db.php';

	$dbconn = get_db_conn();

	if(!is_null($dbconn)) {
		if(isset($_POST["id_category"])) {
			$response = array(); // Esta es la respuesta

			$sql_words = "SELECT DISTINCT * FROM words INNER JOIN categories_words ON words.id=categories_words.id_word WHERE categories_words.id_category = ".$_POST["id_category"].";";
			$result_words = $dbconn->query($sql_words);
			while ($row_word = $result_words->fetch_array()) {
				array_push($response, array("id" => $row_word["id"], "word" => $row_word["word"]));
			}

			echo json_encode($response);

			$result_words->close();
		}

		mysqli_close($dbconn);
	}

?>