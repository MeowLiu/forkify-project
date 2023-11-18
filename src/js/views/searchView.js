class searchView {
	_parentElement = document.querySelector(".search");

	getQuery() {
		const query = this._parentElement.querySelector(".search__field").value;
		this._clearInput();
		return query;
	}

	_clearInput() {
		this._parentElement.querySelector(".search__field").value = "";
	}

	addhandlerSearch(handler) {
		this._parentElement.addEventListener("submit", (event) => {
			event.preventDefault();
			handler();
		});
	}
}

export default new searchView();
