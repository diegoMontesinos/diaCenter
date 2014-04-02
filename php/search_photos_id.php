<?php

	function get_photo_by_id($id, $dbconn) {
		$sql = "SELECT * FROM photos WHERE id=".$id.";";
		$result = $dbconn->query($sql);

		return $result;
	}

	function get_photos_interval($a, $b, $dbconn) {
		$sql = "SELECT * FROM photos LIMIT ".$a.", ".$b.";";
		$result = $dbconn->query($sql);

		return $result;	
	}

	/*********************************************
	 *                S C R I P T                *
 	 *********************************************/
	require 'config_db.php';

	$dbconn = get_db_conn();

	if(!is_null($dbconn)) {
		$response = array(); // Esta es la respuesta

		if($_POST["single"] != "") {
			$result = get_photo_by_id($_POST["single"], $dbconn);

			while ($row = $result->fetch_array()) {
				$photo_id = $row["id"];
				$photo_url = $row["url"];

				array_push($response, array("id" => $photo_id, "url" => $photo_url));
			}

			$result->close();
		}

		if($_POST["list"] != "") {
			$list_elems = explode(",", $_POST["list"]);

			foreach ($list_elems as &$elem) {
				$result = get_photo_by_id($elem, $dbconn);

				while ($row = $result->fetch_array()) {
					$photo_id = $row["id"];
					$photo_url = $row["url"];

					array_push($response, array("id" => $photo_id, "url" => $photo_url));
				}

				$result->close();
			}

		}

		if($_POST["interval"] != "") {
			$interval_elems = explode("-", $_POST["interval"]);
			$a = 0 + $interval_elems[0];
			$b = 0 + $interval_elems[1];

			$result = get_photos_interval($a - 1, $b - $a + 1, $dbconn);

			while ($row = $result->fetch_array()) {
				$photo_id = $row["id"];
				$photo_url = $row["url"];

				array_push($response, array("id" => $photo_id, "url" => $photo_url));
			}

			$result->close();
		}

		echo json_encode($response);

		mysqli_close($dbconn);
	}
?>
