<?php
	
	/*********************************************
	 *                S C R I P T                *
 	 *********************************************/
	require 'config_db.php';

	$dbconn = get_db_conn();

	if(!is_null($dbconn)) {
		if(isset($_POST["category"])) {

			// INSERTAMOS LA CATEGORIA
			$sql = "INSERT INTO `categories`(`title`) VALUES ('".$_POST["category"]."');";
			$result = $dbconn->query($sql);

			$sql = "SELECT * FROM `categories` WHERE title='".$_POST["category"]."';";
			$result = $dbconn->query($sql);

			$row = $result->fetch_array();

			// Devolvemos la categoria
			echo json_encode(array("id" => $row["id"], "category" => $_POST["category"]));

			mysqli_close($dbconn);
		}
	}

?>