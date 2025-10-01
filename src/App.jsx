import { useState } from "react";
import { IngredientInput } from "./components/IngredientInput";
import Navigation from "./components/Navigation";
import RecipeCard from "./components/RecipeCard";
import { searchRecipes } from "./lib/recipe-generator"; // your real data
import "./app.css";

function App() {
	const [ingredients, setIngredients] = useState([]);
	const [inputValue, setInputValue] = useState("");
	const [recipes, setRecipes] = useState([]);

	// Add ingredient to the list
	const handleAddIngredient = (ingredient) => {
		const trimmed = ingredient.trim();
		if (!trimmed) return;

		setIngredients((prev) => {
			if (prev.includes(trimmed)) return prev; // avoid duplicates
			return [...prev, trimmed];
		});

		setInputValue(""); // clear input
	};

	// Remove ingredient
	const handleRemoveIngredient = (ingredient) => {
		setIngredients((prev) => prev.filter((i) => i !== ingredient));
	};

	// Search recipes with all ingredients
	const handleSearchRecipes = async () => {
		if (ingredients.length === 0) return;

		try {
			const results = await searchRecipes(ingredients);

			if (!Array.isArray(results)) {
				console.error(
					"searchRecipes did not return an array:",
					results
				);
				setRecipes([]);
				return;
			}

			setRecipes(results);
		} catch (error) {
			console.error("Error searching recipes:", error);
			alert(
				"Failed to fetch recipes. See console for details."
			);
		}
	};

	return (
		<div>
			<Navigation />
			<h1 style={{ textAlign: "center" }}>
				Hello Ingredish!
			</h1>

			<IngredientInput
				value={inputValue}
				onChange={setInputValue}
				onAddIngredient={handleAddIngredient}
			/>

			<div style={{ textAlign: "center", marginTop: "10px" }}>
				<button onClick={handleSearchRecipes}>
					Find Recipes
				</button>
			</div>

			<p style={{ textAlign: "center" }}>
				Ingredients entered:{" "}
				{ingredients.map((i) => (
					<span
						key={i}
						style={{ marginRight: "5px" }}
					>
						{i}{" "}
						<button
							onClick={() =>
								handleRemoveIngredient(
									i
								)
							}
						>
							x
						</button>
					</span>
				))}
			</p>

			<div className='recipe-list'>
				{recipes.length > 0 ? (
					recipes.map((recipe) => (
						<RecipeCard
							key={recipe.id}
							recipe={recipe}
						/>
					))
				) : (
					<p style={{ textAlign: "center" }}>
						No recipes found yet! Try
						entering some ingredients.
					</p>
				)}
			</div>
		</div>
	);
}

export default App;
