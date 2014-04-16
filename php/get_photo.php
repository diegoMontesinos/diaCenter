<?php

	/*********************************************
	 *                S C R I P T                *
 	 *********************************************/
	require 'config_db.php';

	$dbconn = get_db_conn();
	 
	if (isset($_POST["id_photo"]) && !is_null($dbconn)) {
		$sql = "SELECT * FROM photos WHERE id=".$_POST["id_photo"].";";
		$result = $dbconn->query($sql);
		$row = $result->fetch_array();

		echo json_encode(array("id" => $row["id"], "url" => $row["url"]));

		$result->close();
		mysqli_close($dbconn);
	}

?>