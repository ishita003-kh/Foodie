const icons = "src/imgs/icons.svg";
import View from "./view.js";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn--inline");
      if (!btn) return;
      const goTo = +btn.dataset.goto;
      handler(goTo);
    });
  }

  _generateHtml() {
    const pages = {
      currPage: this._data.page,
      numResults: this._data.results.length,
      numPages: Math.ceil(
        this._data.results.length / this._data.resultsPerPage
      ),
    };

    // page 1 && there are other pages
    if (pages.currPage === 1 && pages.numPages > 1) {
      return [
        this._generatePagesCountHtml(pages),
        this._generateNextButtonHtml(pages),
      ].join("");
    }

    // last page
    if (pages.currPage === pages.numPages && pages.numPages > 1) {
      return [
        this._generatePreviousButtonHtml(pages),
        this._generatePagesCountHtml(pages),
      ].join("");
    }

    // other page
    if (pages.currPage < pages.numPages) {
      return this._generateBothButtons(pages);
    }

    // only one page
    return "";
  }

  _generateNextButtonHtml(data) {
    return `
          <button data-goto="${
            data.currPage + 1
          }" class="btn--inline pagination__btn--next">
            <span>Page ${data.currPage + 1}</span>
            <svg class="pagination__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
          `;
  }

  _generatePreviousButtonHtml(data) {
    return `
          <button data-goto="${
            data.currPage - 1
          }" class="btn--inline pagination__btn--prev">
            <svg class="pagination__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${data.currPage - 1}</span>
          </button>
          `;
  }

  _generatePagesCountHtml(data) {
    return `
          <div class="pagination__info">
            <span class="pagination__current-page">page ${data.currPage}</span>
            <span class="pagination__total-pages">${data.numResults} results / ${data.numPages} pages</span>
          </div>`;
  }

  _generateBothButtons(data) {
    return [
      this._generatePreviousButtonHtml(data),
      this._generatePagesCountHtml(data),
      this._generateNextButtonHtml(data),
    ].join("");
  }
}

export default new PaginationView();