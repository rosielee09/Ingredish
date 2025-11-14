// src/saved.jsx
import React, { useEffect, useState } from "react";
import Navigation from "./components/Navigation.jsx";
import RecipeCard from "./components/RecipeCard";
import "./index.css";

const LS_KEY = "savedRecipes";

export default function Saved() {
  const [savedRecipes, setSavedRecipes] = useState([]);

  // which card we are editing (index in array)
  const [editingIndex, setEditingIndex] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editIngredients, setEditIngredients] = useState("");
  const [editInstructions, setEditInstructions] = useState("");

  // load from localStorage once
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
      setSavedRecipes(stored);
    } catch {
      setSavedRecipes([]);
    }
  }, []);

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

  // click "Edit" under a card
  function handleStartEdit(index) {
    const recipe = savedRecipes[index];
    if (!recipe) return;

    setEditingIndex(index);
    setEditTitle(getEditableTitle(recipe));
    setEditIngredients(getEditableIngredients(recipe));
    setEditInstructions(getEditableInstructions(recipe));
  }

  function handleCancelEdit() {
    setEditingIndex(null);
  }

  // click "Save changes" in the inline form
  function handleSaveEdit(e) {
    e.preventDefault();
    if (editingIndex === null) return;

    setSavedRecipes((prev) => {
      const next = [...prev];
      const current = next[editingIndex];
      if (!current) return prev;

      const trimmedTitle = editTitle.trim();
      const trimmedIng = editIngredients.trim();
      const trimmedIns = editInstructions.trim();

      const updated = {
        ...current,
        // update all title-related fields just in case
        customTitle: trimmedTitle,
        title: trimmedTitle,
        name: trimmedTitle,
        strMeal: trimmedTitle,
        customIngredients: trimmedIng,
        customInstructions: trimmedIns,
      };

      next[editingIndex] = updated;

      try {
        localStorage.setItem(LS_KEY, JSON.stringify(next));
      } catch {
        // ignore storage errors
      }

      return next;
    });

    setEditingIndex(null);
  }

  function handleUnsave(index) {
    setSavedRecipes((prev) => {
      const next = prev.filter((_, i) => i !== index);
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });

    // ถ้ากำลังแก้ใบที่ถูกลบอยู่ ให้ปิดฟอร์ม
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  }

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
              onEdit={() => handleStartEdit(index)}
            />
          ))}
        </div>

        {/* inline edit panel */}
        {editingIndex !== null && (
          <div
            style={{
              marginTop: "2rem",
              maxWidth: "720px",
              marginInline: "auto",
              backgroundColor: "#fff",
              padding: "1.5rem",
              borderRadius: "12px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              textAlign: "left",
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
