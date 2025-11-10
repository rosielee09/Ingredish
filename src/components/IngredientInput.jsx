import React from "react";

export function IngredientInput({
	value,
	onChange,
	onAddIngredient,
	disabled = false,
}) {
	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			const trimmed = value.trim();
			if (trimmed) onAddIngredient(trimmed);
		}
	};

	return (
		<input
			type='text'
			placeholder='Enter ingredient'
			value={value}
			onChange={(e) => onChange(e.target.value)}
			onKeyDown={handleKeyDown}
			disabled={disabled}
			aria-label='Ingredient input'
		/>
	);
}
