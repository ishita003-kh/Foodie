import View from "./view";

class AddRecipe extends View {
  _parentElement = document.querySelector(".upload");
  _overlay = document.querySelector(".overlay");
  _window = document.querySelector(".add-recipe-window");
  _btnOpen = document.querySelector(".nav__btn--add-recipe");
  _btnClose = document.querySelector(".btn__close-window");

  _message = `Recipe is successfully uploaded :)`;

  constructor() {
    super();
    this._addHandlerOpenWindow();
    this._addHandlerCloseWindow();
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener("submit", function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  _addHandlerOpenWindow() {
    this._btnOpen.addEventListener("click", this.openWindow.bind(this));
  }

  _addHandlerCloseWindow() {
    this._btnClose.addEventListener("click", this.closeWindow.bind(this));
    this._overlay.addEventListener("click", this.closeWindow.bind(this));
    document.addEventListener("keydown", this._escCloseWindow.bind(this));
  }

  openWindow() {
    this._window.classList.remove("hidden");
    this._overlay.classList.remove("hidden");
  }

  closeWindow() {
    this._window.classList.add("hidden");
    this._overlay.classList.add("hidden");
  }

  _escCloseWindow(e) {
    if (
      e.key === "Escape" &&
      !this._window.classList.contains("hidden") &&
      !this._overlay.classList.contains("hidden")
    )
      this.closeWindow();
  }
}

export default new AddRecipe();