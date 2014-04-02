var wall;
var pageSize = 20;
var photo_count = 0;

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
				$(divInfo).html("[ " + data[i].id + " ]");
				$(divImg).append(divInfo);
				$(divImg).attr("id-photo", data[i].id);

				var img = document.createElement("img");
				img.src = data[i].url;
				$(divImg).append(img);

				$("#admin_options").append(divImg);
				photo_count++;
			}

			correct_wall();
		}
	});
};

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

});
