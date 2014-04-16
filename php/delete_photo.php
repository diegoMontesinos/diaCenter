<?php

	/*********************************************
	 *                S C R I P T                *
 	 *********************************************/

	require 'config_db.php';

	$dbconn = get_db_conn();
	$ds = DIRECTORY_SEPARATOR;

	if(!is_null($dbconn) && isset($_POST["id_photo"])) {

		// Obtenemos la foto para el url
		$sql = "SELECT * FROM photos WHERE id=".$_POST["id_photo"].";";
		$result = $dbconn->query($sql);
		$row = $result->fetch_array();

		// Preparamos el nombre y borramos el archivo
		$targetPath = dirname(dirname(__FILE__)).$ds;
		$targetFile = $targetPath.$row["url"];
		if(unlink($targetFile)) {
			// Borramos la foto de la base de datos
			$sql = "DELETE FROM photos WHERE id=".$_POST["id_photo"].";";
			$result = $dbconn->query($sql);

			// Borramos las asociaciones
			$sql = "DELETE FROM photos_words WHERE id_photo=".$_POST["id_photo"].";";
			$result = $dbconn->query($sql);

			echo json_encode("ok");
		}

		mysqli_close($dbconn);
	}

?>