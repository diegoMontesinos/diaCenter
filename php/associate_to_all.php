<?php

	/*********************************************
	 *                S C R I P T                *
 	 *********************************************/
	require 'config_db.php';

	$dbconn = get_db_conn();

	if(!is_null($dbconn)) {
		if(isset($_POST["selec_photos"]) && isset($_POST["word"])) {

			// Verificamos si la palabra ya existe
			$sql = "SELECT DISTINCT * FROM words WHERE word='".$_POST["word"]."';";
			$result = $dbconn->query($sql);

			$id_word = "-1";
			if($result->num_rows == 0) {
				// Si no existe la guardamos y obtenemos su id
				$sql = "INSERT INTO `words`(`word`) VALUES ('".$_POST["word"]."');";
				$result = $dbconn->query($sql);

				$sql = "SELECT DISTINCT * FROM words WHERE word='".$_POST["word"]."';";
				$result = $dbconn->query($sql);
			}

			// Si existe obtenemos su id
			$row_word = $result->fetch_array();
			$id_word = $row_word["id"];
			
			// Guardamos las relaciones
			$ids_photos = explode(",", $_POST["selec_photos"]);
			foreach ($ids_photos as &$id_ph) {
				if($id_ph != "") {
					$sql = "INSERT INTO `photos_words`(`id_photo`, `id_word`) VALUES (".$id_ph.", ".$id_word.");";
					$result = $dbconn->query($sql);
				}
			}

			// Devolvemos la palabra
			echo json_encode($_POST["word"]);
		}

		mysqli_close($dbconn);
	}

?>