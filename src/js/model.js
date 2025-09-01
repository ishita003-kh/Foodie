import { API_KEY, API_URL, RESULTS_PER_PAGE } from "./config";
import { AJAX } from "./helpers";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    resultsPerPage: RESULTS_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

const createRecipe = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    cookingTime: recipe.cooking_time,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    src: recipe.source_url,
    servings: recipe.servings,
    title: recipe.title,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);
    state.recipe = createRecipe(data);
    if (state.bookmarks.some((bookmark) => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    state.search.results = data.data.recipes.map((recipe) => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getResultsPerPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.map((ing) => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

const saveBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const updateBookmarks = function () {
  const storageData = localStorage.getItem("bookmarks");
  if (storageData) state.bookmarks = JSON.parse(storageData);
};

export const addBookmark = function (recipe) {
  // add bookmark
  state.bookmarks.push(recipe);
  // mark recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  saveBookmarks();
};

export const deleteBookmark = function (recipe) {
  // delete bookmark
  const index = state.bookmarks.findIndex((el) => el.id === recipe.id);
  state.bookmarks.splice(index, 1);
  // mark recipe as not bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = false;
  saveBookmarks();
};

export const clearBookmarks = function () {
  state.bookmarks.forEach((recipe) => (recipe.bookmarked = false));
  state.bookmarks = [];
  state.recipe.bookmarked = false;
  saveBookmarks();
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith("ing") && entry[1] !== "")
      .map((ing) => {
        const ingArr = ing[1].split(",").map((el) => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            `Wrong ingredient format! Please use the correct format :)`
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      cooking_time: newRecipe.cookingTime,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      servings: newRecipe.servings,
      source_url: newRecipe.sourceUrl,
      ingredients: ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipe(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};