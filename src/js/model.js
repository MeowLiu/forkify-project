import { API_URL, RESULTS_PER_PAGE } from "./config.js";
import { getRquestData } from "./helper.js";

// Store the state
export const state = {
	recipe: {},
	search: {
		query: "",
		results: [],
		page: 1,
		resultPerPage: RESULTS_PER_PAGE,
	},
	bookmarks: [],
};

// Get data from API
export const loadRecipe = async function (id) {
	try {
		// Get data of request
		const url = `${API_URL}${id}`;
		const data = await getRquestData(url);
		const { recipe } = data.data;

		// Rebuild recipe
		state.recipe = {
			id: recipe.id,
			title: recipe.title,
			publisher: recipe.publisher,
			sourceUrl: recipe.source_url,
			image: recipe.image_url,
			servings: recipe.servings,
			cookingTime: recipe.cooking_time,
			ingredients: recipe.ingredients,
		};

		state.recipe.bookmarked = state.bookmarks.some(
			(bookmark) => bookmark.id === id
		)
			? true
			: false;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

export const loadSearchResult = async function (query) {
	try {
		const url = `${API_URL}?search=${query}`;
		const data = await getRquestData(url);

		state.search.query = query;
		state.search.results = data.data.recipes.map((rec) => {
			return {
				id: rec.id,
				title: rec.title,
				publisher: rec.publisher,
				image: rec.image_url,
			};
		});
		state.search.page = 1;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

export const getSearchResultPage = function (page = state.search.page) {
	state.search.page = page;

	const start = (page - 1) * state.search.resultPerPage; // 0
	const end = page * state.search.resultPerPage; // 9

	return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
	state.recipe.ingredients.forEach((ing) => {
		// newQt = oldQt * newServings / oldServings
		ing.quantity *= newServings / state.recipe.servings;
	});
	state.recipe.servings = newServings;
};

const persistBookmarks = function () {
	localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
	// Add bookmarks
	state.bookmarks.push(recipe);

	// Mark current recipe as bookmark
	if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

	persistBookmarks();
};

export const removeBookmark = function (id) {
	const index = state.bookmarks.findIndex((bookmark) => bookmark.id === id);
	// Remove bookmarks
	state.bookmarks.splice(index, 1);

	// Mark current recipe as bookmark
	if (id === state.recipe.id) state.recipe.bookmarked = false;
};

const init = function () {
	const storage = localStorage.getItem("bookmarks");
	if (storage) state.bookmarks = JSON.parse(storage);
};

init();

const clearBookmarks = function () {
	localStorage.clear("bookmarks");
};
