import Navigation from "./components/Navigation.jsx";
import "./index.css";
import RecipeCard from "./components/RecipeCard";

export default function Saved() {
  const sampleRecipe = {
    id: 1,
    title: "Pad Thai",
    description:
      "A classic Thai stir-fried noodle dish with shrimp, tofu, and peanuts.",
    image: "https://www.themealdb.com/images/media/meals/uuuspp1511297945.jpg",
    ingredients: [
      "200g rice noodles",
      "2 eggs",
      "100g shrimp",
      "50g tofu",
      "2 tbsp peanuts",
      "1 lime",
      "2 tbsp fish sauce",
    ],
    instructions: [
      "Soak rice noodles in warm water until soft.",
      "Stir-fry shrimp and tofu in a pan.",
      "Push to the side, scramble eggs in the same pan.",
      "Add noodles, sauce, and mix everything together.",
      "Top with peanuts and lime before serving.",
    ],
    url: "https://www.example.com/padthai-recipe",
  };

  return (
    <div>
      <Navigation />
      <h2 style={{ textAlign: "center", marginTop: "20px" }}>Saved Recipes</h2>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <RecipeCard recipe={sampleRecipe} />
      </div>
    </div>
  );
}
