<?php

	/*********************************************
	 *                S C R I P T                *
 	 *********************************************/
	require 'config_db.php';

	$dbconn = get_db_conn();

	if(!is_null($dbconn)) {
		if(isset($_POST["id_category"]) && isset($_POST["id_word"])) {
			
			$sql = "DELETE FROM `categories_words` WHERE id_category=".$_POST["id_category"]." AND id_word=".$_POST["id_word"].";";
			$result = $dbconn->query($sql);

			echo "ok";
		}
	}

?>