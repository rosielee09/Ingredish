import { useState } from "react";

export function IngredientInput({ onIngredientsChange, onSearchRecipes }) {
	const [ingredient, setIngredient] = useState("");

	return (
		<div className='ingredient-input-container'>
			<input
				type='text'
				placeholder='Enter ingredient'
				value={ingredient}
				onChange={(e) => setIngredient(e.target.value)}
			/>
			<button onClick={handleAdd}>+ Add Ingredient</button>
		</div>
	);
}
