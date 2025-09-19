import { useState } from "react";
import { IngredientInput } from "./components/IngredientInput";
import { searchRecipes } from "./lib/recipe-generator";
import Navigation from "./components/Navigation";


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
      <h1 style={{ textAlign: "center" }}>Hello Ingredish!</h1>
      <IngredientInput
        onIngredientsChange={handleIngredientsChange}
        onSearchRecipes={handleSearchRecipes}
      />
      <p style={{ textAlign: "center" }}>
        Ingredients entered: {ingredients.join(", ")}
      </p>

      <div style={{ marginTop: "20px" }}>
        {recipes.length > 0 ? (
          <ul>
            {recipes.map((recipe) => (
              <li key={recipe.id}>
                <h3>{recipe.title}</h3>
                <p>{recipe.description}</p>
                <strong>Ingredients:</strong>
                <ul>
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i}>{ing}</li>
                  ))}
                </ul>
                <strong>Instructions:</strong>
                <ol>
                  {recipe.instructions.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </li>
            ))}
          </ul>
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
