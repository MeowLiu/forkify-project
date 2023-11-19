import View from "./View.js";
import previewView from "./previewView.js";

class bookmarksView extends View {
	_parentElement = document.querySelector(".bookmarks__list");
	_errorMessage = `No recipe found for your bookmarks, please try another one 😅`;
	_message = "";

	addHandlerRender(handler) {
		window.addEventListener("load", handler);
	}

	_generateMarkup() {
		console.log(this._data);

		return this._data.reduce(
			(acc, bookmark) => acc + previewView.render(bookmark, false),
			""
		);
	}
}

export default new bookmarksView();
