var wall;
var pageSize = 20;
var photo_count = 0;
var upload_unfold = false;

Dropzone.autoDiscover = false;

function load_photos(from, nRows) {
	$.ajax({
		type: "POST",
		url: "php/get_photos.php",
		data: { "from": from, "nRows": nRows },
		dataType: "json",
		success: function(data) {
			$("#admin_options").empty();
			$("#num_selec").html($(".photo_selec").length + " SELECTED");

			for (var i = 0; i < data.length; i++) {
				var divImg = document.createElement("div");
				$(divImg).addClass("photo_option");
				$(divImg).click(function(event) { selectPhoto(this); });

				var divInfo = document.createElement("div");
				$(divInfo).addClass("info_option");
				
				var divId = document.createElement("div");
				$(divId).css({ "position" : "relative", "float" : "left" });
				$(divId).html("[ " + data[i].id + " ]");
				$(divInfo).append(divId);
				
				var divDelete = document.createElement("div");
				$(divDelete).addClass("delete_photo");
				$(divDelete).html("[ x ]");
				$(divDelete).click(function(event) {
					event.preventDefault();
					event.stopPropagation();

					delete_photo(event.toElement);
				});
				$(divInfo).append(divDelete);

				$(divImg).append(divInfo);
				$(divImg).attr("id-photo", data[i].id);

				var img = document.createElement("img");
				img.src = data[i].url;
				$(divImg).append(img);

				$("#admin_options").append(divImg);
			}

			correct_wall();
		}
	});
};

function add_photo(id_photo) {
	$.ajax({
		type: "POST",
		url: "php/get_photo.php",
		data: { "id_photo": id_photo },
		dataType: "json",
		success: function(data) {
			$("#num_selec").html($(".photo_selec").length + " SELECTED");

			var divImg = document.createElement("div");
			$(divImg).addClass("photo_option");
			$(divImg).click(function(event) { selectPhoto(this); });

			var divInfo = document.createElement("div");
			$(divInfo).addClass("info_option");
			
			var divId = document.createElement("div");
			$(divId).css({ "position" : "relative", "float" : "left" });
			$(divId).html("[ " + data.id + " ]");
			$(divInfo).append(divId);
			
			var divDelete = document.createElement("div");
			$(divDelete).addClass("delete_photo");
			$(divDelete).html("[ x ]");
			$(divDelete).click(function(event) {
				event.preventDefault();
				event.stopPropagation();

				delete_photo(event.toElement);
			});
			$(divInfo).append(divDelete);

			$(divImg).append(divInfo);
			$(divImg).attr("id-photo", data.id);

			var img = new Image();
			img.onload = function() {
				$(divImg).append(img);
				wall.appendBlock(divImg);
			}
			img.src = data.url;
		}
	});
}

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

function selectPhoto(div_elem) {
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

function correct_wall() {
	wall.reset({
		selector: '.photo_option',
		animate: true,
		cellW: 250,
		cellH: 'auto',
		onResize: function() {
			wall.fitWidth();
		}
	});

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

function search_photos_id(search_string) {
	if(!validate_search(search_string)) {
		show_error_msg("BADLY FORMED QUERY");

		return;
	}
	
	var interval = get_interval(search_string);
	if(interval != "") {
		if(!validate_interval(interval)) {
			show_error_msg("BADLY FORMED INTERVAL");

			return;		
		}
	}

	var list = get_list(search_string);
	if(list != "") {
		if(!validate_list(list)) {
			show_error_msg("BADLY FORMED LIST");

			return;
		}
	}

	var single = get_single(search_string);

	$.ajax({
		type: "POST",
		url: "php/search_photos_id.php",
		data: { "single": single, "list": list, "interval": interval },
		dataType: "json",
		success: function(data) {
			$("#admin_options").empty();
			$("#num_selec").html($(".photo_selec").length + " SELECTED");

			if(data.length == 0) {
				var divEmpty = document.createElement("div");
				$(divEmpty).attr("id", "empty_info");
				$(divEmpty).html("NO SEARCH RESULTS");

				$("#admin_options").append(divEmpty);
			} else {
				var ids = new Object();
				for (var i = 0; i < data.length; i++) {
					if(ids[data[i].id] == undefined) {
						var divImg = document.createElement("div");
						$(divImg).addClass("photo_option");
						$(divImg).click(function(event) { selectPhoto(this); });

						var divInfo = document.createElement("div");
						$(divInfo).addClass("info_option");
						$(divInfo).html("[ " + data[i].id + " ]");
						$(divImg).append(divInfo);
						$(divImg).attr("id-photo", data[i].id);

						var img = document.createElement("img");
						img.src = data[i].url;
						$(divImg).append(img);

						$("#admin_options").append(divImg);
						ids[data[i].id] = true;
					}
				}

				correct_wall();
			}
		}
	});
}

function search_photos_word(search_string) {
	if(search_string != "") {
		$.ajax({
			type: "POST",
			url: "php/search_photos_word.php",
			data: { "word": search_string },
			dataType: "json",
			success: function(data) {
				$("#admin_options").empty();
				$("#num_selec").html($(".photo_selec").length + " SELECTED");

				if(data.length == 0) {
					var divEmpty = document.createElement("div");
					$(divEmpty).attr("id", "empty_info");
					$(divEmpty).html("NO SEARCH RESULTS");

					$("#admin_options").append(divEmpty);
				} else {
					var ids = new Object();
					for (var i = 0; i < data.length; i++) {
						if(ids[data[i].id] == undefined) {
							var divImg = document.createElement("div");
							$(divImg).addClass("photo_option");
							$(divImg).click(function(event) { selectPhoto(this); });

							var divInfo = document.createElement("div");
							$(divInfo).addClass("info_option");
							$(divInfo).html("[ " + data[i].id + " ]");
							$(divImg).append(divInfo);
							$(divImg).attr("id-photo", data[i].id);

							var img = document.createElement("img");
							img.src = data[i].url;
							$(divImg).append(img);

							$("#admin_options").append(divImg);
							ids[data[i].id] = true;
						}
					}

					correct_wall();
				}
			}
		});
	} else {

	}
}

function show_error_msg(error_text) {
	$("#error_msg").html(error_text);

	$("#error_msg").show();
	setTimeout(function() {
		$("#error_msg").hide();
	}, 3000);
}

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

function get_interval(search_str) {
	var elems_search = search_str.split(" ");
	for (var i = 0; i < elems_search.length; i++) {
		if(elems_search[i].lastIndexOf("-") != -1) {
			return elems_search[i];
		}
	}

	return "";
}

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

function validate_list(list) {
	var list_elems = list.split(",");
	for (var i = 0; i < list_elems.length; i++) {
		if(list_elems[i] == "") {
			return false;
		}
	}

	return true;
}

function get_list(search_str) {
	var elems_search = search_str.split(" ");
	for (var i = 0; i < elems_search.length; i++) {
		if(elems_search[i].lastIndexOf(",") != -1) {
			return elems_search[i];
		}
	}

	return "";
}

function get_single(search_str) {
	var elems_search = search_str.split(" ");
	for (var i = 0; i < elems_search.length; i++) {
		if(!isNaN(Number(elems_search[i]))) {
			return elems_search[i];
		}
	}

	return "";	
}

function clean_all(str, target) {
	var aux = str;
	while(aux.lastIndexOf(target) != -1) {
		aux = aux.replace(target, "");
	}
	return aux;
}

$(function() {
	$("#error_msg").hide();
	$("#error_msg_2").hide();
	$("#error_msg_3").hide();

	wall = new freewall("#admin_options");

	load_photos(photo_count, pageSize);

	$("#search_str_id").keypress(function(event) {
		if(event.keyCode == 13) {
			var search_string = $(this).val();
			search_photos_id(search_string);
		}
	});

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

	$("#search_id_button").on("click", function(event) {
		var search_string = $("#search_str_id").val();
		search_photos_id(search_string);
	});

	$("#search_id_word").on("click", function(event) {
		var search_string = $("#search_str_word").val();
		search_photos_word(search_string);
	});

	$("#show_all_button").on("click", function(event) {
		load_photos(photo_count, pageSize);
	});

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
		url: "php/upload_image.php",
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

					// Agregamos la nueva foto al wall
					add_photo(response);
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
