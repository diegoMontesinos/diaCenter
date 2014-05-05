<?php
	
	require 'php/config_db.php';

	function verify_credentials($user, $password) {
		$dbconn = get_db_conn();
		$credentials = array();

		if(!is_null($dbconn)) {
			// Checamos que el usuario exista
			$sql = "SELECT * FROM users WHERE user='".$user."';";
			$result = $dbconn->query($sql);

			if($result->num_rows > 0) {
				// Si existe verificamos su password
				$sql = "SELECT * FROM users WHERE user='".$user."' AND password='".$password."';"; 
				$result = $dbconn->query($sql);

				// Si existe las credenciales son correctas
				if($result->num_rows > 0) {
					$row = $result->fetch_array();
					$credentials = array("status" => 2, "id_user" => $row[0]);

					$result->close();
				} else {
					$credentials = array("status" => 1);
				}
			} else {
				// Si no notificamos
				$credentials = array("status" => 0);
			}
			mysqli_close($dbconn);
		} else {
			$credentials = array("status" => -1);
		}

		return $credentials;
	}

	/*********************************************
	 *                S C R I P T                *
	*********************************************/

	if(isset($_POST["login"])) {
		$credentials = verify_credentials($_POST["user"], $_POST["password"]);

		if($credentials["status"] == 2) { // Codigo de exito
			// Creamos la sesion con el id
			session_start();
			$_SESSION["id_user"] = $credentials["id_user"];

			header("location: admin.php"); 
		}
	}
?>

<!-- LOGIN HTML -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
	<head>
		<meta charset="utf-8">
		<title>DIA CENTER - NY</title>

		<link rel="stylesheet" type="text/css" href='http://fonts.googleapis.com/css?family=Playfair+Display:400,700,900,400italic,700italic,900italic'>
		<link rel="stylesheet" type="text/css" href="stylesheets/main.css">

	</head>

	<body>
		<div id="dia_container" align="center">
			<div style="width: 24%; height: 195px; background: #FFF; margin-top: 140px; border: 1px solid #000;" align="left">
				<form action="" method="post" class="dia_form">
					<div style="margin-top: 60px; margin-left: 18%;">
						<label>USERNAME: </label>
						<input name="user" type="text" style="width: 49%; margin-left: 3%;">
					</div>

					<div style="margin-top: 8px; margin-left: 18%;">
						<label>PASSWORD: </label>
						<input name="password" type="password" style="width: 49%; margin-left: 3%;">
					</div> 

					<div style="margin-top: 8px; margin-left: 66%;">
						<input name="login" type="submit" value="LOGIN">
					</div> 
				</form>
			</div>
		</div>

		<?php
			if(isset($credentials)) {
				if($credentials["status"] == 2) { // Codigo de exito
				}		
			}
		?>
	</body>
</html>