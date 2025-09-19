import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { IngredientInput } from "./components/IngredientInput";
import { RecipeList } from "./components/RecipeList";

function App() {
	const [ingredients, setIngredients] = useState([]);

	const handleIngredientsChange = (newIngredients) => {
		setIngredients(newIngredients);
	};

	return (
		<Router>
			<Routes>
				<Route
					path='/'
					element={
						<IngredientInput
							onIngredientsChange={
								handleIngredientsChange
							}
							onSearchRecipes={() =>
								console.log(
									"Search recipes"
								)
							}
						/>
					}
				/>
				<Route
					path='/recipes'
					element={
						<RecipeList
							ingredients={
								ingredients
							}
						/>
					}
				/>
			</Routes>
		</Router>
	);
}

export default App;
