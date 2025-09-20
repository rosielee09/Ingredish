import React from "react";
import "./RecipeCard.css";

function RecipeCard({ recipe }) {
  return (
    <div className="recipe-card">
      <img className="recipe-image" src={recipe.image} alt={recipe.title} />
      <h3>{recipe.title}</h3>
      <p>{recipe.description}</p>
      <a href={recipe.url} target="_blank" rel="noopener noreferrer">
        View Recipe
      </a>
    </div>
  );
}

export default RecipeCard;