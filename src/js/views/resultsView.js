import View from "./View.js";
import previewView from "./previewView.js";

class ResultsView extends View {
	_parentElement = document.querySelector(".results");
	_errorMessage = `No recipe found for your query, please try another one 😅`;
	_message = "";

	_generateMarkup() {
		console.log(this._data);

		return this._data.reduce(
			(acc, result) => acc + previewView.render(result, false),
			""
		);
	}
}

export default new ResultsView();
