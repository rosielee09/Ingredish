import { useState } from "react";

export function IngredientInput({ onIngredientsChange, onSearchRecipes }) {
	const [ingredient, setIngredient] = useState("");

	return (
		<div style={{ padding: "20px", textAlign: "center" }}>
			<h2>Ingredient Input Component</h2>
			<input
				type='text'
				placeholder='Enter ingredient'
				value={ingredient}
				onChange={(e) => setIngredient(e.target.value)}
			/>
			<button
				onClick={() => {
					if (ingredient.trim()) {
						onIngredientsChange([
							ingredient,
						]);
						onSearchRecipes();
					}
				}}
			>
				Add
			</button>
		</div>
	);
}
