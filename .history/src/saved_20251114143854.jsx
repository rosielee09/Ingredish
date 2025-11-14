import React, { useEffect, useState } from "react";
import Navigation from "./components/Navigation.jsx";
import RecipeCard from "./components/RecipeCard";
import "./index.css";

const LS_KEY = "savedRecipes";
const FADE_MS = 250; // Must match CSS transition duration

export default function Saved() {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [deletingIndexes, setDeletingIndexes] = useState(new Set());

  // Editing state
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editIngredients, setEditIngredients] = useState("");
  const [editInstructions, setEditInstructions] = useState("");

  // Load saved recipes from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
      setSavedRecipes(saved);
    } catch {
      setSavedRecipes([]);
    }
  }, []);

  // Helpers to prepare editable text
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

  // Start editing a specific recipe by index
  function handleStartEdit(recipe, index) {
    setEditingRecipe(recipe);
    setEditingIndex(index);
    setEditTitle(getEditableTitle(recipe));
    setEditIngredients(getEditableIngredients(recipe));
    setEditInstructions(getEditableInstructions(recipe));
  }

  // Cancel edit mode
  function handleCancelEdit() {
    setEditingRecipe(null);
    setEditingIndex(null);
  }

  // Save edited recipe back into state + localStorage
  function handleSaveEdit(event) {
    event.preventDefault();
    if (editingRecipe == null || editingIndex == null) return;

    const updated = {
      ...editingRecipe,
      customTitle: editTitle.trim(),
      customIngredients: editIngredients.trim(),
      customInstructions: editInstructions.trim(),
    };

    setSavedRecipes((prev) => {
      const next = [...prev];
      next[editingIndex] = updated; // update this one item by index
      localStorage.setItem(LS_KEY, JSON.stringify(next));
      return next;
    });

    setEditingRecipe(null);
    setEditingIndex(null);
  }

  // Unsave with fade-out by index
  function handleUnsave(index) {
    setDeletingIndexes((prev) => new Set(prev).add(index));

    setTimeout(() => {
      setSavedRecipes((prev) => {
        const next = prev.filter((_, i) => i !== index);
        localStorage.setItem(LS_KEY, JSON.stringify(next));
        return next;
      });

      setDeletingIndexes((prev) => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
    }, FADE_MS);
  }

  // Empty state
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

  return (
    <div>
      <Navigation />
      <div className="container" style={{ padding: "24px" }}>
        <h2>My Saved Recipes</h2>

        <div className="recipe-list" style={{ marginTop: 20 }}>
          {savedRecipes.map((recipe, index) => (
            <RecipeCard
              key={recipe.id || recipe.idMeal || index}
              recipe={recipe}
              onUnsave={() => handleUnsave(index)}
              isDeleting={deletingIndexes.has(index)}
              onEdit={() => handleStartEdit(recipe, index)}
            />
          ))}
        </div>

        {/* Edit panel */}
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
