<?php

	/*********************************************
	 *                S C R I P T                *
 	 *********************************************/
	require 'config_db.php';

	$dbconn = get_db_conn();

	if(!is_null($dbconn)) {
		if(isset($_POST["word"])) {
			// Verificamos si la palabra ya existe
			$sql = "SELECT DISTINCT * FROM words WHERE word='".$_POST["word"]."';";
			$result = $dbconn->query($sql);

			if($result->num_rows == 0) {
				echo "false";
			} else {
				echo "true";
			}
		} else {
			echo "false";
		}

		mysqli_close($dbconn);
	} else {
		echo "false";
	}

?>