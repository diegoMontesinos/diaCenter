<?php

	/*********************************************
	 *                S C R I P T                *
 	 *********************************************/
	require 'config_db.php';

	$ds = DIRECTORY_SEPARATOR;
	$storeFolder = "photos";

	$dbconn = get_db_conn();
	 
	if (!empty($_FILES) && !is_null($dbconn)) {

		// Preparamos el nombre del archivo
		$tempFile = $_FILES["photo"]["tmp_name"];
		$targetPath = dirname(dirname(__FILE__)).$ds.$storeFolder.$ds;
		$targetFile = $targetPath.$_FILES["photo"]["name"];

		// Checamos que no exista aun
		if (file_exists($targetFile)) {
			echo "file_exists";
		} else {
			// Guarda la foto donde va
			move_uploaded_file($tempFile, $targetFile);

			// Guardamos la foto en la base de datos
			$sql = "INSERT INTO `photos`(`url`) VALUES ('".$storeFolder.$ds.$_FILES["photo"]["name"]."');";
			$result = $dbconn->query($sql);

			// Obtenemos el id asignado
			$sql = "SELECT * FROM photos WHERE url='".$storeFolder.$ds.$_FILES["photo"]["name"]."';";
			$result = $dbconn->query($sql);
			$row = $result->fetch_array();

			echo $row["id"];

			$result->close();
		}

		mysqli_close($dbconn);
	}

?>