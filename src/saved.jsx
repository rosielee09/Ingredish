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
        <h2 style={{ textAlign: "center", marginTop: "20px" }}>Saved Recipes</h2>
        <p style={{ textAlign: "center" }}>No saved recipes yet.</p>
      </div>
    );
  }


  // // recipe ตัวอย่างที่ตรงกับ RecipeCard.jsx
  // const sampleRecipe = {
  //   id: 1,
  //   title: "Pad Thai",
  //   description:
  //     "A classic Thai stir-fried noodle dish with shrimp, tofu, and peanuts.",
  //   image: "https://www.themealdb.com/images/media/meals/uuuspp1511297945.jpg",
  //   ingredients: [
  //     "200g rice noodles",
  //     "2 eggs",
  //     "100g shrimp",
  //     "50g tofu",
  //     "2 tbsp peanuts",
  //     "1 lime",
  //     "2 tbsp fish sauce",
  //   ],
  //   instructions: [
  //     "Soak rice noodles in warm water until soft.",
  //     "Stir-fry shrimp and tofu in a pan.",
  //     "Push to the side, scramble eggs in the same pan.",
  //     "Add noodles, sauce, and mix everything together.",
  //     "Top with peanuts and lime before serving.",
  //   ],
  //   url: "https://www.example.com/padthai-recipe",
  // };


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