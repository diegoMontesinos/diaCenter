<?php

	/*********************************************
	 *                S C R I P T                *
 	 *********************************************/
	require 'config_db.php';

	$dbconn = get_db_conn();

	if(!is_null($dbconn)) {
		if(isset($_POST["id_category"]) && isset($_POST["word"])) {

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
			
			// Guardamos la relacion
			$sql = "INSERT INTO `categories_words`(`id_category`, `id_word`) VALUES (".$_POST["id_category"].", ".$id_word.");";
			$result = $dbconn->query($sql);

			$response = array("id" => $id_word, "word" => $_POST["word"]); // Esta es la respuesta

			// Devolvemos la palabra con su id
			echo json_encode($response);

			mysqli_close($dbconn);
		}
	}

?>