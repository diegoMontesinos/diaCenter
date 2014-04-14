
///////////////////////////////////////////
//      P A L A B R A S - F O T O S      //
///////////////////////////////////////////

/*
 * add_word_photo:
 *   Asigna una palabra a una foto (la guarda en base de datos) y
 *   la coloca en la lista que debe de ir, como retroalimentacion
 *   visual.
 */
function add_word_photo(id_photo, word, div_selection, input_elem) {
	$.ajax({
		type: "POST",
		url: "php/add_word_photo.php",
		data: {
			"idphoto": id_photo,
			"word": word
		},
		dataType: "json",
		success: function(data) {
			// Creamos el nuevo elemento de la lista
			// y le asignamos sus funciones
			var new_li = document.createElement("li");
			$(new_li).append(data.word.replace('"', '').replace('"', '') + " <span style='margin-left: 4%;' onclick='delete_word_photo(this, event);'>[x]</span>");
			$(new_li).hover(function() {
				$(this).find("span").show();
			}, function() {
				$(this).find("span").hide();
			});
			$(new_li).attr("word", data.word.replace('"', '').replace('"', ''));
			$(new_li).attr("id-word", data.id);

			// Lo agregamos donde debe de ir y 
			// reiniciamos el scroll.
			var ul_words = div_selection.find(".jspPane")[0];
			$(ul_words).append(new_li);
			$(input_elem).val("");

			var pane = div_selection.find(".words_select");
			var api = pane.data('jsp');
			api.reinitialise();
		}
	});
}

/*
 * delete_word_photo:
 *   Elimina la asociación de una palabra con una foto.
 */
function delete_word_photo(span_elem, event) {
	// Obtenemos el div seleccion y el id de la foto
	var div_selection = $(span_elem).parent().parent().parent().parent().parent().parent();
	var id_photo = div_selection.attr("id-photo");

	// Obtenemos el id de la palabra
	var id_word = $(span_elem).parent().attr("id-word");

	$.ajax({
		type: "POST",
		url: "php/delete_word_photo.php",
		data: {
			"idphoto": id_photo,
			"idword": id_word
		},
		dataType: "text",
		success: function(data) {
			// Obtenemos el elemento de lista
			var li_elem = $(span_elem).parent();
			var pane = li_elem.parent().parent().parent();

			// Lo eliminamos y reiniciamos el scroll
			li_elem.remove();
			var api = pane.data('jsp');
			api.reinitialise();
		}
	});
}

/*
 * adding_word_photo:
 *   Escucha el evento de tecla suelta.
 *   1 - Verifica la validez de la palabra (existente y que no este asociada).
 *   2 - Agrega la palabra.
 */
function adding_word_photo(input_elem, event) {
	// Obtenemos el div de la seleccion
	var div_selection = $(input_elem).parent().parent();

	// Obtenemos la nueva palabra y la limpiamos
	var new_word = $(input_elem).val();
	while(new_word.lastIndexOf(" ") != -1) {
		new_word = new_word.replace(" ", "");
	}

	// Si le dieron Enter
	if(event.keyCode == 13) {
		if(new_word != "") {
			// Si ya fue asociada
			if(!already_assigned(div_selection[0], new_word, "word")) {
				var id_photo = div_selection.attr("id-photo");
				add_word_photo(id_photo, new_word, div_selection, input_elem);
			} else {
				$(input_elem).css({
					"border": "1px solid #FF0000"
				});
			}
		}
	} else {
		if(new_word != "") {
			exist_word(new_word, input_elem, div_selection[0]);
		} else {
			$(input_elem).css({
				"border": "1px solid #000000"
			});
		}
	}
}

///////////////////////////////////////////
//       A S G I N A  A  T O D O S       //
///////////////////////////////////////////

var assign_all_unfold = false; // Bandera para desplegar herramienta

/*
 * assign_to_all:
 *   Asigna una palabra a todas las fotos
 *   seleccionadas (asignacion multiple).
 */
function assign_to_all(word) {
	// Obtenemos los ids de las fotos
	// a las que se les asignará la palabra
	var select_photos_ids = "";
	var select_photos = $(".photo_selection");
	for (var i = 0; i < select_photos.length; i++) {
		// Si ya esta asignar entonces no se obtiene el id
		if(!already_assigned(select_photos[i], word, "word")) {
			select_photos_ids += $(select_photos[i]).attr("id-photo") + ",";
		}
	}

	$.ajax({
		type: "POST",
		url: "php/assign_to_all.php",
		data: {
			"selec_photos": select_photos_ids,
			"word": word
		},
		dataType: "json",
		success: function(data) {
			// Se agrega la nueva palabra a la lista
			// de todas las fotos
			var select_photos = $(".photo_selection");
			for (var i = 0; i < select_photos.length; i++) {

				// Si no está asignada
				if(!already_assigned(select_photos[i], word, "word")) {
					// Creamos el nuevo elemento de la lista
					var new_li = document.createElement("li");
					$(new_li).append(data.word.replace('"', '').replace('"', '') + " <span style='margin-left: 4%;' onclick='delete_word_photo(this, event);'>[x]</span>");
					$(new_li).hover(function() {
						$(this).find("span").show();
					}, function() {
						$(this).find("span").hide();
					});
					$(new_li).attr("word", data.word);
					$(new_li).attr("id-word", data.id);


					// Lo agregmos a la lista y reiniciamos el scroll
					var ul_words = $(select_photos[i]).find(".jspPane")[0];
					$(ul_words).append(new_li);

					var pane = $(select_photos[i]).find(".words_select");
					var api = pane.data('jsp');
					api.reinitialise();
				}

			}
		}
	});
}

/*
 * adding_word_all:
 *   Escucha el evento de tecla suelta y:
 *   1 - Verifica que la palabra exista y
 *   2 - Asigna a todos
 */
function adding_word_all(input_elem, event) {
	// Obtiene la nueva palabra
	var new_word = $(input_elem).val();
	while(new_word.lastIndexOf(" ") != -1) {
		new_word = new_word.replace(" ", "");
	}

	// Si presionaron Enter
	if(event.keyCode == 13) {
		if(new_word != "") {
			// Se asigna a todos
			assign_to_all(new_word);
			$(input_elem).val("");		
		}
	} else {
		// Verificamos que exista la palabra
		if(new_word != "") {
			exist_word(new_word, input_elem, undefined);
		} else {
			$(input_elem).css({
				"border": "1px solid #000000"
			});
		}
	}
}

///////////////////////////////////////////
//         D I C C I O N A R I O         //
///////////////////////////////////////////

var dictionary_unfold = false;  // Bandera para desplegar herramienta

/*
 * filter_dictionary:
 *   Filtra el diccionario con el prefijo
 *   de la entrada cada vez que dan Enter.
 */
function filter_dictionary(input_elem, event) {
	// Consume la tecla si es espacio
	if(event.keyCode == 32) {
		event.preventDefault();
		event.stopPropagation();
		return;
	}
	// Si es Enter
	else if(event.keyCode == 13) {

		// Obtenemos la cadena a filtrar
		var filter_str = $(input_elem).val();
		if(filter_str == "") {
			filter_str = "a";
		}

		$.ajax({
			type: "POST",
			url: "php/filter_dictionary.php",
			data: { "filter_str": filter_str },
			dataType: "json",
			success: function(data) {
				// Vaciamos la lista de palabras de diccionario
				$("#words_dictionary .jspPane").empty();
				for (var i = 0; i < data.length; i++) {

					// Llenamos con las palabras obtenidas
					var new_li = document.createElement("li");
					$(new_li).attr("id-word", data[i]["id"]);
					$(new_li).on("click", function() {
						select_dictionary_word(this);
					});
					$(new_li).html(data[i]["word"]);

					$("#words_dictionary .jspPane").append(new_li);
				};

				// Reiniciamos el scroll
				var api = $("#words_dictionary").data('jsp');
				api.reinitialise();
			}
		});
	}
}

/*
 * select_dictionary_word:
 *   Marca como seleccionada / deseleccionada
 *   una palabra del diccionario.
 */
function select_dictionary_word(li_elem) {
	// Si el elemento ya tiene la clase asignada
	// hacemos toggle.
	if($(li_elem).hasClass("word_dict_selec")) {
		$(li_elem).removeClass("word_dict_selec");
	} else {
		$(li_elem).addClass("word_dict_selec");
	}
}

///////////////////////////////////////////
//          C A T E G O R I A S          //
///////////////////////////////////////////

var categories_unfold = false;  // Bandera para desplegar herramienta

/*
 * add_category:
 *   Agrega una nueva categoria.
 */
function add_category(new_category, input_elem) {
	$.ajax({
		type: "POST",
		url: "php/add_category.php",
		data: { "category": new_category },
		dataType: "text",
		success: function(data) {
			// Creamos el nuevo elemento de la lista
			var new_li = document.createElement("li");
			$(new_li).append(data.replace('"', '').replace('"', '') + "<span style='margin-left: 4%;' onclick='delete_category(this, event);'>[x]</span>");
			$(new_li).hover(function() {
				$(this).find("span").show();
			}, function() {
				$(this).find("span").hide();
			});
			$(new_li).click(function() {
				select_category(this);
			});
			$(new_li).attr("category", data.replace('"', '').replace('"', ''));

			// Agregamos a la lista y reiniciamos el scroll
			var ul_categories = $("#categories").find(".jspPane")[0];
			$(ul_categories).append(new_li);
			$(input_elem).val("");

			var api = $("#categories").data('jsp');
			api.reinitialise();
		}
	});
}

/*
 * delete_category:
 *   Elimina la categoría seleccionada.
 */
function delete_category(span_elem, event) {

	// Evitamos que se seleccione
	event.stopPropagation();
	event.preventDefault();

	// Obtenemos el id de la categoria
	var li_elem = $(span_elem).parent();
	var id_category = li_elem.attr("id-category");

	$.ajax({
		type: "POST",
		url: "php/delete_category.php",
		data: { "id_category": id_category },
		dataType: "text",
		success: function(data) {
			// Eliminamos de la lista y reiniciamos el scroll
			var li_elem = $(span_elem).parent();
			var pane = li_elem.parent().parent().parent();

			li_elem.remove();
			var api = pane.data('jsp');
			api.reinitialise();
		}
	});
}

/*
 * exist_category:
 *   Evalúa si existe la categoría.
 */
function exist_category(category) {
	var categories = $("#categories").find(".jspPane").find("li");
	for (var i = 0; i < categories.length; i++) {
		var curr_catego = $(categories[i]).attr("category");
		if(curr_catego == category) {
			return true;
		}
	}

	return false;
}

/*
 * add_category_word:
 *   Asigna una palabra a una categoria.
 */
function add_category_word(id_category, word) {
	$.ajax({
		type: "POST",
		url: "php/add_category_word.php",
		data: {
			"id_category": id_category,
			"word": word
		},
		dataType: "json",
		success: function(data) {
			// Creamos el nuevo elemento de la lista
			var new_li = document.createElement("li");
			$(new_li).append(data.word.replace('"', '').replace('"', '') + " <span>[x]</span>");
			$(new_li).hover(function() {
				$(this).find("span").show();
			}, function() {
				$(this).find("span").hide();
			});
			$(new_li).attr("id-word", data.id);
			$(new_li).attr("word", data.word);

			// Lo agregmos a la lista y reiniciamos el scroll
			var ul_words = $("#categories_words").find(".jspPane")[0];
			$(ul_words).append(new_li);

			var api = $("#categories_words").data('jsp');
			api.reinitialise();

			$("#add_category_word").val("");
		}
	});
}

/*
 * get_words_category:
 *   Obtiene las palabras asignadas a una categoría.
 */
function get_words_category(id_category) {
	$.ajax({
		type: "POST",
		url: "php/get_words_category.php",
		data: { "id_category": id_category},
		dataType: "json",
		success: function(data) {
			// Limpiamos la lista de palabras
			$("#categories_words").find(".jspPane").empty();

			// Agregamos las palabras
			for (var i = 0; i < data.length; i++) {
				// Creamos el nuevo elemento de la lista
				var new_li = document.createElement("li");
				$(new_li).append(data[i].word.replace('"', '').replace('"', '') + " <span>[x]</span>");
				$(new_li).hover(function() {
					$(this).find("span").show();
				}, function() {
					$(this).find("span").hide();
				});
				$(new_li).attr("id-word", data[i].id);
				$(new_li).attr("word", data[i].word);

				// Lo agregmos a la lista y reiniciamos el scroll
				var ul_words = $("#categories_words").find(".jspPane")[0];
				$(ul_words).append(new_li);

				var api = $("#categories_words").data('jsp');
				api.reinitialise();
			}
		}
	});
}

/*
 * assing_category_all:
 *   Asigna las palabras de una categoría a todas las fotos seleccionadas.
 */
function assing_category_all(id_category) {
	$.ajax({
		type: "POST",
		url: "php/get_words_category.php",
		data: { "id_category": id_category},
		dataType: "json",
		success: function(data) {
			// Asignamos las palabras
			for (var i = 0; i < data.length; i++) {
				assign_to_all(data[i].word.replace('"', '').replace('"', ''));
			}
		}
	});
}

/*
 * adding_category:
 *   Escucha el evento de tecla suelta y:
 *   - Verifica que no exista la categoría.
 *   - Agrega la nueva categoria si presionan Enter.
 */
function adding_category(input_elem, event) {
	// Obtenemos la categoría
	var new_category = $(input_elem).val();
	while(new_category.lastIndexOf(" ") != -1) {
		new_category = new_category.replace(" ", "");
	}

	// Si dan Enter
	if(event.keyCode == 13) {
		// Es distinta del vacio y no existe la categoria
		if(new_category != "") {
			if(exist_category(new_category)) {
				$(input_elem).css({
					"border": "1px solid #FF0000"
				});
			} else {
				add_category(new_category, input_elem);
				$(input_elem).css({
					"border": "1px solid #000000"
				});
			}
		}
	} else {
		if(exist_category(new_category)) {
			$(input_elem).css({
				"border": "1px solid #FF0000"
			});
		} else {
			$(input_elem).css({
				"border": "1px solid #000000"
			});
		}
	}
}

/*
 * select_category:
 *   Marca una categoría como seleccionada
 *   y despliega las palabras asignadas a ella.
 */
function select_category(li_elem) {
	// Estilo
	if($(".category_selec").length > 0) {
		$(".category_selec").removeClass("category_selec");
	}
	$(li_elem).addClass("category_selec");

	$("#add_category_word").val("");
	$("#add_category_word").css({
		"border": "1px solid #000000"
	});

	// Traemos las palabras asociadas
	var id_category = $(li_elem).attr("id-category");
	get_words_category(id_category);

	// Mostramos las palabras
	$("#add_category_word").show();
	$("#categories_words_container").show();
}

/*
 * adding_word_category:
 *   Escucha el evento de tecla suelta agregando
 *   una palabra a la categoría.
 */
function adding_word_category(input_elem, event) {
	// Obtenemos la nueva palabra y la limpiamos
	var new_word = $(input_elem).val();
	while(new_word.lastIndexOf(" ") != -1) {
		new_word = new_word.replace(" ", "");
	}

	// Si le dieron Enter
	if(event.keyCode == 13) {
		if(new_word != "") {
			if(!already_assigned($("#categories_words")[0], new_word, "word")) {
				
				var selected_category = $(".category_selec");
				if(selected_category.length == 1) {
					var id_category = selected_category.attr("id-category");
					add_category_word(id_category, new_word);
				}
			} else {
				$(input_elem).css({
					"border": "1px solid #FF0000"
				});
			}
		}
	} else {
		if(new_word != "") {
			exist_word(new_word, input_elem, $("#categories_words")[0]);
		} else {
			$(input_elem).css({
				"border": "1px solid #000000"
			});
		}
	}
}

///////////////////////////////////////////
//           F U N C I O N E S           //
//          A U X I L I A R E S          //
///////////////////////////////////////////

/*
 * typing_input:
 *   Escucha el evento de tecla presionada, lo único
 *   que hace es evitar que pongan espacios.
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
 * already_assigned:
 *   Verifica si la palabra ya se encuentra asignada, es decir,
 *   dentro del div_selection se encuentra una lista con la palabra.
 */
function already_assigned(div_selection, word, attr_name) {
	var words_li = $(div_selection).find(".jspPane").find("li");
	for (var i = 0; i < words_li.length; i++) {
		var curr_word = $(words_li[i]).attr(attr_name);
		if(curr_word == word) {
			return true;
		}
	}

	return false;
}

/*
 * exist_word:
 *   Verifica si la palabra existe y pone el input_elem
 ¡   de un color que notifica al usuario si esta comentiendo
 *   un error.
 */
function exist_word(word, input_elem, div_select) {
	$.ajax({
		type: "POST",
		url: "php/exist_word.php",
		data: { "word": word },
		dataType: "text",
		success: function(data) {
			if(data == "true") {
				if(div_select != undefined) {
					if(already_assigned(div_select, word, "word")) {
						setTimeout(function() {
							$(input_elem).css({
								"border": "1px solid #FF0000"
							});
						}, 50);
					} else {
						$(input_elem).css({
							"border": "1px solid #000000"
						});	
					}
				} else {
					$(input_elem).css({
						"border": "1px solid #000000"
					});
				}
			} else {
				$(input_elem).css({
					"border": "1px solid #FFEB0D"
				});
			}
		}
	});
}

/****************************
 ***      M  A  I  N      ***
 ****************************/

 var wall; // El muro de las fotos

$(function() {
	
	// Wall
	wall = new freewall("#admin_selection");
	wall.reset({
		selector: '.photo_selection',
		animate: true,
		cellW: 415,
		cellH: 'auto',
		onResize: function() {
			wall.fitWidth();
		}
	});

	var images = wall.container.find('.photo_selection');
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

	// Efecto mostrar borrar palabras
	$(".words_select li").hover(function() {
		$(this).find("span").show();
	}, function() {
		$(this).find("span").hide();
	});

	// Nice scrolling
	$(".words_select").each(function(index) {
		var that = this;
		var img = $(this).parent().parent().find("img");
		img.load(function() {
			$(that).css({"height" : ($(this).height() - 20) + "px"});
			$(that).jScrollPane({
				autoReinitialise: true,
				hideFocus: true
			});
		});
	});

	// Scroll en diccionario
	$("#words_dictionary").jScrollPane({
		autoReinitialise: true,
		hideFocus: true
	});

	// Scroll en categorias
	$("#categories").jScrollPane({
		autoReinitialise: true,
		hideFocus: true
	});

	// Scroll en palabras de categorias
	$("#categories_words").jScrollPane({
		autoReinitialise: true,
		hideFocus: true
	});

	// Efecto mostrar borrar categorias
	$("#categories li").hover(function() {
		$(this).find("span").show();
	}, function() {
		$(this).find("span").hide();
	});

	// Oculta las palabras de categoría
	$("#add_category_word").hide();
	$("#categories_words_container").hide();

	// Asocia a todas desde diccionario
	$("#dictionary_all").click(function (event) {
		var select_dict_words = $(".word_dict_selec");

		if(select_dict_words.length > 0) {
			for (var i = 0; i < select_dict_words.length; i++) {
				assign_to_all($(select_dict_words[i]).html());

				$(select_dict_words[i]).removeClass("word_dict_selec");				
			}
		}
	});

	// Asocia desde categorias
	$("#categories_all").click(function (event) {
		var selected_category = $(".category_selec");
		if(selected_category.length == 1) {
			var id_category = selected_category.attr("id-category");
			assing_category_all(id_category);
		}
	});

	// Ocultar - mostrar asociar a todas
	$("#assign_all_content").hide();
	$("#assign_all_unfold").click(function() {
		$("#assign_all_content").toggle();

		assign_all_unfold = !assign_all_unfold;
		if(assign_all_unfold) {
			$(this).html("&and;");
		} else {
			$(this).html("&or;");
		}
	});

	// Ocultar - mostrar diccionario
	$("#dictionary_content").hide();
	$("#dictionary_unfold").click(function() {
		$("#dictionary_content").toggle();

		dictionary_unfold = !dictionary_unfold;
		if(dictionary_unfold) {
			$(this).html("&and;");
		} else {
			$(this).html("&or;");
		}
	});

	// Ocultar - mostrar categorias
	$("#categories_content").hide();
	$("#categories_unfold").click(function() {
		$("#categories_content").toggle();

		categories_unfold = !categories_unfold;
		if(categories_unfold) {
			$(this).html("&and;");
		} else {
			$(this).html("&or;");
		}
	});

	// Boton hacia atrás
	$("#back_button").on("click", function(event) {
		window.location = "index.html";
	});
});
