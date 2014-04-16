
///////////////////////////////////////////
//               F O T O S               //
///////////////////////////////////////////

var wall;
var pageSize = 20;
var photo_count = 0;
var upload_unfold = false;
Dropzone.autoDiscover = false;

/*
 * load_photos:
 */
function load_photos(from, nRows) {
	// Hacemos la peticion por las fotos
	$.ajax({
		type: "POST",
		url: "php/get_photos.php",
		data: {
			"from": from,
			"nRows": nRows
		},
		dataType: "json",
		success: function(data) {
			$("#admin_options").empty();
			$("#num_selec").html($(".photo_selec").length + " SELECTED");

			for (var i = 0; i < data.length; i++) {
				var div_photo = generate_div_photo(data[i].id); // Se crea el div

				// Se le agrega la foto
				var img = new Image();
				img.src = data[i].url;
				$(div_photo).append(img);

				$("#admin_options").append(div_photo); // Se agrega a las opciones
			}

			correct_wall();
		}
	});
}

/*
 * delete_photo:
 */
function delete_photo(div_elem) {
	// Obtenemos el div de la foto
	var div_selection = $(div_elem).parent().parent();

	// Obtenemos el div del id
	var id_photo = $(div_selection).attr("id-photo");

	// Mandamos a borrar
	$.ajax({
		type: "POST",
		url: "php/delete_photo.php",
		data: { "id_photo": id_photo },
		dataType: "json",
		success: function(data) {
			// Pregunta si estaba seleccionada
			if($(div_selection).hasClass("photo_selec")) {

				// Quitamos que esta seleccionado
				var selected_photos = $(".photo_selec");
				var aux = "";
				for (var i = 0; i < selected_photos.length; i++) {
					if(selected_photos[i] != div_selection) {
						aux = aux + $(this).attr("id-photo") + ",";
					}
				}
				$("#selected_photos").val(aux);
				$(div_selection).removeClass("photo_selec");
				$("#num_selec").html($(".photo_selec").length + " SELECTED");
			}

			// Lo quitamos
			$(div_selection).remove();
			wall.refresh();
		}
	});
}

/*
 * generate_div_photo:
 */
function generate_div_photo(id_photo) {
	// Crea el div, se le asigna click y clase
	var div_photo = document.createElement("div");
	$(div_photo).addClass("photo_option");
	$(div_photo).click(function(event) {
		select_photo(this);
	});

	// Crea el div de la info
	var div_info = document.createElement("div");
	$(div_info).addClass("info_option");

	var div_id = document.createElement("div");
	$(div_id).css({ "position" : "relative", "float" : "left" });
	$(div_id).html("[ " + id_photo + " ]");
	$(div_info).append(div_id);
	
	var div_delete = document.createElement("div");
	$(div_delete).addClass("delete_photo");
	$(div_delete).html("[ x ]");
	$(div_delete).click(function(event) {
		event.preventDefault();
		event.stopPropagation();

		delete_photo(event.toElement);
	});
	$(div_info).append(div_delete);

	$(div_photo).append(div_info);
	$(div_photo).attr("id-photo", id_photo);

	return div_photo;
}

/*
 * correct_wall:
 */
function correct_wall() {
	// Configura el wall para hacerle reset
	wall.reset({
		selector: '.photo_option',
		animate: true,
		cellW: 250,
		cellH: 'auto',
		onResize: function() {
			wall.fitWidth();
		}
	});

	// Corregimos tamanos
	var images = wall.container.find('.photo_option');
	var length = images.length;
	images.css({visibility: 'hidden'});
	images.find('img').load(function() {
		-- length;
		if (!length) {
			setTimeout(function() {
				images.css({visibility: 'visible'});
				wall.fitWidth();
			}, 505);
		}
	});
}

/*
 * select_photo:
 */
function select_photo(div_elem) {
	// Estilo
	if($(div_elem).hasClass("photo_selec")) {
		$(div_elem).removeClass("photo_selec");
	} else {
		$(div_elem).addClass("photo_selec");
	}

	// Información
	$("#num_selec").html($(".photo_selec").length + " SELECTED");
	$("#selected_photos").val("");
	$(".photo_selec").each(function(index) {
		var aux = $("#selected_photos").val();
		$("#selected_photos").val(aux + $(this).attr("id-photo") + ",");
	});
}

///////////////////////////////////////////
//          S E A R C H   B A R          //
///////////////////////////////////////////

/*
 * search_photos_id:
 */
function search_photos_id(search_string) {
	// Validamos toda la cadena
	if(!validate_search(search_string)) {
		show_error_msg("BADLY FORMED QUERY");

		return;
	}

	// Obtenemos el intervalo y lo validamos
	var interval = get_interval(search_string);
	if(interval != "") {
		if(!validate_interval(interval)) {
			show_error_msg("BADLY FORMED INTERVAL");

			return;		
		}
	}

	// Obtenemos la lista y lo validamos
	var list = get_list(search_string);
	if(list != "") {
		if(!validate_list(list)) {
			show_error_msg("BADLY FORMED LIST");

			return;
		}
	}

	// Obtenemos el solito
	var single = get_single(search_string);

	// Mandamos a buscar
	$.ajax({
		type: "POST",
		url: "php/search_photos_id.php",
		data: {
			"single": single,
			"list": list,
			"interval": interval
		},
		dataType: "json",
		success: function(data) {
			// Vaciamos las opciones
			$("#admin_options").empty();
			$("#num_selec").html($(".photo_selec").length + " SELECTED");

			if(data.length == 0) {
				// Si no hubo resultados lo informamamos
				var div_empty = document.createElement("div");
				$(div_empty).attr("id", "empty_info");
				$(div_empty).html("NO SEARCH RESULTS");

				$("#admin_options").append(div_empty);
			} else {
				var ids = new Object(); // Auxiliar para repetidos
				for (var i = 0; i < data.length; i++) {
					// Evitamos poner algo que ya pusimos
					if(ids[data[i].id] == undefined) {
						var div_photo = generate_div_photo(data[i].id);

						// Se le agrega la foto
						var img = new Image();
						img.src = data[i].url;
						$(div_photo).append(img);

						$("#admin_options").append(div_photo); // Se agrega a las opciones
						ids[data[i].id] = true; // Marcamos que ya la agregamos
					}
				}

				correct_wall();
			}
		}
	});
}

/*
 * search_photos_word:
 */
function search_photos_word(search_string) {
	// Si es valida la cadena
	if(search_string != "") {
		$.ajax({
			type: "POST",
			url: "php/search_photos_word.php",
			data: {
				"word": search_string
			},
			dataType: "json",
			success: function(data) {
				// Vaciamos las opciones
				$("#admin_options").empty();
				$("#num_selec").html($(".photo_selec").length + " SELECTED");

				if(data.length == 0) {
					// Si no hubo resultados lo informamamos
					var div_empty = document.createElement("div");
					$(div_empty).attr("id", "empty_info");
					$(div_empty).html("NO SEARCH RESULTS");

					$("#admin_options").append(div_empty);
				} else {
					var ids = new Object(); // Auxiliar para repetidos
					for (var i = 0; i < data.length; i++) {
						// Evitamos poner algo que ya pusimos
						if(ids[data[i].id] == undefined) {
							var div_photo = generate_div_photo(data[i].id);

							// Se le agrega la foto
							var img = new Image();
							img.src = data[i].url;
							$(div_photo).append(img);

							$("#admin_options").append(div_photo); // Se agrega a las opciones
							ids[data[i].id] = true; // Marcamos que ya la agregamos
						}
					}

					correct_wall();
				}
			}
		});
	}
}

/*
 * validate_search:
 */
function validate_search(search_str) {
	if(search_str == "") {
		return false;
	}

	var aux = clean_all(search_str, " ");
	aux = clean_all(aux, ",");
	aux = clean_all(aux, "-");

	if(isNaN(Number(aux))) {
		return false;
	} else {
		var elems_search = search_str.split(" ");

		if(elems_search.length > 3) {
			return false
		} else {
			var single = 0, interval = 0, list = 0;
			for (var i = 0; i < elems_search.length; i++) {
				if(!isNaN(Number(elems_search[i]))) {
					single++;
				}
				if(elems_search[i].lastIndexOf("-") != -1) {
					interval++;
				}
				if(elems_search[i].lastIndexOf(",") != -1) {
					list++;
				}
			}

			if(single > 1 || interval > 1 || list > 1) {
				return false;
			}
		}
	}

	return true;
}

/*
 * get_interval:
 */
function get_interval(search_str) {
	var elems_search = search_str.split(" ");
	for (var i = 0; i < elems_search.length; i++) {
		if(elems_search[i].lastIndexOf("-") != -1) {
			return elems_search[i];
		}
	}

	return "";
}

/*
 * validate_interval:
 */
function validate_interval(interval) {
	var inteval_elems = interval.split("-");
	if(inteval_elems.length != 2) {
		return false;
	} else {
		var a = inteval_elems[0];
		var b = inteval_elems[1];

		if(isNaN(Number(a)) || isNaN(Number(b))) {
			return false;
		} else {
			if(Number(a) > Number(b)) {
				return false;
			}
		}
	}

	return true;
}

/*
 * get_list:
 */
function get_list(search_str) {
	var elems_search = search_str.split(" ");
	for (var i = 0; i < elems_search.length; i++) {
		if(elems_search[i].lastIndexOf(",") != -1) {
			return elems_search[i];
		}
	}

	return "";
}

/*
 * validate_list:
 */
function validate_list(list) {
	var list_elems = list.split(",");
	for (var i = 0; i < list_elems.length; i++) {
		if(list_elems[i] == "") {
			return false;
		}
	}

	return true;
}

/*
 * get_single:
 */
function get_single(search_str) {
	var elems_search = search_str.split(" ");
	for (var i = 0; i < elems_search.length; i++) {
		if(!isNaN(Number(elems_search[i]))) {
			return elems_search[i];
		}
	}

	return "";	
}

///////////////////////////////////////////
//           F U N C I O N E S           //
//          A U X I L I A R E S          //
///////////////////////////////////////////

/*
 * show_error_msg:
 */
function show_error_msg(error_text) {
	$("#error_msg").html(error_text);

	$("#error_msg").show();
	setTimeout(function() {
		$("#error_msg").hide();
	}, 3000);
}

/*
 * clean_all:
 */
function clean_all(str, target) {
	var aux = str;
	while(aux.lastIndexOf(target) != -1) {
		aux = aux.replace(target, "");
	}
	return aux;
}

/****************************
 ***      M  A  I  N      ***
 ****************************/

$(function() {
	// Oculta todos los mensajes
	$("#error_msg").hide();
	$("#error_msg_2").hide();
	$("#error_msg_3").hide();

	// Creamos el wall
	wall = new freewall("#admin_options");

	// Mandamos a cargar las fotos
	load_photos(photo_count, pageSize);

	// Evento de buscar por id
	$("#search_str_id").keypress(function(event) {
		if(event.keyCode == 13) {
			var search_string = $(this).val();
			search_photos_id(search_string);
		}
	});

	// Evento de buscar por palabra
	$("#search_str_word").keypress(function(event) {
		if(event.keyCode == 32) {
			event.preventDefault();
			event.stopPropagation();
			return;
		}
		if(event.keyCode == 13) {
			var search_string = $(this).val();
			search_photos_word(search_string);
		}
	});

	// Boton de buscar id
	$("#search_id_button").on("click", function(event) {
		var search_string = $("#search_str_id").val();
		search_photos_id(search_string);
	});

	// Boton de buscar palabra
	$("#search_id_word").on("click", function(event) {
		var search_string = $("#search_str_word").val();
		search_photos_word(search_string);
	});

	// Boton de mostrar todos
	$("#show_all_button").on("click", function(event) {
		load_photos(photo_count, pageSize);
	});

	// Siguiente página
	$("#got_to_tag_button").on("click", function(event) {
		if($(".photo_selec").length <= 0) {
			$("#error_msg_2").show();

			setTimeout(function() {
				$("#error_msg_2").hide();
			}, 3000);
		} else {
			window.location = "tag_page.php?selPhotos=" + $("#selected_photos").val();
		}
	});

	// Ocultar - mostrar uploader
	$("#upload_content").hide();
	$("#upload_unfold").click(function() {
		$("#upload_content").toggle();

		upload_unfold = !upload_unfold;
		if(upload_unfold) {
			$(this).html("&and;");
		} else {
			$(this).html("&or;");
		}
	});

	// Dropzone
	$("#upload_form").dropzone({
		url: "php/upload_photo.php",
		paramName: "photo",
		acceptedFiles: "image/png,image/gif,image/jpeg",
		dictDefaultMessage: "CLICK HERE TO UPLOAD",
		init: function() {
			
			var dropzoneObj = this;
			dropzoneObj.lockUpload = false;

			// Evento cuando se agrega un archivo para agregarle el boton eliminar
			this.on("addedfile", function(file) {
				if(dropzoneObj.lockUpload) {
					$(file.previewElement).remove();
				} else {
					dropzoneObj.lockUpload = true;
				}

				$(".dz-preview").each(function() {
					if(this != file.previewElement) {
						$(this).remove();
					}
				});

				$("#error_msg_3").hide();
			});

			// Cuando un archivo se subio
			this.on("success", function(file, response) {
				if(response != "file_exists") {
					// Desbloqueamos las subidas
					dropzoneObj.lockUpload = false;

					// Obtenemos la informacion
					var data_response = file.xhr.response.split(" ");

					// Vaciamos las opciones
					$("#admin_options").empty();
					$("#num_selec").html($(".photo_selec").length + " SELECTED");

					var div_photo = generate_div_photo(data_response[0]);

					// Se le agrega la foto
					var img = new Image();
					img.src = data_response[1];
					$(div_photo).append(img);

					$("#admin_options").append(div_photo); // Se agrega a las opciones
					correct_wall();

					// Cerramos el uploader
					$("#upload_content").hide();
					upload_unfold = false;
					$("#upload").html("&or;");
				} else {
					$(".dz-success-mark").css({
						"color": "#FF0000"
					});
					$(".dz-success-mark").html("x");

					$("#error_msg_3").html("ERROR: FILE IS ALREADY UPLOADED.");
					$("#error_msg_3").show();

					// Desbloqueamos las subidas
					dropzoneObj.lockUpload = false;
				}
			});

		}
	});
});
