<?php

	/*********************************************
	 *                S C R I P T                *
 	 *********************************************/
	require 'config_db.php';

	$dbconn = get_db_conn();

	if(!is_null($dbconn)) {

		$response = array(); // Esta es la respuesta

		$used_words = array(); // Palabras usadas

		// Sacamos las palabras usadas
		$sql = "SELECT DISTINCT id, word FROM words INNER JOIN photos_words ON words.id=photos_words.id_word;";
		$result = $dbconn->query($sql);

		$response["count"] = $result->num_rows;

		// Si hubo palabras
		if($result->num_rows > 0) {
			while ($row = $result->fetch_array()) {
				// Agregamos la fila a las palabras usadas
				array_push($used_words, array("id_word" => $row["id"], "word" => $row["word"]));
			}
		}

		// Agregamos las palabras usadas al array de respuesta
		$response["used_words"] = $used_words;		

		// Respondemos
		echo json_encode($response);
	}
?>
