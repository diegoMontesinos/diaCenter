<?php

	/*********************************************
	 *                S C R I P T                *
 	 *********************************************/
	require 'config_db.php';

	$dbconn = get_db_conn();

	if(!is_null($dbconn)) {

		$sql = "SELECT * FROM words ORDER BY RAND() LIMIT 1;";
		$result = $dbconn->query($sql);
		$row_word = $result->fetch_array();

		$result->close();
		
		echo json_encode($row_word);

		mysqli_close($dbconn);
	}

?>