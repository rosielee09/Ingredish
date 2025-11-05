import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { IngredientInput } from "./components/IngredientInput";
import Navigation from "./components/Navigation";
import RecipeCard from "./components/RecipeCard";
import Saved from "./saved.jsx";
import {
	searchRecipes,
	searchRecipesByIngredient,
} from "./lib/recipe-generator";
import SearchIcon from "./components/icons/SearchIcon";
import "./App.css";

function Home() {
	const [ingredients, setIngredients] = useState([]);
	const [inputValue, setInputValue] = useState("");
	const [recipes, setRecipes] = useState([]);
	const [loading, setLoading] = useState(false);
	const [validating, setValidating] = useState(false);
	const [error, setError] = useState(null);
	const [inputError, setInputError] = useState(null);

	const handleClearError = () => setError(null);

	const handleSearchRecipes = async (ingredientList) => {
		const list = Array.isArray(ingredientList)
			? ingredientList
			: ingredients;
		if (!list || list.length === 0) {
			setRecipes([]);
			return;
		}

		setLoading(true);
		setError(null);
		try {
			const results = await searchRecipes(list);

			if (!Array.isArray(results) || results.length === 0) {
				setRecipes([{ id: "error", isError: true }]);
				return;
			}

			const validRecipes = results.filter(
				(recipe) =>
					recipe.ingredients &&
					recipe.ingredients.length > 0
			);

			setRecipes(
				validRecipes.length > 0
					? validRecipes
					: [{ id: "error", isError: true }]
			);
		} catch (err) {
			console.error("Failed to fetch recipes:", err);
			setError(
				(err && err.message) ||
					"Failed to fetch recipes. Please try again."
			);
			setRecipes([]);
		} finally {
			setLoading(false);
		}
	};

	const handleAddIngredient = async (ingredient) => {
		const trimmed = ingredient.trim();
		if (!trimmed) return;

		const splitter = /[,;\/\|]+/;
		const parts = splitter.test(trimmed)
			? trimmed
					.split(splitter)
					.map((p) => p.trim())
					.filter(Boolean)
			: [trimmed];

		setError(null);
		setValidating(true);
		try {
			const toValidate = parts.filter(
				(p) => !ingredients.includes(p)
			);
			const validations = await Promise.all(
				toValidate.map(async (p) => {
					try {
						const res =
							await searchRecipesByIngredient(
								p
							);
						return {
							p,
							ok:
								Array.isArray(
									res
								) &&
								res.length > 0,
						};
					} catch {
						return { p, ok: false };
					}
				})
			);

			const validAdded = validations
				.filter((v) => v.ok)
				.map((v) => v.p);
			const invalid = validations
				.filter((v) => !v.ok)
				.map((v) => v.p);

			if (validAdded.length === 0 && parts.length > 0) {
				setInputError(
					invalid.length
						? `Not existing ingredient or incorrect name: ${invalid.join(
								", "
						  )}`
						: "No valid ingredients found."
				);
				return;
			}

			const newIngredients = Array.from(
				new Set([...ingredients, ...validAdded])
			);
			setIngredients(newIngredients);
			setInputValue("");
			setInputError(
				invalid.length
					? `Not existing ingredient or incorrect name: ${invalid.join(
							", "
					  )}`
					: null
			);

			handleSearchRecipes(newIngredients);
		} catch (err) {
			console.error("Ingredient validation failed:", err);
			setError(
				(err && err.message) ||
					"Failed to validate ingredient. Please try again."
			);
		} finally {
			setValidating(false);
		}
	};

	const handleRetry = () => {
		setError(null);
		handleSearchRecipes();
	};

	const handleRemoveIngredient = (ingredient) => {
		const newIngredients = ingredients.filter(
			(i) => i !== ingredient
		);
		setIngredients(newIngredients);
		if (newIngredients.length === 0) {
			setRecipes([]);
		} else {
			handleSearchRecipes(newIngredients);
		}
	};

	return (
		<div>
			<h1 style={{ textAlign: "center" }}>
				Hello Ingredish!
			</h1>

			<div
				className='ingredient-input-container'
				style={{ alignItems: "center" }}
			>
				<div
					className='input-row'
					style={{ width: "100%", maxWidth: 500 }}
				>
					<IngredientInput
						value={inputValue}
						onChange={(v) => {
							setInputValue(v);
							setInputError(null);
						}}
						onAddIngredient={
							handleAddIngredient
						}
						disabled={loading || validating}
					/>
					<button
						onClick={() =>
							handleSearchRecipes()
						}
						disabled={
							loading ||
							ingredients.length === 0
						}
						className='search-button'
						aria-label='Find recipes'
					>
						{loading || validating ? (
							"Searching..."
						) : (
							<SearchIcon
								width={18}
								height={18}
								className='bi-search'
							/>
						)}
					</button>
				</div>
			</div>

			{inputError ? (
				<div
					className='input-error'
					style={{
						maxWidth: 500,
						margin: "0 auto",
					}}
				>
					{inputError}
				</div>
			) : (
				<div
					className='input-helper'
					style={{
						maxWidth: 500,
						margin: "0 auto",
					}}
				>
					Enter one ingredient at a time. Press
					Enter to add.
				</div>
			)}

			{error && (
				<div
					className='error-modal'
					role='alertdialog'
					aria-modal='true'
				>
					<div className='error-modal-content'>
						<p>{error}</p>
						<div className='error-actions'>
							<button
								className='retry'
								onClick={
									handleRetry
								}
							>
								Retry
							</button>
							<button
								className='close'
								onClick={
									handleClearError
								}
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}

			<div className='ingredient-badges'>
				{ingredients.map((i) => (
					<span
						key={i}
						className='ingredient-badge'
					>
						{i}
						<button
							className='remove-badge'
							onClick={() =>
								handleRemoveIngredient(
									i
								)
							}
							disabled={loading}
							aria-label={`Remove ${i}`}
						>
							x
						</button>
					</span>
				))}
			</div>

			<div className='recipe-list'>
				{recipes.length > 0
					? recipes.map((recipe) => (
							<RecipeCard
								key={recipe.id}
								recipe={recipe}
								isError={
									recipe.isError
								}
							/>
					  ))
					: ingredients.length > 0 &&
					  !loading &&
					  !error && (
							<div className='no-recipes-overlay'>
								<h3>
									No
									recipes
									found
								</h3>
								<p>
									We
									couldn't
									find
									recipes
									that
									match
									your
									ingredients.
								</p>
								<p>
									Try
									removing
									or
									changing
									some
									ingredients.
								</p>
							</div>
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
