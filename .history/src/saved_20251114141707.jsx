import React, { useEffect, useState } from "react";
import Navigation from "./components/Navigation.jsx";
import RecipeCard from "./components/RecipeCard";
import "./index.css";

const LS_KEY = "savedRecipes";
const FADE_MS = 250; // Must match the CSS transition duration

export default function Saved() {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [deletingIds, setDeletingIds] = useState(new Set());

  // Editing state
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editIngredients, setEditIngredients] = useState("");
  const [editInstructions, setEditInstructions] = useState("");

  // Load saved recipes from localStorage when the page is opened
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(LS_KEY)) || [];
    setSavedRecipes(saved);
  }, []);

  // Helpers to get default editable text based on the recipe object shape
  function getEditableTitle(recipe) {
    return (
      recipe.customTitle ||
      recipe.title ||
      recipe.name ||
      recipe.strMeal ||
      "Untitled recipe"
    );
  }

  function getEditableIngredients(recipe) {
    if (recipe.customIngredients) return recipe.customIngredients;
    if (typeof recipe.ingredients === "string") return recipe.ingredients;
    if (Array.isArray(recipe.ingredients)) return recipe.ingredients.join(", ");
    if (Array.isArray(recipe.ingredientsList))
      return recipe.ingredientsList.join(", ");
    if (recipe.ingredientsText) return recipe.ingredientsText;
    return "";
  }

  function getEditableInstructions(recipe) {
    return (
      recipe.customInstructions ||
      recipe.instructions ||
      recipe.strInstructions ||
      ""
    );
  }

  // Triggered when the user clicks the Edit button on a recipe card
  function handleStartEdit(recipe) {
    setEditingRecipe(recipe);
    setEditTitle(getEditableTitle(recipe));
    setEditIngredients(getEditableIngredients(recipe));
    setEditInstructions(getEditableInstructions(recipe));
  }

  // Cancel editing mode without saving changes
  function handleCancelEdit() {
    setEditingRecipe(null);
  }

  // Save edited fields back into the recipe (and localStorage)
  function handleSaveEdit(event) {
    event.preventDefault();
    if (!editingRecipe) return;

    const updated = {
      ...editingRecipe,
      // Store user-edited values in custom* fields,
      // so original API data is still kept as a fallback.
      customTitle: editTitle.trim(),
      customIngredients: editIngredients.trim(),
      customInstructions: editInstructions.trim(),
    };

    setSavedRecipes((prev) => {
      const next = prev.map((r) => (r.id === editingRecipe.id ? updated : r));
      localStorage.setItem(LS_KEY, JSON.stringify(next));
      return next;
    });

    setEditingRecipe(null);
  }

  // Triggered when the user clicks the heart to unsave a recipe
  // Adds the fade-out class first, then removes the recipe after the animation delay
  function handleUnsave(id) {
    // Mark this recipe as being deleted (for fade-out animation)
    setDeletingIds((prev) => new Set(prev).add(id));

    // Wait for fade-out animation to finish, then remove from state and localStorage
    setTimeout(() => {
      setSavedRecipes((prev) => {
        const next = prev.filter((r) => r.id !== id);
        localStorage.setItem(LS_KEY, JSON.stringify(next));
        return next;
      });

      // Clean up the deleting state for this recipe ID
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, FADE_MS);
  }

  // Display an empty state if there are no saved recipes
  if (savedRecipes.length === 0) {
    return (
      <div>
        <Navigation />
        <div className="container" style={{ padding: "24px" }}>
          <h2>My Saved Recipes</h2>
          <p className="text-muted">No saved recipes yet.</p>
        </div>
      </div>
    );
  }

  // Display saved recipe cards + edit panel
  return (
    <div>
      <Navigation />
      <div className="container" style={{ padding: "24px" }}>
        <h2>My Saved Recipes</h2>

        <div className="recipe-list" style={{ marginTop: 20 }}>
          {savedRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onUnsave={handleUnsave}
              isDeleting={deletingIds.has(recipe.id)} // Pass deleting state for fade-out effect
              onEdit={() => handleStartEdit(recipe)} // Enable edit mode for this recipe
            />
          ))}
        </div>

        {/* Edit panel shown when a recipe is selected for editing */}
        {editingRecipe && (
          <div
            className="mt-4"
            style={{
              marginTop: "2rem",
              textAlign: "left",
              maxWidth: "720px",
              marginInline: "auto",
              backgroundColor: "#fff",
              padding: "1.5rem",
              borderRadius: "12px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            }}
          >
            <h4>Edit recipe</h4>
            <form onSubmit={handleSaveEdit}>
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  className="form-control"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Ingredients (comma-separated or free text)
                </label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={editIngredients}
                  onChange={(e) => setEditIngredients(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Instructions</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={editInstructions}
                  onChange={(e) => setEditInstructions(e.target.value)}
                />
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">
                  Save changes
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
