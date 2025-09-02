import View from "./view.js";
import preview from "./preview.js";

class BookmarksView extends View {
  _parentElement = document.querySelector(".bookmarks__list");
  _bookmarks = document.querySelector(".bookmarks");
  _openBookmarksBtn = document.querySelector(".nav__btn--bookmarks");
  _closeBookmarksBtn = document.querySelector(".bookmarks__close");
  _clearBookamrksBtn = document.querySelector(".bookmarks__clear");

  _errorMessage = "No bookmarks yet. Find a nice recipe and bookmark it :)";

  constructor() {
    super();
    this._addHandlerShowBookmarks();
    this._addHandlerHideBookmarks();
  }

  addHandlerRender(handler) {
    window.addEventListener("load", handler);
  }

  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", (e) => {
      const preview = e.target.closest(".preview__link");
      if (!preview) return;
      handler();
    });
  }

  addHandlerClear(handler) {
    this._clearBookamrksBtn.addEventListener("click", handler);
  }

  _addHandlerShowBookmarks() {
    this._openBookmarksBtn.addEventListener(
      "click",
      this._toggleBookmarks.bind(this)
    );
  }

  _addHandlerHideBookmarks() {
    this._closeBookmarksBtn.addEventListener(
      "click",
      this._toggleBookmarks.bind(this)
    );
    document.addEventListener("keydown", this._escBtnCloseBookmarks.bind(this));
  }

  _toggleBookmarks() {
    this._bookmarks.classList.toggle("bookmarks__open");
  }

  _escBtnCloseBookmarks(e) {
    if (
      e.key === "Escape" &&
      this._bookmarks.classList.contains("bookmarks__open")
    )
      this._toggleBookmarks();
  }

  _generateHtml() {
    return this._data
      .map((bookmark) => preview._generateHtml(bookmark))
      .join("");
  }
}

export default new BookmarksView();