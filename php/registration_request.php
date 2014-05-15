<?php

	/*********************************************
	 *                S C R I P T                *
 	 *********************************************/

	require "config_db.php";
	require "php_mailer/PHPMailerAutoload.php";

	$dbconn = get_db_conn();
	$abc = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	$signs = "!#$%&=?+";
	$nums = "0123456789";

	if(!is_null($dbconn)) {
		if(isset($_POST["firstname"]) && isset($_POST["lastname"]) && isset($_POST["mail"])) {

			// Verificamos que el mail no sea de un usuario
			$sql = "SELECT * FROM users WHERE email='".$_POST["mail"]."';";
			$result = $dbconn->query($sql);
			if($result->num_rows > 0) {
				// Ya existe el correo
			} else {
				/* USERNAME GENERATION */
				$firstname = strtolower(trim($_POST["firstname"]));
				$lastname = ucfirst(strtolower(trim($_POST["lastname"])));
				$new_username = $firstname{0}.$lastname;

				$name = trim($_POST["firstname"])." ".trim($_POST["lastname"]);

				/* PASSWORD GENERATION */
				// Abc
				$new_pass = "".$abc{rand(0, strlen($abc))};
				$new_pass = $new_pass.$abc{rand(0, strlen($abc))};
				// Signs
				$new_pass = $new_pass.$signs{rand(0, strlen($signs))};
				// Nums
				$new_pass = $new_pass.$nums{rand(0, strlen($nums))};
				$new_pass = $new_pass.$nums{rand(0, strlen($nums))};
				$new_pass = $new_pass.$nums{rand(0, strlen($nums))};
				$new_pass = $new_pass.$nums{rand(0, strlen($nums))};
				// Sign
				$new_pass = $new_pass.$signs{rand(0, strlen($signs))};

				// Metemos la info a la base de datos
				$sql = "INSERT INTO users(name, email, user, password, permissions) VALUES('".$name."', '".$_POST["mail"]."', '".$new_username."', '".$new_pass."', 2);";
				$result = $dbconn->query($sql);

				// Preparamos el correo
				$mailer = new PHPMailer;
				$mailer->SMTPAuth   = true;
				$mailer->SMTPSecure = 'tls';
				$mailer->Host       = "smtp.gmail.com";
				$mailer->Mailer     = "smtp";
				$mailer->Port       = 587;
				$mailer->Username   = "diegoa.montesinos@gmail.com";
				$mailer->Password   = "BlackBeat20";
				$mailer->IsHTML(true);

				$mailer->From     = "diegoa.montesinos@gmail.com";
				$mailer->FromName = "Dia Center";
				$mailer->addAddress($_POST["mail"]);

				$mailer->Subject = "Thank you for registration!";
				$mailer->Body    = "Username: ".$new_username."<br>Password: ".$new_pass;

				if(!$mailer->send()) {	
					exit;
				}
			}
		}
	}

?>