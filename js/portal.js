
var words = [];
var words_i = 0;
var curr_word = "";

var photos = [];
var photos_i = 0;

function searching_word(input_elem, event) {
	// Obtiene la nueva palabra
	var new_word = $(input_elem).val();
	while(new_word.lastIndexOf(" ") != -1) {
		new_word = new_word.replace(" ", "");
	}

	// Si presionaron Enter
	if(event.keyCode == 13) {
		search_photos_word(new_word, true);
	}
}

function search_photos_word(word, update_words) {
	// Si es valida la cadena
	if(word != "") {
		$.ajax({
			type: "POST",
			url: "php/search_photos_word.php",
			data: {
				"word": word
			},
			dataType: "json",
			success: function(data) {
				if(data.length > 0) {
					curr_word = word;
					photos = data.slice(0);

					// Se pone la primera foto
					$("#photo_show").empty();
					var img = new Image();
					img.onload = function() {
						$("#photo_show").append(img);
					};
					img.src = photos[0].url;
					$(img).css({
						"width" : "100%"
					});

					// Se pone el count
					photos_i = 1;
					$("#photo_count").html(photos_i + " / " + photos.length);

					// Se ponen la palabras si se requiere
					if(update_words) {
						search_words_photo(photos[0].id, word);
					}
				}
			}
		});
	}
}

function search_words_photo(id_photo, first_word) {
	$.ajax({
		type: "POST",
		url: "php/search_words_photo.php",
		data: {
			"id_photo": id_photo
		},
		dataType: "json",
		success: function(data) {
			if(data.length > 0) {
				words = data.slice(0);

				// Se ordena para que la primera palabra sea la que dijeron
				while(words[0].word != first_word) {
					var aux = words.shift();
					words.push(aux);
				}

				// La ponemos
				$("#words").html(words[0].word);

				// Ponemos el count
				words_i = 1;
				$("#word_count").html(words_i + " / " + words.length);
			}
		}
	});
}

/*
 * typing_input:
 * Escucha el evento de tecla presionada, lo único
 * que hace es evitar que pongan espacios.
 */
function typing_input(input_elem, event) {
	// Si se presiono la tecla espacio se consume la tecla
	if(event.keyCode == 32) {
		event.preventDefault();
		event.stopPropagation();
		return;
	}
}

/****************************
 ***      M  A  I  N      ***
 ****************************/

$(function() {

	$("#prev_photo").click(function() {
		if(photos.length > 0) {
			// Recorremos el arreglo
			var last = photos.pop();
			photos.unshift(last);

			// Ponemos la nueva foto
			$("#photo_show").empty();
			var img = new Image();
			img.onload = function() {
				$("#photo_show").append(img);
			};
			img.src = photos[0].url;
			$(img).css({
				"width" : "100%"
			});

			// Actualizamos el contador
			photos_i--;
			if(photos_i == 0) {
				photos_i = photos.length;
			}
			$("#photo_count").html(photos_i + " / " + photos.length);

			// Se ponen la palabras
			search_words_photo(photos[0].id, curr_word);
		}
	});

	$("#next_photo").click(function() {
		if(photos.length > 0) {

			// Recorremos el arreglo
			var first = photos.shift();
			photos.push(first);

			// Ponemos la nueva foto
			$("#photo_show").empty();
			var img = new Image();
			img.onload = function() {
				$("#photo_show").append(img);
			};
			img.src = photos[0].url;
			$(img).css({
				"width" : "100%"
			});

			// Actualizamos el contador
			photos_i++;
			if(photos_i > photos.length) {
				photos_i = 1;
			}
			$("#photo_count").html(photos_i + " / " + photos.length);

			// Se ponen la palabras
			search_words_photo(photos[0].id, curr_word);
		}
	});

	$("#prev_word").click(function() {
		if(words.length > 0) {

			// Recorremos el arreglo
			var last = words.pop();
			words.unshift(last);

			// Ponemos la palabra
			$("#words").html(words[0].word);

			// Actualizamos el contador
			words_i--;
			if(words_i == 0) {
				words_i = words.length;
			}
			$("#word_count").html(words_i + " / " + words.length);

			// Se ponen las fotos
			search_photos_word(words[0].word, false);
		}
	});

	$("#next_word").click(function() {
		if(words.length > 0) {
			// Recorremos el arreglo
			var first = words.shift();
			words.push(first);

			// Ponemos la palabra
			$("#words").html(words[0].word);

			// Actualizamos el contador
			words_i++;
			if(words_i > words.length) {
				words_i = 1;
			}
			$("#word_count").html(words_i + " / " + words.length);
			
			// Se ponen las fotos
			search_photos_word(words[0].word, false);
		}
	});

});

