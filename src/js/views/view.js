import icons from "url:../../imgs/icons.svg";
import { metronome } from "ldrs";

export default class View {
  _data;

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const html = this._generateHtml();
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", html);
  }

  update(data) {
    this._data = data;
    const newHtml = this._generateHtml();
    const newDom = document.createRange().createContextualFragment(newHtml);
    const currentElements = Array.from(
      this._parentElement.querySelectorAll("*")
    );
    const newElements = Array.from(newDom.querySelectorAll("*"));
    newElements.forEach((newEl, i) => {
      const currEl = currentElements[i];

      // update changed text
      if (
        !newEl.isEqualNode(currEl) &&
        newEl.firstChild?.nodeValue !== null &&
        newEl.firstChild?.nodeValue.trim() !== ""
      ) {
        currEl.textContent = newEl.textContent;
      }

      // update changed attributes
      if (!newEl.isEqualNode(currEl)) {
        Array.from(newEl.attributes).forEach((attr) => {
          currEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }

  renderSpinner() {
    metronome.register();
    const html = `
        <div class="spinner">
          <l-metronome
            size="60"
            stroke="5"
            speed="1" 
            color="#107e7d" 
          ></l-metronome>
        </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", html);
  }

  renderMessage(message = this._message) {
    const html = `
        <div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", html);
  }

  renderError(message = this._errorMessage) {
    const html = `
        <div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", html);
  }
}