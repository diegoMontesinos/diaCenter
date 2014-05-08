<?php
	/*********************************************
	 *                S C R I P T                *
 	 *********************************************/
	require 'config_db.php';

	$dbconn = get_db_conn();

	$response = array(); // Esta es la respuesta
	$successful_words = array();
	$unsuccessful_words = array();

	if(!is_null($dbconn)) {
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

		mysqli_close($dbconn);
	}

	$response = array("successful_words" => $successful_words, "unsuccessful_words" => $unsuccessful_words);
	echo json_encode($response);
?>