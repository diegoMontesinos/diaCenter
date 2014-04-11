var wall;
var dictionary_unfold = false;
var assign_all_unfold = false;

function adding_word_press(input_elem, event) {
	if(event.keyCode == 32) {
		event.preventDefault();
		event.stopPropagation();
		return;
	}
}

function adding_word(input_elem, event) {
	var new_word = $(input_elem).val();
	while(new_word.lastIndexOf(" ") != -1) {
		new_word = new_word.replace(" ", "");
	}

	if(event.keyCode == 13) {
		if(new_word != "") {
			if(!already_associate(div_selection[0], new_word)) {
				var id_photo = div_selection.attr("id-photo");
				store_association(id_photo, new_word, div_selection, input_elem);
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

function adding_word_all(input_elem, event) {
	var new_word = $(input_elem).val();
	while(new_word.lastIndexOf(" ") != -1) {
		new_word = new_word.replace(" ", "");
	}

	if(event.keyCode == 13) {
		if(new_word != "") {
			associate_to_all(new_word);
			$(input_elem).val("");		
		}
	} else {
		if(new_word != "") {
			exist_word(new_word, input_elem, undefined);
		} else {
			$(input_elem).css({
				"border": "1px solid #000000"
			});
		}
	}
}

function delete_category(span_elem, event) {
	event.stopPropagation();
	event.preventDefault();

	var div_selection = $(span_elem).parent();
	var id_category = div_selection.attr("id-category");
	console.log(id_category);
}

function selectCategory(li_elem) {
	// Estilo
	if($(".category_selec").length > 0) {
		$(".category_selec").removeClass("category_selec");
	}
	$(li_elem).addClass("category_selec");

	// Traemos las palabras asociadas
	
}

function delete_word(span_elem, event) {
	var div_selection = $(span_elem).parent().parent().parent().parent().parent().parent();
	var id_photo = div_selection.attr("id-photo");

	var id_word = $(span_elem).parent().attr("id-word");

	$.ajax({
		type: "POST",
		url: "php/delete_association.php",
		data: { "idphoto": id_photo, "idword": id_word },
		dataType: "text",
		success: function(data) {
			var li_elem = $(span_elem).parent();
			var pane = li_elem.parent().parent().parent();

			li_elem.remove();
			var api = pane.data('jsp');
			api.reinitialise();
		}
	});
}

function exist_word(word, input_elem, div_select) {
	$.ajax({
		type: "POST",
		url: "php/exist_word.php",
		data: { "word": word },
		dataType: "text",
		success: function(data) {
			if(data == "true") {
				if(div_select != undefined) {
					if(already_associate(div_select, word)) {
						setTimeout(function() {
							$(input_elem).css({
								"border": "1px solid #FF0000"
							});
						}, 100);
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

function already_associate(div_selection, word) {
	var words_li = $(div_selection).find(".jspPane").find("li");
	for (var i = 0; i < words_li.length; i++) {
		var curr_word = $(words_li[i]).html().replace(' <span onclick="delete_word(this, event);">[x]</span>', '');
		if(curr_word == word) {
			return true;
		}
	}

	return false;
}

function store_association(id_photo, word, div_selection, input_elem) {
	$.ajax({
		type: "POST",
		url: "php/store_association.php",
		data: { "idphoto": id_photo, "word": word },
		dataType: "text",
		success: function(data) {
			var new_li = document.createElement("li");
			$(new_li).append(data.replace('"', '').replace('"', '') + " <span onclick='delete_word(this, event);'>[x]</span>");
			$(new_li).hover(function() {
				$(this).find("span").show();
			}, function() {
				$(this).find("span").hide();
			});

			var ul_words = div_selection.find(".jspPane")[0];
			$(ul_words).append(new_li);
			$(input_elem).val("");

			var pane = div_selection.find(".words_select");
			var api = pane.data('jsp');
			api.reinitialise();
		}
	});
}

function filter_dictionary(input_elem, event) {
	if(event.keyCode == 32) {
		event.preventDefault();
		event.stopPropagation();
		return;
	} else if(event.keyCode == 13) {
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
				$("#words_dictionary .jspPane").empty();
				for (var i = 0; i < data.length; i++) {
					var new_li = document.createElement("li");
					$(new_li).attr("id-word", data[i]["id"]);
					$(new_li).on("click", function() {
						selectDictionaryWord(this);
					});
					$(new_li).html(data[i]["word"]);

					$("#words_dictionary .jspPane").append(new_li);
				};

				var api = $("#words_dictionary").data('jsp');
				api.reinitialise();
			}
		});
	}
}

function selectDictionaryWord(li_elem) {
	// Estilo
	if($(li_elem).hasClass("word_dict_selec")) {
		$(li_elem).removeClass("word_dict_selec");
	} else {
		$(li_elem).addClass("word_dict_selec");
	}
}

function adding_category(input_elem, event) {
	var new_category = $(input_elem).val();
	while(new_category.lastIndexOf(" ") != -1) {
		new_category = new_category.replace(" ", "");
	}

	if(event.keyCode == 13) {
		if(new_category != "") {
			$.ajax({
				type: "POST",
				url: "php/store_category.php",
				data: { "category": new_category },
				dataType: "text",
				success: function(data) {
					var new_li = document.createElement("li");
					$(new_li).append(data.replace('"', '').replace('"', '') + " <span onclick='delete_category(this, event);'>[x]</span>");
					$(new_li).hover(function() {
						$(this).find("span").show();
					}, function() {
						$(this).find("span").hide();
					});

					var ul_categories = $("#categories").find(".jspPane")[0];
					$(ul_categories).append(new_li);
					$(input_elem).val("");

					var api = $("#categories").data('jsp');
					api.reinitialise();
				}
			});
		}
	}
}

function associate_to_all(word) {
	var select_photos_ids = "";
	var select_photos = $(".photo_selection");
	for (var i = 0; i < select_photos.length; i++) {
		if(!already_associate(select_photos[i], word)) {
			select_photos_ids += $(select_photos[i]).attr("id-photo") + ",";
		}
	}

	$.ajax({
		type: "POST",
		url: "php/associate_to_all.php",
		data: { "selec_photos": select_photos_ids,"word": word },
		dataType: "json",
		success: function(data) {
			var select_photos = $(".photo_selection");
			for (var i = 0; i < select_photos.length; i++) {
				
				if(!already_associate(select_photos[i], word)) {
					var new_li = document.createElement("li");
					$(new_li).append(data.replace('"', '').replace('"', '') + " <span onclick='delete_word(this, event);'>[x]</span>");
					$(new_li).hover(function() {
						$(this).find("span").show();
					}, function() {
						$(this).find("span").hide();
					});

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

	// Efecto mostrar borrar categorias
	$("#categories li").hover(function() {
		$(this).find("span").show();
	}, function() {
		$(this).find("span").hide();
	});


	// Asocia a todas
	$("#dictionary_all").click(function(event) {
		var select_dict_words = $(".word_dict_selec");

		if(select_dict_words.length > 0) {
			for (var i = 0; i < select_dict_words.length; i++) {
				associate_to_all($(select_dict_words[i]).html());

				$(select_dict_words[i]).removeClass("word_dict_selec");				
			}
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

	// Boton hacia atrás
	$("#back_button").on("click", function(event) {
		window.location = "index.html";
	});
});
