import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { IngredientInput } from "./components/IngredientInput";
import Navigation from "./components/Navigation";
import RecipeCard from "./components/RecipeCard";
import Saved from "./saved.jsx";
import { searchRecipes } from "./lib/recipe-generator"; 


function Home() {
	const [ingredients, setIngredients] = useState([]);
	const [inputValue, setInputValue] = useState("");
	const [recipes, setRecipes] = useState([]);

	// Add ingredient
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

	// Search recipes
	const handleSearchRecipes = async () => {
		if (ingredients.length === 0) return;

		try {
			const results = await searchRecipes(ingredients);

			if (!Array.isArray(results)) {
				console.error(
					"searchRecipes did not return an array:",
					results
				);
				// Show error card when no valid results
				setRecipes([{ id: "error", isError: true }]);
				return;
			}

			// Filter out recipes with no ingredients and show error card
			if (results.length === 0) {
				setRecipes([{ id: "error", isError: true }]);
				return;
			}

			// Check if any recipe has no ingredients
			const validRecipes = results.filter(
				(recipe) => recipe.ingredients && recipe.ingredients.length > 0
			);

			if (validRecipes.length === 0) {
				setRecipes([{ id: "error", isError: true }]);
			} else {
				setRecipes(validRecipes);
			}
		} catch (error) {
			console.error("Error searching recipes:", error);
			// Show error card instead of alert
			setRecipes([{ id: "error", isError: true }]);
		}
	};

	return (
		<div>
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
							isError={recipe.isError}
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

function App() {
	return (
		<div>
			<Navigation />
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/saved' element={<Saved />} />
			</Routes>
		</div>
	);
}

export default App;
