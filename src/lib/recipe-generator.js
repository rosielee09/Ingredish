// Convert MealDB recipe to our Recipe format
function convertMealDBToRecipe(
	mealDBRecipe,
	matchedIngredients = [],
	missingIngredients = []
) {
	// Extract ingredients from the MealDB format (strIngredient1, strIngredient2, etc.)
	const ingredients = [];
	for (let i = 1; i <= 20; i++) {
		const ingredient = mealDBRecipe[`strIngredient${i}`];
		if (ingredient && ingredient.trim()) {
			ingredients.push(ingredient.trim());
		}
	}

	// Split instructions into steps
	const instructions = mealDBRecipe.strInstructions
		? mealDBRecipe.strInstructions
				.split(/\r?\n/)
				.filter((step) => step.trim().length > 0)
				.map((step) => step.trim())
		: [];

	return {
		id: mealDBRecipe.idMeal,
		title: mealDBRecipe.strMeal,
		description: `Delicious ${mealDBRecipe.strMeal} recipe from TheMealDB`,
		cookTime: 30, // Default cook time since MealDB doesn't provide this
		difficulty: "Medium",
		ingredients,
		instructions,
		image: mealDBRecipe.strMealThumb,
		url: mealDBRecipe.strSource || "",
		matchedIngredients,
		missingIngredients,
	};
}

export async function searchRecipesByIngredient(ingredient) {
	// If the initial fetch fails (network or non-2xx) we throw so callers
	// (like the UI) can detect and show an error to the user.
	const response = await fetch(
		`https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(
			ingredient
		)}`
	);

	if (!response.ok) {
		const message = `HTTP error! status: ${response.status}`;
		console.error(message);
		throw new Error(message);
	}

	const data = await response.json();

	if (!data.meals) {
		return [];
	}

	// Get detailed recipe information for each meal. If an individual
	// detail fetch fails we log and skip that recipe rather than aborting
	// the whole search.
	const detailedRecipes = await Promise.all(
		data.meals.slice(0, 10).map(async (meal) => {
			try {
				const detailResponse = await fetch(
					`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
				);
				if (!detailResponse.ok) {
					console.error(
						`Detail fetch failed for ${meal.idMeal}: ${detailResponse.status}`
					);
					return null;
				}

				const detailData = await detailResponse.json();

				if (detailData.meals && detailData.meals[0]) {
					return convertMealDBToRecipe(
						detailData.meals[0],
						[ingredient],
						[]
					);
				}
				return null;
			} catch (error) {
				console.error(
					`Error fetching details for meal ${meal.idMeal}:`,
					error
				);
				return null;
			}
		})
	);

	return detailedRecipes.filter((recipe) => recipe !== null);
}

export async function searchRecipes(ingredients) {
	if (ingredients.length === 0) {
		return [];
	}

	try {
		// To support multiple ingredient searches, query MealDB for each
		// user ingredient (in parallel), merge results and compute
		// matched/missing ingredients across the whole user list.
		const uniqueUserIngredients = Array.from(
			new Set(ingredients.map((i) => i.toLowerCase().trim()))
		).filter(Boolean);

		// Limit the number of ingredient-based queries to avoid too many API calls
		const MAX_INGREDIENT_QUERIES = 6;
		const ingredientsToQuery = uniqueUserIngredients.slice(
			0,
			MAX_INGREDIENT_QUERIES
		);

		const resultsPerIngredient = await Promise.all(
			ingredientsToQuery.map((ing) =>
				searchRecipesByIngredient(ing)
			)
		);

		// Flatten results and dedupe by id, merging matchedIngredients where possible
		const allRecipes = resultsPerIngredient.flat();
		const recipeMap = new Map();

		allRecipes.forEach((recipe) => {
			const existing = recipeMap.get(recipe.id);
			if (!existing) {
				recipeMap.set(recipe.id, { ...recipe });
			} else {
				// merge matchedIngredients (keep unique)
				const mergedMatched = Array.from(
					new Set([
						...(existing.matchedIngredients ||
							[]),
						...(recipe.matchedIngredients ||
							[]),
					])
				);
				recipeMap.set(recipe.id, {
					...existing,
					matchedIngredients: mergedMatched,
				});
			}
		});

		const mergedRecipes = Array.from(recipeMap.values());

		// Recompute matched and missing ingredients relative to the full user list
		const recipesWithMatches = mergedRecipes.map((recipe) => {
			const normalizedUserIngredients = uniqueUserIngredients;
			const recipeIngredients = recipe.ingredients.map(
				(ing) => ing.toLowerCase().trim()
			);

			const matchedIngredients = recipeIngredients.filter(
				(ingredient) =>
					normalizedUserIngredients.some(
						(userIngredient) =>
							ingredient.includes(
								userIngredient
							) ||
							userIngredient.includes(
								ingredient
							)
					)
			);

			const missingIngredients = recipeIngredients.filter(
				(ingredient) =>
					!normalizedUserIngredients.some(
						(userIngredient) =>
							ingredient.includes(
								userIngredient
							) ||
							userIngredient.includes(
								ingredient
							)
					)
			);

			return {
				...recipe,
				matchedIngredients,
				missingIngredients,
			};
		});

		// Sort by match percentage and missing ingredients
		return recipesWithMatches.sort((a, b) => {
			const aMatchPercentage =
				a.matchedIngredients.length /
				Math.max(1, a.ingredients.length);
			const bMatchPercentage =
				b.matchedIngredients.length /
				Math.max(1, b.ingredients.length);

			if (aMatchPercentage !== bMatchPercentage) {
				return bMatchPercentage - aMatchPercentage;
			}

			return (
				a.missingIngredients.length -
				b.missingIngredients.length
			);
		});
	} catch (error) {
		// Bubble up the error so UI can display an appropriate message. We
		// still log for debugging.
		console.error("Error searching recipes:", error);
		throw error;
	}
}

export async function getRandomRecipe() {
	try {
		const response = await fetch(
			"https://www.themealdb.com/api/json/v1/1/random.php"
		);
		const data = await response.json();

		if (data.meals && data.meals[0]) {
			return convertMealDBToRecipe(data.meals[0]);
		}
	} catch (error) {
		console.error("Error fetching random recipe:", error);
	}

	// Fallback recipe if API fails
	return {
		id: "fallback",
		title: "Simple Pasta",
		description: "A basic pasta recipe when the API is unavailable",
		cookTime: 15,
		servings: 2,
		difficulty: "Easy",
		ingredients: ["pasta", "olive oil", "garlic", "salt", "pepper"],
		instructions: [
			"Boil water and cook pasta according to package directions",
			"Heat olive oil in a pan and sauté minced garlic",
			"Toss cooked pasta with garlic oil",
			"Season with salt and pepper to taste",
		],
		matchedIngredients: [],
		missingIngredients: [],
	};
}

export function findRecipesByIngredients(userIngredients) {
	console.warn(
		"findRecipesByIngredients is deprecated. Use searchRecipes instead."
	);
	return [];
}
