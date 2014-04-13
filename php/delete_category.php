<?php

	/*********************************************
	 *                S C R I P T                *
 	 *********************************************/
	require 'config_db.php';

	$dbconn = get_db_conn();

	if(!is_null($dbconn)) {
		if(isset($_POST["id_category"])) {

			// Eliminamos todas las asociaciones con las palabras
			$sql_words_category = "DELETE FROM `categories_words` WHERE id_category=".$_POST["id_category"].";";
			$result = $dbconn->query($sql_words_category);

			// Eliminamos la categoria
			$sql_words_category = "DELETE FROM `categories` WHERE id=".$_POST["id_category"].";";
			$result = $dbconn->query($sql_words_category);

			echo $_POST["id_category"];

			mysqli_close($dbconn);
		}
	}
?>