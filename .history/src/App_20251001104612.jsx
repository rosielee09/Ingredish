import { useState } from "react";
import { IngredientInput } from "./components/IngredientInput";
import { searchRecipes } from "./lib/recipe-generator";
import Navigation from "./components/Navigation";
import RecipeCard from "./components/RecipeCard";
import { Routes, Route } from "react-router-dom";
import Saved from "./saved.jsx";

function App() {
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);

  const handleIngredientsChange = (newIngredients) => {
    setIngredients(newIngredients);
  };

  const handleSearchRecipes = async () => {
    console.log("Search recipes called with:", ingredients);
    const results = await searchRecipes(ingredients);
    setRecipes(results);
  };

  return (
    <div>
      <Navigation />
      <h1 style={{ textAlign: "center" }}>Hello Ingredish!</h1>
      <IngredientInput
        onIngredientsChange={handleIngredientsChange}
        onSearchRecipes={handleSearchRecipes}
      />

      {/* For test purpose  */}
      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <button onClick={handleSearchRecipes}>Find Recipes</button>
      </div>

      <p style={{ textAlign: "center" }}>
        Ingredients entered: {ingredients.join(", ")}
      </p>

      <div style={{ marginTop: "20px" }}>
        {recipes.length > 0 ? (
          <div className="recipe-list">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <p style={{ textAlign: "center" }}>
            No recipes found yet. Try entering some ingredients!
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
