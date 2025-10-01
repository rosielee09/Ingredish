import React, { useState, useEffect } from "react";
import "./RecipeCard.css";


function RecipeCard({ recipe }) {

  const [saved, setSaved] = useState(false);

  useEffect(() => { const savedRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];
    const isSaved = savedRecipes.some(r => r.id === recipe.id);
    setSaved(isSaved);
  }, [recipe]);


const toggleSave = () => {
    const savedRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];

    if (saved) {
      const updated = savedRecipes.filter(r => r.id !== recipe.id);
      localStorage.setItem("savedRecipes", JSON.stringify(updated));
      setSaved(false);

    } else {
      savedRecipes.push(recipe);
      localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
      setSaved(true);
    }
  };


    return (
      <div className="recipe-card">

      <button className="save-btn" onClick={toggleSave}>
        {saved ? "❤️" : "🤍"}
      </button>

        {recipe.image && (
          <img className="recipe-image" src={recipe.image} alt={recipe.title} />
        )}
        <h3>{recipe.title}</h3>
        <p>{recipe.description}</p>
  
        <h4>Ingredients:</h4>
        <ul>
          {recipe.ingredients.map((ing, idx) => (
            <li key={idx}>{ing}</li>
          ))}
        </ul>
  
        <h4>Instructions:</h4>
        <ol>
          {recipe.instructions.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
  
        {recipe.url && (
          <a href={recipe.url} target="_blank" rel="noopener noreferrer">
            View Recipe
          </a>
        )}
      </div>
    );
  }
export default RecipeCard;