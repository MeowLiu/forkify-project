import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import "core-js/stable";
import "regenerator-runtime/runtime";

if (module.hot) {
	module.hot.accept();
}

const controlRecipes = async function () {
	try {
		// 0) Get id from widow
		const id = window.location.hash.slice(1);

		if (!id) return;
		recipeView.renderSpiner();

		// 1) loading recipe
		await model.loadRecipe(id);
		const recipe = model.state.recipe;

		// 2) render receipe
		recipeView.render(recipe);
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
	} catch (err) {
		console.log(err);
	}
};

const init = function () {
	recipeView.addHandlerRernder(controlRecipes);
	searchView.addhandlerSearch(controlSearchResults);
};

init();
