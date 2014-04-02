<?php

	/*********************************************
	 *                S C R I P T                *
 	 *********************************************/
	require 'config_db.php';

	$dbconn = get_db_conn();

	if(!is_null($dbconn)) {
		$response = array(); // Esta es la respuesta

		//$sql_images = "SELECT * FROM photos LIMIT ".$_POST["from"].", ".$_POST["nRows"].";";
		$sql_images = "SELECT * FROM photos;";
		$result_photos = $dbconn->query($sql_images);

		while ($row_photo = $result_photos->fetch_array()) {
			$photo_id = $row_photo["id"];
			$photo_url = $row_photo["url"];

			array_push($response, array("id" => $photo_id, "url" => $photo_url));
		}

		echo json_encode($response);

		$result_photos->close();
		mysqli_close($dbconn);
	}
?>
