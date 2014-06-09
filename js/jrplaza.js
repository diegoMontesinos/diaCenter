
var words = [];      // Palabras
var words_i = 0;     // Indice de la palabra
var curr_word = "";  // Palabra actual

var photos = [];     // Fotos
var photos_i = 0;    // Indice de la foto

var lists_thread = undefined; // Proceso que actualiza la lista

var imageRatioReference9x6 = 1.5 // relacion 9x6

var screenFlag = "desktop" // desktop || mobile (less than 10024 and multitouch)

/////////////////////////////////////
//       B U S Q U E D A S  Y      //
//     P E T I C I O N E S  A L    //
//         S E R V E R             //
/////////////////////////////////////

/*
 * search_photos_word:
 *    Busca las fotos asociadas a una palabra.
 *    Se puede indicar si es necesario actualizar
 *  las palabras, si es necesario registrar la
 *  busqueda y si se necesita resetear la foto.
 */
function search_photos_word(word, register_word, reset_and_update) {
	if(word != "") {
		$.ajax({
			type: "POST",
			url: "php/search_photos_word.php",
			data: {
				"word": word, "register": (register_word  + "")
			},
			dataType: "json",
			success: function(data) {
				// Si hubo fotos asociadas
				if(data.photos.length > 0) {

					curr_word = word;
					
					photos = data.photos.slice(0);

					// Se pone la primera foto si se requiere
					if(reset_and_update) {

						// Hacemos un shuffle de las fotos
						for (var i = 0; i < photos.length; i++) {
							var ind = Math.floor(Math.random() * photos.length);
							var aux = photos[ind];

							photos[ind] = photos[i];
							photos[i] = aux;
						}

						// Creamos el elemento de la imagen
						var img = new Image();
						img.onload = function() {
							// La agregamos al div que le toca
							$("#searchedImage").empty();
							$("#searchedImage").html(img);

							// Ajustamos la interfaz a la imagen
							adjust_gui(img);

							search_words_photo(photos[0].id, word, true, true);
						};
						img.src = photos[0].url;
					}

					// Ponemos el contador
					photos_i = 1;
					$("#searchedImageCounter").html(photos_i + " / " + photos.length);
				}

				// Pone las listas
				show_succesful_lists(data.successful_words, data.unsuccessful_words);
			}
		});
	}
}

/*
 * search_words_photo:
 *    Busca las palabras asociadas a una palabra.
 *    Se puede indicar si es necesario animar la
 *  interfaz o si solo se debe mostrar, también se
 *  indica si es necesario resetear la palabra.
 */
function search_words_photo(id_photo, first_word, animar, reset_word) {
	$.ajax({
		type: "POST",
		url: "php/search_words_photo.php",
		data: {
			"id_photo": id_photo
		},
		dataType: "json",
		success: function(data) {
			if(data.length > 0) {

				// Clonamos el arreglo
				words = data.slice(0);

				// Hacemos un shuffle de las palabras
				for (var i = 0; i < words.length; i++) {
					var ind = Math.floor(Math.random() * words.length);
					var aux = words[ind];

					words[ind] = words[i];
					words[i] = aux;
				}
				
				// Se ordena para que la primera palabra sea la que dijeron
				var index_first = -1;
				for (var i = 0; i < words.length; i++) {
					if(words[i].word == first_word) { index_first = i; }
				}
				if(index_first != -1) {
					var auxArr = words.slice(index_first);
					for (var i = 0; i < index_first; i++) {
						auxArr.push(words[i]);
					}
					words = auxArr;
				}

				if(reset_word) {
					$("#searchedWord span").empty();
					$("#searchedWord span").text(words[0].word);
				}

				// Ponemos el count
				words_i = 1;
				$("#searchedWordCounter").html(words_i + " / " + words.length);
				$("#searchedWord span").css("color", "#000000");
				if (animar) {
					$(".respuesta").fadeIn(500, function() {});
				}
			}
		}
	});
}

/*
 * update_succesful_lists:
 *    Manda a consultar las listas de
 *  palabras exitosas / no exitosas y
 *  pone la respuesta donde van.
 */
function update_succesful_lists() {
	$.ajax({
		type: "POST",
		url: "php/succesful_lists.php",
		dataType: "json",
		success: function(data) {
			show_succesful_lists(data.successful_words, data.unsuccessful_words);
		}
	});
}

////////////////////////////////////
//     E V E N T O S  /  G U I    //
////////////////////////////////////

/*
 * typing_input:
 *    Escucha el evento de tecla presionada, lo único
 *  que hace es evitar que pongan espacios.
 */
function typing_input(input_elem, event) {
	// Si se presiono la tecla espacio se consume la tecla
	if(event.keyCode == 32) {
		event.preventDefault();
		event.stopPropagation();
		return;
	}
}

/*
 * searching_word:
 *    Evento que se llama cuando acaban de teclear
 *   en el input.
 *    Hace blur sobre el input si teclearon
 *   Enter.
 */
function searching_word(input_elem, event) {
	// Transformamos todo a minusculas
	var val = $(input_elem).val();
	$(input_elem).val(val.toLowerCase());

	if(event.keyCode == 13) {
		$(input_elem).blur();
	}
}

/*
 * blur_handler:
 *    Evento que se llama cuando se hace
 *  blur sobre un input (esto es para evitar
 *  un bug de dispositivos moviles).
 *
 *    Manda a buscar las fotos asignadas a una
 *  palabra (hace una busqueda normal).
 */
function blur_handler(input_elem, event) {
	
	// Obtiene la nueva palabra
	var new_word = $(input_elem).val();
	while(new_word.lastIndexOf(" ") != -1) {
		new_word = new_word.replace(" ", "");
	}
	$(input_elem).val("");

	// mandamos a buscar las fotos
	var counter = 0;
	$(".respuesta").fadeOut(200, function() {
		if(counter == 0) {
			search_photos_word(new_word, true, true);
		}
		counter++;
	});
}

/*
 * blur_handler:
 *     Ajusta las medidas de la interfaz
 *   para que se adapte a las medidas de
 *   una foto.
 */
function adjust_gui(image) {
	// Actualizamos la bandera de dispositivo
	if ($(window).width() <= 1009) {
		screenFlag = "mobile";
	} else {
		screenFlag = "desktop";
	}

	var image_ratio = image.width / image.height;
	switch(screenFlag) {
		case "desktop":
			if (image_ratio >= imageRatioReference9x6) {
				// apaisada
				$(image).css({
					"width" : "717px"
				});
				var alturaSearchedWord = (image.height * 717 / image.width) - 66;
				$("#searchedWord").css("height", alturaSearchedWord + "px");
			} else  {
				// vertical
				$(image).css({
					"height" : "478px"
				});

				$("#searchedWord").css("height", "412px");
			}
			break;

		case "mobile":
			if (image.width >= image.height) {
				var anchoMobile = $(window).width() - 20;
				var altoFoto = image.height * anchoMobile / image.width;
				$(image).css({
					"width"  : anchoMobile + "px",
					"height" : altoFoto + "px"
				});

				$("#searchedImage").css({
					"height" : altoFoto + "px"
				});

				$("#searchedImageCounter").css({
					"top"    : (altoFoto + 180) + "px",
					"left"   : "20px"
				});

				$("#searchedImageFlechas").css({
					"top"    : (altoFoto + 178) + "px",
					"left"   : "auto",
					"right"  : "20px"
				});
			} else {
				var anchoMobile = $(window).width() - 20;
				var altoFoto = image.height * anchoMobile / image.width;
				$(image).css({
					"width"  : anchoMobile + "px",
					"height" : altoFoto + "px"
				});

				$("#searchedImage").css({
					"height" : altoFoto+"px"
				});

				$("#searchedImageCounter").css({
					"top"    : (altoFoto + 180) + "px",
					"left"   : "20px"
				});

				$("#searchedImageFlechas").css({
					"top"    : (altoFoto + 178) + "px",
					"left"   : "auto",
					"right"  : "20px"
				});
			}
			$("#searchedWord").css("height", "60px");
			break;
	}
}

/*
 * show_succesful_lists:
 *    Recibe las dos listas de palabras (exitosas y 
 *  no exitosas), las muestra y asigna el click a las
 *  exitosas.
 */
function show_succesful_lists(succesful_list, unsuccesful_list) {
	// LISTA DE PALABRAS EXITOSAS

	// Vaciamos las viejas ponemos las nuevas
	$("#successfulWords").find("span").remove();
	for (var i = 0; i < succesful_list.length; i++) {
		var span_word = document.createElement("span");
		$(span_word).html(succesful_list[i]);

		$("#successfulWords").find("div").append(span_word);
	}

	// Habilitamos el click en las palabras exitosas
	$("#successfulWords span").bind("click", function() {
		var counter = 0;
		var wordCommunity = $(this).text();

		var counter = 0;
		$(".respuesta").fadeOut(200, function() {
			if(counter == 0) {
				search_photos_word(wordCommunity, false, true);
			}
			counter++;
		});
	});

	// LISTA DE PALABRAS NO EXITOSAS

	// Vaciamos las viejas ponemos las nuevas
	$("#unsuccessfulWords").find("span").remove();
	for (var i = 0; i < unsuccesful_list.length; i++) {
		var span_word = document.createElement("span");
		$(span_word).html(unsuccesful_list[i]);

		$("#unsuccessfulWords").find("div").append(span_word);
	}
}

/*
 * previous_word:
 *    Muestra la palabra previa.
 *    Hace fades para evitar bugs y se le pasa el fade_event
 *   para que lo haga cuando finaliza esto. Esto se hizo por
 *   el bug de muchos clicks.
 */
function previous_word(fade_event, selector_str) {
	$("#searchedWord span").fadeOut(300, function() {
		// Recorremos el arreglo
		var last = words.pop();
		words.unshift(last);
		curr_word = words[0].word;

		$("#searchedWord span").html(curr_word);
		$("#searchedWord span").fadeIn(300, function() {
			// Actualizamos el contador
			words_i--;
			if(words_i == 0) {
				words_i = words.length;
			}
			$("#searchedWordCounter").html(words_i + " / " + words.length);

			// Se mandana buscar las fotos
			search_photos_word(curr_word, false, false);

			if(fade_event != undefined) {
				fade_event(selector_str);
			}
		});
	});
}

/*
 * next_word:
 *    Muestra la palabra siguiente.
 *    Hace fades para evitar bugs y se le pasa el fade_event
 *   para que lo haga cuando finaliza esto. Esto se hizo por
 *   el bug de muchos clicks.
 */
function next_word(fade_event, selector_str) {
	$("#searchedWord span").fadeOut(300, function() {
		// Recorremos el arreglo
		var first = words.shift();
		words.push(first);
		curr_word = words[0].word;

		$("#searchedWord span").html(curr_word);
		$("#searchedWord span").fadeIn(300, function() {
			// Actualizamos el contador
			words_i++;
			if(words_i > words.length) {
				words_i = 1;
			}
			$("#searchedWordCounter").html(words_i + " / " + words.length);

			// Se mandana buscar las fotos
			search_photos_word(curr_word, false, false);

			if(fade_event != undefined) {
				fade_event(selector_str);
			}
		});
	});
}

/*
 * previous_photo:
 *    Muestra la foto previa.
 *    Hace fades para evitar bugs y se le pasa el fade_event
 *   para que lo haga cuando finaliza esto. Esto se hizo por
 *   el bug de muchos clicks.
 */
function previous_photo(fade_event, selector_str) {
	var counter = 0;
	$(".resImage").fadeOut(200, function() {
		if(counter == 0) {
			// Recorremos el arreglo
			var last = photos.pop();
			photos.unshift(last);

			// Ponemos la nueva foto
			var img = new Image();
			img.onload = function() {

				// La agregamos al div que le toca
				$("#searchedImage").empty();
				$("#searchedImage").html(img);

				// Ajustamos la interfaz
				adjust_gui(img);

				var counter2 = 0;
				$(".resImage").fadeIn(500, function() {
					// Solo una vez
					if (counter2 == 0) {
						if(fade_event != undefined) {
							fade_event(selector_str);
						}
					}
					counter2++;
				});
			};
			img.src = photos[0].url;

			// Actualizamos el contador
			photos_i--;
			if(photos_i == 0) {
				photos_i = photos.length;
			}
			$("#searchedImageCounter").html(photos_i + " / " + photos.length);

			// Se ponen la palabras
			search_words_photo(photos[0].id, curr_word, false, false);
		}
		counter++;
	});
}

/*
 * next_photo:
 *    Muestra la foto siguiente.
 *    Hace fades para evitar bugs y se le pasa el fade_event
 *   para que lo haga cuando finaliza esto. Esto se hizo por
 *   el bug de muchos clicks.
 */
function next_photo(fade_event, selector_str) {
	var counter = 0;
	$(".resImage").fadeOut(200, function() {
		if(counter == 0) {
			// Recorremos el arreglo
			var first = photos.shift();
			photos.push(first);

			// Ponemos la nueva foto
			var img = new Image();
			img.onload = function() {

				// La agregamos al div que le toca
				$("#searchedImage").empty();
				$("#searchedImage").html(img);

				// Ajustamos la interfaz
				adjust_gui(img);

				var counter2 = 0;
				$(".resImage").fadeIn(500, function() {
					// Solo una vez
					if(counter2 == 0) {
						if(fade_event != undefined) {
							fade_event(selector_str);
						}
					}
					counter2++;
				});
			};
			img.src = photos[0].url;

			// Actualizamos el contador
			photos_i++;
			if(photos_i > photos.length) {
				photos_i = 1;
			}
			$("#searchedImageCounter").html(photos_i + " / " + photos.length);

			// Se ponen la palabras
			search_words_photo(photos[0].id, curr_word, false, false);
		}

		counter++;
	});
}

/*
 * activate_flecha_photo:
 *    Activa las acciones de las flechas para
 *  navegar de las fotos.
 */
function activate_flecha_photo(selector_str) {
	$(selector_str).bind("click", function(event) {
		event.preventDefault();
		event.stopPropagation();

		if(photos.length > 0) {
			$(selector_str).unbind("click");

			if(selector_str.lastIndexOf("izq") != -1) {
				previous_photo(activate_flecha_photo, selector_str);
			}
			if(selector_str.lastIndexOf("der") != -1) {
				next_photo(activate_flecha_photo, selector_str);
			}
		}
	});
}

/*
 * activate_flecha_word:
 *    Activa las acciones de las flechas para
 *  navegar de las palabras.
 */
function activate_flecha_word(selector_str) {
	$(selector_str).bind("click", function(event) {
		event.preventDefault();
		event.stopPropagation();

		if(words.length > 0) {
			$(selector_str).unbind("click");

			if(selector_str.lastIndexOf("izq") != -1) {
				previous_word(activate_flecha_word, selector_str);
			}
			if(selector_str.lastIndexOf("der") != -1) {
				next_word(activate_flecha_word, selector_str);
			}
		}
	});
}

function launchFullScreen(element) {
	if(ie != undefined) {
		var wscript = new ActiveXObject("Wscript.shell");
		wscript.SendKeys("{F11}");
	} else {
		if (element.requestFullscreen) {
			element.requestFullscreen();
		} else if (element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen();
		} else if (element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else if (element.msRequestFullscreen) {
			element.msRequestFullscreen();
		}	
	}
}

//////////////////////////////
///       M  A  I  N       ///
//////////////////////////////

$(document).ready(function() {

	// Bloqueamos los clicks derechos
	function disableContextMenu() { 
		return false;
	}
	document.oncontextmenu = disableContextMenu;

	// Ponemos el tipo de pantalla
	if ($(window).width() <= 1009) {
		screenFlag = "mobile";
	} else {
		screenFlag = "desktop";
	}
	$(".respuesta").hide();
	window.scrollTo(0.0, 0.0);

	// Ponemos el evento blur asociado al input
	$("#search_str_word").bind("blur", function(event) {
		blur_handler(this, event)
	});

	// Activamos las flechas
	// En fotos
	activate_flecha_photo("#searchedImageFlechas .izq");
	activate_flecha_photo("#searchedImageFlechas .der");

	// En palabras
	activate_flecha_word("#searchedWordFlechas .izq");
	activate_flecha_word("#searchedWordFlechas .der");

	// Activamos el swipe en las fotos
	$("#searchedImage").on("swiperight", function() {
		previous_photo(undefined, "");
	});
	$("#searchedImage").on("swipeleft", function() {
		next_photo(undefined, "");
	});

	// Activamos el swipe de las palabras
	$("#searchedWord").on("swiperight", function() {
		previous_word(undefined, "");
	});
	$("#searchedWord").on("swipeleft", function() {
		next_word(undefined, "");
	});

	// Evento de resize
	window.onresize = function(event) {
		if ($(window).width() <= 1009) {
			screenFlag = "mobile"
		} else {
			screenFlag = "desktop"
		}
	};

	// Setea el timer de consulta de listas
	lists_thread = setInterval(function() {
		update_succesful_lists();
	}, 500);

	// FullScreen
	$("#fullscreenAux").click(function() {
		launchFullScreen(document.documentElement);
	});
	setTimeout(function() {
		$("#fullscreenAux").click();
	}, 3000);

});
