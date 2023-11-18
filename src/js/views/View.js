import icons from "url:../../img/icons.svg";

export default class View {
	_data;
	// Render everything of recipe
	render(data) {
		if (!data || (Array.isArray(data) && data.length === 0))
			return this.renderError();
		this._data = data;
		const markup = this._generateMarkup();
		this._clear();
		this._parentElement.insertAdjacentHTML("afterbegin", markup);
	}

	// Clear all of innerHtml
	_clear() {
		this._parentElement.innerHTML = "";
	}

	// Render spiner
	renderSpiner() {
		const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div> 
      `;
		this._clear();
		this._parentElement.insertAdjacentHTML("afterbegin", markup);
	}

	// Render Error
	renderError(message = this._errorMessage) {
		const markup = `
            <div class="error">
                <div>
                    <svg>
                        <use href="${icons}#icon-alert-triangle"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>
        `;
		this._clear();
		this._parentElement.insertAdjacentHTML("afterbegin", markup);
	}

	renderMessage(message = this._message) {
		const markup = `
            <div class="message">
                <div>
                    <svg>
                        <use href="${icons}#icon-smile"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>
        `;
		this._clear();
		this._parentElement.insertAdjacentHTML("afterbegin", markup);
	}
}
