import React from "react";

export function IngredientInput({ value, onChange, onAddIngredient }) {
	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			if (value.trim()) onAddIngredient(value.trim());
		}
	};

	return (
		<div className='ingredient-input-container'>
			<input
				type='text'
				placeholder='Enter ingredient'
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onKeyDown={handleKeyDown}
			/>
			<button
				onClick={() =>
					value.trim() &&
					onAddIngredient(value.trim())
				}
			>
				+ Add Ingredient
			</button>
		</div>
	);
}
