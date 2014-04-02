<?php

	/*********************************************
	 *                S C R I P T                *
 	 *********************************************/
	require 'config_db.php';

	$dbconn = get_db_conn();

	if(!is_null($dbconn)) {
		if(isset($_POST["filter_str"])) {
			$sql = "SELECT * FROM  `words` WHERE word LIKE '".$_POST["filter_str"]."%';";
			$result = $dbconn->query($sql);

			$response = array();
			if($result->num_rows != 0) {
				while ($row = $result->fetch_array()) {
					$word_id = $row["id"];
					$word_str = $row["word"];

					array_push($response, array("id" => $word_id, "word" => $word_str));
				}
			}

			echo json_encode($response);
			$result->close();
		}

		mysqli_close($dbconn);
	}

?>