<?php

	/*********************************************
	 *                S C R I P T                *
 	 *********************************************/
	require 'config_db.php';

	$dbconn = get_db_conn();

	if(!is_null($dbconn)) {
		if(isset($_POST["word"])) {

			// Primero sacamos el id de la palabra buscada
			$sql = "SELECT DISTINCT * FROM words WHERE word='".$_POST["word"]."'";
			$result = $dbconn->query($sql);
			$synonyms = array();

			if($result->num_rows > 0) {
				$row = $result->fetch_array();

				$sql = "SELECT DISTINCT * FROM words INNER JOIN synonyms ON words.id=synonyms.id_word2 WHERE synonyms.id_word1 = ".$row["id"].";";
				$result = $dbconn->query($sql);
				while ($row = $result->fetch_array()) {
					array_push($synonyms, array("id" => $row["id"], "word" => $row["word"]));
				}
				$result->close();
			}

			echo json_encode($synonyms);
		}

		mysqli_close($dbconn);
	}

?>