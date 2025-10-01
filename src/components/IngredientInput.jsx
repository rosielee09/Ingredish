import { useState } from "react";

export function IngredientInput({ onIngredientsChange, onSearchRecipes }) {
	const [ingredient, setIngredient] = useState("");

	const handleAdd = () => {
		if (!ingredient.trim()) return;

		// Append the new ingredient to the existing list
		onIngredientsChange((prev) => [...prev, ingredient.trim()]);

		onSearchRecipes();

		setIngredient("");
	};

	// Handle pressing Enter in the input field
	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			handleAdd();
		}
	};

	return (
		<div className='ingredient-input-container'>
			<input
				type='text'
				placeholder='Enter ingredient'
				value={ingredient}
				onChange={(e) => setIngredient(e.target.value)}
				onKeyDown={handleKeyPress}
			/>
			<button onClick={handleAdd}>+ Add Ingredient</button>
		</div>
	);
}
