class SearchView {
  #parentElement = document.querySelector(".search");
  #searchField = this.#parentElement.querySelector(".search__field");

  addHandlerSearch(handler) {
    this.#parentElement.addEventListener("submit", function (e) {
      e.preventDefault();
      handler();
    });

    window.addEventListener("load", () => {
      this.#searchField.focus();
    });
  }

  getQuery() {
    const query = this.#searchField.value.trim();
    this.#searchField.value = "";
    return query;
  }
}

export default new SearchView();