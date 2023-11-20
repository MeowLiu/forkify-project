import { API_URL, RESULTS_PER_PAGE, KEY } from "./config.js";
import { AJAX } from "./helper.js";

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

const createRecipeObject = function (data) {
	const { recipe } = data.data;
	return {
		id: recipe.id,
		title: recipe.title,
		publisher: recipe.publisher,
		sourceUrl: recipe.source_url,
		image: recipe.image_url,
		servings: recipe.servings,
		cookingTime: recipe.cooking_time,
		ingredients: recipe.ingredients,
		...(recipe.key && { key: recipe.key }),
	};
};

// Get data from API
export const loadRecipe = async function (id) {
	try {
		// Get data of request
		const url = `${API_URL}${id}?key=${KEY}`;
		const data = await AJAX(url);
		const { recipe } = data.data;

		// Rebuild recipe
		state.recipe = createRecipeObject(data);
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
		const url = `${API_URL}?search=${query}&key=${KEY}`;
		const data = await AJAX(url);

		state.search.query = query;
		state.search.results = data.data.recipes.map((rec) => {
			return {
				id: rec.id,
				title: rec.title,
				publisher: rec.publisher,
				image: rec.image_url,
				...(rec.key && { key: rec.key }),
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

export const uploadRecipe = async function (newRecipe) {
	try {
		const ingredients = Object.entries(newRecipe)
			.filter(
				(entry) => entry[0].startsWith("ingredient") && entry[1] !== ""
			)
			.map((ing) => {
				const ingArr = ing[1].replaceAll(" ", "").split(",");
				if (ingArr.length !== 3)
					throw new Error(
						"Wrong ingredient format, please use the correct format.😅"
					);

				const [quantity, unit, description] = ingArr;
				return {
					quantity: quantity ? +quantity : null,
					unit,
					description,
				};
			});

		const recipe = {
			title: newRecipe.title,
			publisher: newRecipe.publisher,
			source_url: newRecipe.sourceUrl,
			image_url: newRecipe.image,
			servings: newRecipe.servings,
			cooking_time: newRecipe.cookingTime,
			ingredients,
		};
		const data = await AJAX(`${API_URL}/?key=${KEY}`, recipe);
		state.recipe = createRecipeObject(data);
	} catch (err) {
		throw err;
	}
};
