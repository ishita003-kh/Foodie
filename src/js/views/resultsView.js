import View from "./view.js";
import preview from "./preview.js";

class ResultsView extends View {
  _parentElement = document.querySelector(".results");
  _message = "Start by searching for a recipe or ingredient. Have fun!";
  _errorMessage = "No recipe found for your query! Please try again.";

  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", (e) => {
      const preview = e.target.closest(".preview__link");
      if (!preview) return;
      handler();
    });
  }

  _generateHtml() {
    return this._data.map((result) => preview._generateHtml(result)).join("");
  }
}

export default new ResultsView();