import { useState } from "react";
import { IngredientInput } from "./components/IngredientInput";
import Navigation from "./components/Navigation";
import RecipeCard from "./components/RecipeCard";

function App() {
	const [ingredients, setIngredients] = useState([]);

	const handleIngredientsChange = (newIngredients) => {
		setIngredients(newIngredients);
	};

	const handleSearchRecipes = () => {
		console.log("Search recipes called with:", ingredients);
	};

	//for testing purposes
	const sampleRecipe = {
		title: "Juicy Burger",
		description: "A delicious homemade burger with fresh ingredients.",
		url: "https://example.com/burger-recipe",
		image: "/burger.jpg"
	  };
	
	return (
		<div>
			<Navigation />
			<h1 style={{ textAlign: "center" }}>
				Hello Ingredish!
			</h1>
			<IngredientInput
				onIngredientsChange={handleIngredientsChange}
				onSearchRecipes={handleSearchRecipes}
			/>
			<p style={{ textAlign: "center" }}>
				Ingredients entered: {ingredients.join(", ")}
			</p>
			<div className="recipe-list">
      		  <RecipeCard recipe={sampleRecipe} />
      		</div>
		</div>
	);
}

export default App;
