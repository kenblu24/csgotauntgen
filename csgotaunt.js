//csgotaunts v1.2 by Kevin "Videblu" Zhu

var tauntid = randomstring();
var title = $("#title");
var result = $("#result");
var notifications = $(".notifications");
var usrset = {featurelvl: 0}
var removed = {}
var outputdata = [];

function randomstring(){// sets tauntid to a randomly generated 3 letter string. tauntid is a unique id for the taunt.
	var text = "";
	var possible = "abcdefghijklmnopqrstuvwxyz";
	for( var i=0; i < 3; i++ ){
		var thischar = possible.charAt(Math.floor(Math.random() * possible.length));
		text = text + thischar;
	}
	return text;
}

function evaluate (b) {
	var txtin = b.split("\n"); //txtin is the input text split into lines as an array.
	var processed = [];
	var o = 0; //o is the current GOOD line. It must exist because var i ignores bad/empty lines , meaning the numbering would be off.
	var n = "";
	removed = {empty: 0, illegal: 0, titleempty: false, titleillegal: false, none: false}

	if (title.val().replace(/( |"|\;)+/g,"").length) {

		if (title.val().match(/( |"|\;)+/g,"")) {removed.titleillegal = true}
		n = title.val().replace(/( |"|\;)+/g,"");

	}
	else {n = tauntid; removed.titleempty = true} //sanitize Title (remove spaces, ", and ; ) use randomly generated string if empty.

	for (var i = 0; i < txtin.length; i++) {//goes through txtin, adds logic, and pushes good lines to processed[] and logs if things were removed.
		var q;

		illegalchars = txtin[i].match(/(\;)/g);

		if (illegalchars) {//remove illegal characters from current line.
			removed.illegal += illegalchars.length;
			txtin[i] = txtin[i].replace(/((\;)+)+/g,"");
		}

		txtin[i] = txtin[i].replace(/((\")+)+/g,"'");

		if (i != txtin.length - 1) {q = o + 1}
		else {q = 0}

		if (txtin[i].length && !txtin[i].match(/^ +$/)) {//if sanitized line is not empty (if more than 0 chars and not just space), proccess and push.
			var p = "alias \"" + n + o.toString() +"\" \"say " + txtin[i] + "; alias " + n + " " + n + q.toString() + "\""; //add logic
			processed.push (p);
			o++;
		}
		else {removed.empty++} //log the removed lines to removed.newline

		if (!o) {removed.empty = 0; removed.none = true} //if there are no good lines, set removed.empty to 0 so that no notification comes up.

	}
	if (!removed.none) {
		processed.unshift ("alias " + n + " " + n + "0 // To use this taunt, bind a key to \"" + n + "\" ");
	}
	return processed
}

function render (a) {
	result.empty();
	for (var i = 0; i < a.length; i++) {//appends each line to result div.
		result.append( a[i] + "<br>");
	};
	notifications.empty();
	if (removed.illegal) {notifications.append("<div class='alert warning'> We removed (" + removed.illegal + ") <span class='hovertxt' data-toggle='tooltip' data-placement='top' title='The following are illegal characters: &nbsp; &quot &nbsp; &nbsp;&semi;'>illegal characters</span> from your text. <button type='button' class='close'></button></div>")};
	if (removed.empty) {notifications.append("<div class='alert info'><button type='button' class='close'></button> We removed (" + removed.empty + ") empty lines.</div>")};
	if (removed.titleempty) {notifications.append("<div class='alert info'> Title is empty, using randomly generated string. <button type='button' class='close'></button></div>")};
	if (removed.titleillegal) {notifications.append("<div class='alert warning'> We removed some <span class='hovertxt' data-toggle='tooltip' data-placement='top' title='The following are illegal characters: &nbsp; &quot &nbsp; &nbsp; &semi; &nbsp; &nbsp; SPACE'>illegal characters</span> from your title. <button type='button' class='close'></button></div>")};
	$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})
}

$( document ).ready(function() {
	$("#input").change(function() {//if input loses focus, run script.
		render(evaluate($("#input").val()));
	});
	title.change(function() {//if title input loses focus, run script.
		render(evaluate($("#input").val()));
	});
	notifications.on("click", ".close", function(){$(this).parent().remove()});
	result.dblclick(function(){$(result).selectText()});
	console.log("I sincerely apologize for the mediocre comments, I'm not the best at this.");
});


/*todo:
	add bind customizability
	add download
*/


$.fn.selectText = function () {
	return $(this).each(function (index, el) {
		if (document.selection) {
			var range = document.body.createTextRange();
			range.moveToElementText(el);
			range.select();
		} else if (window.getSelection) {
			var range = document.createRange();
			range.selectNode(el);
			window.getSelection().removeAllRanges();
			window.getSelection().addRange(range);
		}
	});
}