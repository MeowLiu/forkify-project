import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";
import "core-js/stable";
import "regenerator-runtime/runtime";
import { CLOSE_WINDOW_SEC } from "./config.js";

if (module.hot) {
	module.hot.accept();
}

const controlRecipes = async function () {
	try {
		// -1) Update result view to mark selected search result
		resultsView.update(model.getSearchResultPage());

		// 0) Get id from widow
		const id = window.location.hash.slice(1);

		if (!id) return;
		recipeView.renderSpiner();

		// 1) loading recipe
		await model.loadRecipe(id);

		// 2) render receipe
		const recipe = model.state.recipe;
		recipeView.render(recipe);

		// 3) updating bookmarkView
		bookmarksView.update(model.state.bookmarks);
	} catch (err) {
		// Render error to the view
		recipeView.renderError();
	}
};

// Get search result and add to satae of model
const controlSearchResults = async function () {
	try {
		resultsView.renderSpiner();

		// 1)Get search query
		const query = searchView.getQuery();
		if (!query) return;

		// 2)load results
		await model.loadSearchResult(query);

		// 3) Render 10 results per page
		resultsView.render(model.getSearchResultPage());

		// 4) Render initial pagination buttons
		paginationView.render(model.state.search);
	} catch (err) {
		console.error(err);
	}
};

const controlPagination = function (gotoPage) {
	// 1) Render new results
	resultsView.render(model.getSearchResultPage(gotoPage));

	// 2) Render new pagination buttons
	paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
	// Update the recipe servings (in state)
	model.updateServings(newServings);

	// Update the recipe view
	const recipe = model.state.recipe;
	// recipeView.render(recipe);
	recipeView.update(recipe);
};

const controlAddBookmark = function () {
	// 1) Add/remove bookmark to model
	if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
	else model.removeBookmark(model.state.recipe.id);

	// 2) Update recioe
	recipeView.update(model.state.recipe);

	// 3) Render bookmarks view
	bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
	bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
	try {
		// Show the spinner
		addRecipeView.renderSpiner();

		// Upload the new recipe data
		await model.uploadRecipe(newRecipe);

		// Render recipe
		recipeView.render(model.state.recipe);

		// Success message
		addRecipeView.renderMessage();

		// Render bookmark view
		bookmarksView.render(model.state.bookmarks);

		// Change ID in the URL
		window.history.pushState(null, "", `#${model.state.recipe.id}`);

		// Close the form
		setTimeout(function () {
			addRecipeView.toggleWindow();
		}, CLOSE_WINDOW_SEC * 1000);
	} catch (err) {
		addRecipeView.renderError(err.message);
		console.error(err);
	}
};

const newFeature = function () {
	console.log("Welcome new feature!");
};

const init = function () {
	bookmarksView.addHandlerRender(controlBookmarks);
	recipeView.addHandlerRernder(controlRecipes);
	recipeView.addHandlerUpdateServings(controlServings);
	searchView.addhandlerSearch(controlSearchResults);
	paginationView.addHandlerClick(controlPagination);
	recipeView.addHandlerAddBookmark(controlAddBookmark);
	addRecipeView.addHandlerUpload(controlAddRecipe);
	newFeature();
};

init();
