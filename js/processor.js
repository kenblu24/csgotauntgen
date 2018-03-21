class Options {
	constructor() {
		this.split = /\n/g;
		this.remove_blank_lines = true;
	}
}

class Data {
	constructor(){
		this.raw_text = "";
		this.title = "";
		this.bind = '';
		this.options = new Options();
	}

	static title (title_input) { //unused
		s = title_input.replace(/( |"|\;)+/g,"");
		if (s.length) {
			if (s.equals(title_input)) {return s}
				throw IllegalCharacters
		}
		else {throw TitleEmpty}
	}

	set_title (title_input) { //unused
		s = title_input.replace(/( |"|\;)+/g,"");
		if (s.length) {
			if (s.equals(title_input)) {this.title = s;return} // if no illegal characters were deleted, return the title
			throw IllegalCharacters
		}
		else {throw TitleEmpty}
	}
}
function evaluate (data) {
	var title = data.title;
	var split_text = data.raw_text.split(data.options.split); //split_text is the input text split into lines as an array.
	var processed = [];
	var o = 0; //o is the current GOOD line. It must exist because var i ignores bad/empty lines , meaning the numbering would be off.
	var empty = true; // if all bad characters and blank lines are removed, is input empty?
	var illegal_cnt = 0;
	var blank_lines = 0;

	for (var i = 0; i < split_text.length; i++) {//foreach in split_text
		var q; // alias suffix
		if (i != split_text.length - 1) {q = o + 1}
		else {q = 0} // loop to first alias.

		illegalchars = /\;/g
		illegal_cnt += split_text[i].match(illegalchars,""); // add instances of semicolons to error var.
		split_text[i] = split_text[i].replace(illegalchars,""); // remove semicolons from current line.
		split_text[i] = split_text[i].replace(/\"/g,"'"); // change all double quotes to single quotes.

		if ((split_text[i].length && !split_text[i].match(/^ +$/)) || !data.options.remove_blank_lines) {//if sanitized line is not empty (if more than 0 chars and not just space), proccess and push.
			var p = "alias \"" + title + o.toString() +"\" \"say " + split_text[i] + "; alias " + title + " " + title + q.toString() + "\""; //add logic
			processed.push (p);
			o++;
		}
		else {blank_lines++}
	}
	var temp = "alias " + title + " " + title + "0";
	if (data.bind) {
		processed.unshift(temp);
		processed.unshift("bind " + data.bind + " " + title);
	}
	else {
		processed.unshift (temp + " // To use this taunt, bind a key to \"" + title + "\" ");
	}

	return {"out": processed,
			"empty": empty,
			"illegal_cnt": illegal_cnt,
			"blank_lines": blank_lines
	}
}

