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
    .split(/\r?\n/)
    .filter((step) => step.trim().length > 0)
    .map((step) => step.trim());

  return {
    id: mealDBRecipe.idMeal,
    title: mealDBRecipe.strMeal,
    description: `Delicious ${mealDBRecipe.strMeal} recipe from TheMealDB`,
    cookTime: 30, // Default cook time since MealDB doesn't provide this
    difficulty: "Medium",
    ingredients,
    instructions,
    matchedIngredients,
    missingIngredients,
  };
}

export async function searchRecipesByIngredient(ingredient) {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(
        ingredient
      )}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.meals) {
      return [];
    }

    // Get detailed recipe information for each meal
    const detailedRecipes = await Promise.all(
      data.meals.slice(0, 10).map(async (meal) => {
        try {
          const detailResponse = await fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
          );
          const detailData = await detailResponse.json();

          if (detailData.meals && detailData.meals[0]) {
            return convertMealDBToRecipe(detailData.meals[0], [ingredient], []);
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
  } catch (error) {
    console.error("Error fetching recipes from MealDB:", error);
    return [];
  }
}

export async function searchRecipes(ingredients) {
  if (ingredients.length === 0) {
    return [];
  }

  try {
    // Search for recipes using the first ingredient (MealDB API limitation)
    const primaryIngredient = ingredients[0];
    const recipes = await searchRecipesByIngredient(primaryIngredient);

    // Calculate matches for all user ingredients
    const recipesWithMatches = recipes.map((recipe) => {
      const normalizedUserIngredients = ingredients.map((ing) =>
        ing.toLowerCase().trim()
      );
      const recipeIngredients = recipe.ingredients.map((ing) =>
        ing.toLowerCase().trim()
      );

      const matchedIngredients = recipeIngredients.filter((ingredient) =>
        normalizedUserIngredients.some(
          (userIngredient) =>
            ingredient.includes(userIngredient) ||
            userIngredient.includes(ingredient)
        )
      );

      const missingIngredients = recipeIngredients.filter(
        (ingredient) =>
          !normalizedUserIngredients.some(
            (userIngredient) =>
              ingredient.includes(userIngredient) ||
              userIngredient.includes(ingredient)
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
        a.matchedIngredients.length / a.ingredients.length;
      const bMatchPercentage =
        b.matchedIngredients.length / b.ingredients.length;

      if (aMatchPercentage !== bMatchPercentage) {
        return bMatchPercentage - aMatchPercentage;
      }

      return a.missingIngredients.length - b.missingIngredients.length;
    });
  } catch (error) {
    console.error("Error searching recipes:", error);
    return [];
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
