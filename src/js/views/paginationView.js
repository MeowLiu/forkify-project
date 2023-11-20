import View from "./View.js";
import icons from "url:../../img/icons.svg";

class paginationView extends View {
	_parentElement = document.querySelector(".pagination");

	addHandlerClick(handler) {
		this._parentElement.addEventListener("click", (event) => {
			const btn = event.target.closest(".btn--inline");

			if (!btn) return;

			const gotoPage = +btn.dataset.goto;
			
			handler(gotoPage);
		});
	}

	_generateMarkup() {
		const curPage = this._data.page;
		const numPage = Math.ceil(
			this._data.results.length / this._data.resultPerPage
		);

		// Page 1, and there are other pages
		if (curPage === 1 && numPage > 1)
			return `
            <button data-goto="${
				curPage + 1
			}" class="btn--inline pagination__btn--next">
                <span>Page ${curPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
        `;

		// Last page
		if (curPage === numPage && numPage > 1)
			return `
            <button data-goto="${
				curPage - 1
			}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${curPage - 1}</span>
            </button>
        `;

		// Other page
		if (curPage < numPage)
			return `
            <button data-goto="${
				curPage - 1
			}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${curPage - 1}</span>
            </button>

            <button data-goto="${
				curPage + 1
			}" class="btn--inline pagination__btn--next">
                <span>Page ${curPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
        `;

		// Page 1, and there are no other pages
		return "";
	}
}

export default new paginationView();
