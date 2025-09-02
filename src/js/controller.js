
import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipe from "./views/addRecipe.js";
import { WINDOW_CLOSE_SECONDS } from "./config.js";

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // load recipe
    await model.loadRecipe(id);

    // render recipe
    recipeView.render(model.state.recipe);

    // update active recipe
    resultsView.update(model.getResultsPerPage());
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError(err.message);
  }
};

const controlOpenRecipe = function () {
  const mediaQuery = window.matchMedia("(max-width: 740px)");
  if (mediaQuery.matches) {
    recipeView.openRecipe();
  } else {
    recipeView.closeRecipe();
  }
};

const controlCloseRecipe = function () {
  recipeView.closeRecipe();
};

const controlSearchResults = async function () {
  try {
    // get search query
    const query = searchView.getQuery();
    if (!query) return;

    resultsView.renderSpinner();

    // load search results for query
    await model.loadSearchResults(query);

    // render search results
    resultsView.render(model.getResultsPerPage());

    // render pagination
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError(err.message);
  }
};

const controlResultsMessage = function () {
  const mediaQuery = window.matchMedia("(max-width: 740px)");
  if (mediaQuery.matches) {
    resultsView.renderMessage();
  }
};

const controlPagination = function (goToPage) {
  resultsView.render(model.getResultsPerPage(goToPage));
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
};

const controlAddbookmark = function () {
  // add bookmars
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe);
  }
  // update recipe view
  recipeView.update(model.state.recipe);
  //render bookmarks view
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  model.updateBookmarks();
  bookmarksView.render(model.state.bookmarks);
};

const controlClearBookmarks = function () {
  model.clearBookmarks();
  model.updateBookmarks();
  bookmarksView.render(model.state.bookmarks);
  recipeView.update(model.state.recipe);
  bookmarksView.update(model.state.bookmarks);
};

const controlUploadRecipe = async function (newRecipe) {
  try {
    // render spinner
    addRecipe.renderSpinner();
    // get uploaded recipe data
    await model.uploadRecipe(newRecipe);
    // render recipe
    recipeView.render(model.state.recipe);
    // success message
    addRecipe.renderMessage();
    // render bookmarks
    bookmarksView.render(model.state.bookmarks);
    // change id in url
    window.history.pushState(null, "", `#${model.state.recipe.id}`);
    // close the window
    setTimeout(() => {
      addRecipe.closeWindow();
    }, WINDOW_CLOSE_SECONDS * 1000);
  } catch (err) {
    addRecipe.renderError(err.message);
  }
};

const init = function () {
  recipeView.renderMessage();
  bookmarksView.renderError();
  bookmarksView.addHandlerRender(controlBookmarks);
  bookmarksView.addHandlerClear(controlClearBookmarks);
  bookmarksView.addHandlerClick(controlOpenRecipe);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddbookmark);
  recipeView.addHandlerCloseRecipe(controlCloseRecipe);
  resultsView.addHandlerClick(controlOpenRecipe);
  controlResultsMessage();
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipe.addHandlerUpload(controlUploadRecipe);
};
init();