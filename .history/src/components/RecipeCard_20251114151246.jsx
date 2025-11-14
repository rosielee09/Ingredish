import React, { useEffect, useState } from "react";
import "../App.css";

const LS_KEY = "savedRecipes";

// Helpers for safely reading fields
function getTitle(recipe) {
  return (
    recipe.customTitle ||
    recipe.title ||
    recipe.name ||
    recipe.strMeal ||
    "Untitled recipe"
  );
}

function getDescription(recipe) {
  return (
    recipe.description ||
    recipe.subtitle ||
    (recipe.source === "themealdb" && "Delicious recipe from TheMealDB") ||
    ""
  );
}

function getIngredientsText(recipe) {
  if (recipe.customIngredients) return recipe.customIngredients;
  if (typeof recipe.ingredients === "string") return recipe.ingredients;
  if (Array.isArray(recipe.ingredients)) return recipe.ingredients.join(", ");
  if (Array.isArray(recipe.ingredientsList))
    return recipe.ingredientsList.join(", ");
  if (recipe.ingredientsText) return recipe.ingredientsText;
  return "";
}

function getInstructionsText(recipe) {
  return (
    recipe.customInstructions ||
    recipe.instructions ||
    recipe.strInstructions ||
    ""
  );
}

function getImageUrl(recipe) {
  return (
    recipe.image ||
    recipe.thumbnail ||
    recipe.thumb ||
    recipe.strMealThumb ||
    null
  );
}

export default function RecipeCard({
  recipe,
  isError,
  onUnsave, // Saved page → parent removes by index
  isDeleting,
  onEdit,
}) {
  const [isSaved, setIsSaved] = useState(false);

  const title = getTitle(recipe);
  const description = getDescription(recipe);
  const ingredientsText = getIngredientsText(recipe);
  const instructionsText = getInstructionsText(recipe);
  const imageUrl = getImageUrl(recipe);

  // Check saved status on Home page
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(LS_KEY)) || [];
      const exists = stored.some((r) => r.strMeal === recipe.strMeal);
      setIsSaved(exists);
    } catch {
      setIsSaved(false);
    }
  }, [recipe]);

  // Handle heart
  function handleHeartClick(e) {
    e.stopPropagation();

    // Saved page → delete by index (no id)
    if (onUnsave) {
      onUnsave(); // ← IMPORTANT: no arguments, parent handles it
      return;
    }

    // Home page save/unsave
    const stored = JSON.parse(localStorage.getItem(LS_KEY)) || [];

    if (isSaved) {
      const next = stored.filter((r) => r.strMeal !== recipe.strMeal);
      localStorage.setItem(LS_KEY, JSON.stringify(next));
      setIsSaved(false);
    } else {
      const next = [...stored, recipe];
      localStorage.setItem(LS_KEY, JSON.stringify(next));
      setIsSaved(true);
    }
  }

  // Edit button
  function handleEditClick(e) {
    e.stopPropagation();
    if (onEdit) onEdit();
  }

  if (isError) {
    return (
      <div className="recipe-card">
        <p>Something went wrong with this recipe.</p>
      </div>
    );
  }

  let cardClassName = "recipe-card";
  if (isDeleting) cardClassName += " recipe-card--deleting";

  return (
    <div className={cardClassName}>
      {imageUrl && (
        <div className="mb-3 position-relative">
          <img
            src={imageUrl}
            alt={title}
            style={{
              width: "100%",
              borderRadius: "12px",
              objectFit: "cover",
              aspectRatio: "4 / 3",
            }}
          />

          <button
            type="button"
            onClick={handleHeartClick}
            aria-label={isSaved ? "Unsave recipe" : "Save recipe"}
            className="btn btn-light"
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              borderRadius: "999px",
            }}
          >
            <span
              style={{
                color: isSaved || onUnsave ? "green" : "#888",
                fontSize: "1.1rem",
              }}
            >
              ♥
            </span>
          </button>
        </div>
      )}

      <h3 style={{ color: "#2e7d32", marginBottom: "0.5rem" }}>{title}</h3>

      {description && (
        <p style={{ marginBottom: "1rem", color: "#555" }}>{description}</p>
      )}

      {ingredientsText && (
        <>
          <h5 style={{ color: "#2e7d32" }}>Ingredients:</h5>
          <p style={{ marginBottom: "1rem" }}>{ingredientsText}</p>
        </>
      )}

      {instructionsText && (
        <>
          <h5 style={{ color: "#2e7d32" }}>Instructions:</h5>
          <p style={{ whiteSpace: "pre-line" }}>{instructionsText}</p>
        </>
      )}

      {onEdit && (
        <div className="mt-3 d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={handleEditClick}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
