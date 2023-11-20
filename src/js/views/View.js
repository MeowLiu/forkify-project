import { mark } from "regenerator-runtime";
import icons from "url:../../img/icons.svg";

export default class View {
	_data;
	/**
	 * Render the recipe object to the DOM
	 * @param {Object | Object[]} data the data to be render (e.g. recipe)
	 * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
	 * @returns {undefined | string} A markup string is returned if render is false
	 * @this {Object} View instance
	 * @author Meow Liu
	 */
	render(data, render = true) {
		if (!data || (Array.isArray(data) && data.length === 0))
			return this.renderError();

		this._data = data;
		const markup = this._generateMarkup();

		if (!render) return markup;

		this._clear();
		this._parentElement.insertAdjacentHTML("afterbegin", markup);
	}

	update(data) {
		this._data = data;
		const newMarkup = this._generateMarkup();
		const newDom = document
			.createRange()
			.createContextualFragment(newMarkup);
		const newElement = Array.from(newDom.querySelectorAll("*"));
		const curElement = Array.from(
			this._parentElement.querySelectorAll("*")
		);
		newElement.forEach((newEl, index) => {
			const curEl = curElement[index];
			// Compare the diffrence and update changed text.
			// console.log(curEl, newEl.isEqualNode(curEl), newEl);
			if (
				!newEl.isEqualNode(curEl) &&
				newEl.firstChild?.nodeValue.trim() !== ""
			) {
				// console.log(newEl.firstChild?.nodeValue.trim(), "🙄🙄🙄🙄🙄");
				curEl.textContent = newEl.textContent;
			}

			// Compare the diffrence and update changed attributes.
			if (!newEl.isEqualNode(curEl)) {
				Array.from(newEl.attributes).forEach((attr) =>
					curEl.setAttribute(attr.name, attr.value)
				);
			}
		});
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
