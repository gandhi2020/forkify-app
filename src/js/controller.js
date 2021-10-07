// import {state, loadRecipe} from './model.js';
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

// import icons from '../img/icons.svg'; // Parcel 1
// import icons from 'url:../img/icons.svg'; // Parcel 2
// console.log(icons);
import 'core-js/stable'; //to polyfill everything except async await.
import 'regenerator-runtime/runtime'; // to polyfill async await.
import { async } from 'regenerator-runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
// console.log('Test');

// activating hot module reloading with parcel.
// this is from parcel.
// if(module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    console.log('inside controlRecipes async function');

    const id = window.location.hash.slice(1);
    // console.log(id);

    if (!id) return;
    recipeView.renderSpinner();

    // console.log('spinner rendered');

    // 0. update resultsView to mark selected search result
    resultsView.update(model.getSearchResultPage());
    // 3. Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 1. Loading recipe
    await model.loadRecipe(id);
    const { recipe } = model.state;

    // console.log('recipe object in controlRecipes');
    // console.log(recipe);

    // const bookmarked = model.state.bookmarked;
    // console.log('bookmarked object in controlRecipes');
    // console.log(bookmarked);

    // 2. Rendering recipe
    recipeView.render(recipe);

    // console.log('rendered recipeView');
  } catch (err) {
    // console.log(err);
    // recipeView.renderError(`${err} ❌❌❌`);
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    console.log('Logging resultsView');
    // console.log(resultsView);

    // 1. Get search query
    const query = searchView.getQuery();
    if (!query) {
      return;
    }

    // 2. Load search results
    await model.loadSearchResults(query);

    // 3. Render search results
    // resultsView.render(model.state.search.results);

    //4. Include pagination
    console.log('value of model.getSearchResultPage method');
    console.log(model.getSearchResultPage());
    resultsView.render(model.getSearchResultPage());

    //5. Render pagination buttons
    paginationView.render(model.state.search);

    console.log('search.results object in controlSearchResults');
    console.log(model.state.search.results);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // console.log('Page controller');
  // console.log(goToPage);

  resultsView.render(model.getSearchResultPage(goToPage));
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // update the recipe servings
  model.updateServings(newServings);

  // update/render the recipeView
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1. Add or remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
    // console.log('test 1');
  } else {
    model.deleteBookmark(model.state.recipe.id);
    // console.log('test 2');
  }

  // if (model.state.recipe.bookmarked) {
  //   model.deleteBookmark(model.state.recipe.id);
  // }

  // 2. Update recipe view
  // console.log('display the recipe object', model.state.recipe);
  // console.table('display bookmark array', model.state.bookmarks);
  recipeView.update(model.state.recipe);

  // 3. Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  // console.log(newRecipe);

  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    //upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render recipe view
    recipeView.render(model.state.recipe);

    // success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change id in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close form window
    setTimeout(function () {
      addRecipeView._toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);


  } catch (err) {
    console.error('🔥', err);
    addRecipeView.renderError(err.message);
  }
};

const newFeature = function() {
  console.log('Welcome to the application');
}
// publisher-subscriber pattern
// subscriber for the different events.
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature();
};

init();
// console.log('Initialization method completed');

// window.addEventListener('hashchange', controlRecipes); //when the hashvalue in the webpage changes.
// window.addEventListener('load', controlRecipes); //when the webPage is loading. To load page with special ID.

// model.loadSearchResults('pizza');
// console.log("load searchresults loaded");
