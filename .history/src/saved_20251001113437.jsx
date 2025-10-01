import React, { useEffect, useState } from "react";
import Navigation from "./components/Navigation.jsx";
import RecipeCard from "./components/RecipeCard";
import "./index.css";

export default function Saved() {
  const [savedRecipes, setSavedRecipes] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedRecipes")) || [];
    setSavedRecipes(saved);
  }, []);

  if (savedRecipes.length === 0) {
    return (
      <div>
        <Navigation />
        <h2 style={{ textAlign: "center", marginTop: "20px" }}>
          Saved Recipes
        </h2>
        <p style={{ textAlign: "center" }}>No saved recipes yet.</p>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      <h2 style={{ textAlign: "center", marginTop: "20px" }}>Saved Recipes</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        {savedRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
