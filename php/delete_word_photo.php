<?php

	/*********************************************
	 *                S C R I P T                *
 	 *********************************************/
	require 'config_db.php';

	$dbconn = get_db_conn();

	if(!is_null($dbconn)) {
		if(isset($_POST["idphoto"]) && isset($_POST["idword"])) {
			
			$sql = "DELETE FROM `photos_words` WHERE id_photo=".$_POST["idphoto"]." AND id_word=".$_POST["idword"].";";
			$result = $dbconn->query($sql);

			echo "ok";
		}
	}

?>