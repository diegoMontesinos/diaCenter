<?php

	/*********************************************
	 *                S C R I P T                *
 	 *********************************************/
	require 'config_db.php';

	$dbconn = get_db_conn();

	if(!is_null($dbconn)) {
		if(isset($_POST["id_word"])) {

			// Primero sacamos el id de la palabra buscada
			$sql = "SELECT DISTINCT * FROM definitions WHERE id_word=".$_POST["id_word"].";";
			$result = $dbconn->query($sql);
			$definitions = array();

			while ($row = $result->fetch_array()) {
				array_push($definitions, array("id_word" => $row["id_word"], "definition" => $row["definition"]));
			}

			echo json_encode($definitions);
			if($result->num_rows != 0) {
				$result->close();
			}
		}

		mysqli_close($dbconn);
	}

?>