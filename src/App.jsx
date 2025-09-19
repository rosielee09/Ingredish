import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { IngredientInput } from "./components/IngredientInput";
import { RecipeList } from "./components/RecipeList";

function App() {
	const [ingredients, setIngredients] = useState([]);

	const handleIngredientsChange = (newIngredients) => {
		setIngredients(newIngredients);

		const handleSearchRecipes = () => {
			console.log("Search recipes called with:", ingredients);
		};
	};

	return (
		<div>
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
		</div>
	);
}

export default App;
