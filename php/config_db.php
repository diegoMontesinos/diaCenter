<?php

	function get_db_conn() {
		// Iniciamos conexion con la base de datos
		// Create connection
		$dbconn = mysqli_connect("localhost", "root", "", "diacenter");

		// Check connection
		if (mysqli_connect_errno()) {
		  echo "Failed to connect to MySQL: " . mysqli_connect_error();
		  $dbconn = NULL;
		}

		return $dbconn;
	}
	
?>