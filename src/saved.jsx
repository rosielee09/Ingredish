import React, { useEffect, useState } from "react";
import Navigation from "./components/Navigation.jsx";
import RecipeCard from "./components/RecipeCard";
import "./index.css";

const LS_KEY = "savedRecipes";
const FADE_MS = 250; // Must match the CSS transition duration

export default function Saved() {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [deletingIds, setDeletingIds] = useState(new Set());

  // Load saved recipes from localStorage when the page is opened
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(LS_KEY)) || [];
    setSavedRecipes(saved);
  }, []);

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

  // Display saved recipe cards
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
            />
          ))}
        </div>
      </div>
    </div>
  );
}
