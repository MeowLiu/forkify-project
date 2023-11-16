import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import "core-js/stable";
import "regenerator-runtime/runtime";

const timeout = function (s) {
	return new Promise(function (_, reject) {
		setTimeout(function () {
			reject(
				new Error(`Request took too long! Timeout after ${s} second`)
			);
		}, s * 1000);
	});
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
const controlRecipes = async function () {
	try {
		// 0) Get id from widow
		const id = window.location.hash.slice(1);
		console.log(recipeView, id);
		if (!id) return;
		recipeView.renderSpiner();

		// 1) loading recipe
		await model.loadRecipe(id);
		const recipe = model.state.recipe;

		// 2) render receipe
		recipeView.render(recipe);
	} catch (err) {
		alert(err);
	}
};

// controlRecipes()
["hashchange", "load"].forEach((event) =>
	window.addEventListener(event, controlRecipes)
);
// window.addEventListener("hashchange", controlRecipes);
// window.addEventListener("load", controlRecipes);
