import { useState } from "react";
import { IngredientInput } from "./components/IngredientInput";
import Navigation from "./components/Navigation";

function App() {
	const [ingredients, setIngredients] = useState([]);

	const handleIngredientsChange = (newIngredients) => {
		setIngredients(newIngredients);
	};

	const handleSearchRecipes = () => {
		console.log("Search recipes called with:", ingredients);
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
		</div>
	);
}

export default App;
