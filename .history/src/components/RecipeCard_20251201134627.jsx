// /RecipeCard.jsx
import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "./RecipeCard.css";

function RecipeCard({ recipe, isError = false, onUnsave, isDeleting = false }) {
  const [saved, setSaved] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Check if this recipe is already saved in localStorage
  useEffect(() => {
    const savedRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];
    const isSaved = savedRecipes.some((r) => r.id === recipe?.id);
    setSaved(isSaved);
  }, [recipe]);

  // Handle save/unsave toggle
  const toggleSave = () => {
    const savedRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];

    if (saved) {
      // Unsave recipe → remove from localStorage
      const updated = savedRecipes.filter((r) => r.id !== recipe.id);
      localStorage.setItem("savedRecipes", JSON.stringify(updated));
      setSaved(false);

      // Notify parent (Saved page) to remove this card immediately
      if (typeof onUnsave === "function") onUnsave(recipe.id);
    } else {
      // Prevent duplicates
      const exists = savedRecipes.some((r) => r.id === recipe.id);
      const next = exists ? savedRecipes : [...savedRecipes, recipe];
      localStorage.setItem("savedRecipes", JSON.stringify(next));
      setSaved(true);
    }
  };

  // Error card or no ingredients available
  if (
    isError ||
    !recipe ||
    !Array.isArray(recipe.ingredients) ||
    recipe.ingredients.length === 0
  ) {
    return (
      <Card
        className="recipe-card"
        style={{
          border: "2px solid #008700",
          borderRadius: "12px",
          backgroundColor: "#ffffff",
        }}
      >
        <Card.Body className="text-center d-flex flex-column align-items-center">
          <Card.Text
            style={{
              color: "#008700",
              fontSize: "1.1rem",
              fontWeight: "500",
              margin: "20px 0",
            }}
          >
            We can't find any recipe. Please try searching for another one.
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card
      className={`recipe-card ${isDeleting ? "fade-out" : ""}`}
      style={{
        border: "2px solid #008700",
        borderRadius: "12px",
        backgroundColor: "#ffffff",
        position: "relative",
      }}
    >
      {/* Heart button for saving/unsaving a recipe */}
      <Button
        variant="link"
        onClick={toggleSave}
        aria-pressed={saved}
        aria-label={saved ? "Unsave recipe" : "Save recipe"}
        title={saved ? "Unsave" : "Save"}
        style={{
          position: "absolute",
          top: "8px",
          right: "10px",
          border: "none",
          borderRadius: "20%",
          background: "rgba(255, 255, 255, 0.5)",
          padding: "4px 8px",
          zIndex: 10,
        }}
      >
        {saved ? (
          <FaHeart style={{ color: "#008700", fontSize: "24px" }} />
        ) : (
          <FaRegHeart style={{ color: "#008700", fontSize: "24px" }} />
        )}
      </Button>

      {/* Recipe content */}
      <Card.Body className="d-flex flex-column align-items-center">
        {recipe.image && !imageError && (
          <Card.Img
            variant="top"
            src={recipe.image}
            alt={recipe.title || "Recipe image"}
            onError={() => setImageError(true)}
            style={{
              width: "100%",
              height: "220px",
              borderRadius: "8px",
              objectFit: "cover",
              marginBottom: "10px",
            }}
          />
        )}

        <Card.Title style={{ color: "#008700", fontWeight: "bold" }}>
          {recipe.title}
        </Card.Title>

        {recipe.description && (
          <Card.Text style={{ color: "#333", textAlign: "center" }}>
            {recipe.description}
          </Card.Text>
        )}

        {/* Ingredients section */}
        <Card.Subtitle
          style={{
            color: "#008700",
            fontWeight: "600",
            marginTop: "10px",
          }}
        >
          Ingredients:
        </Card.Subtitle>
        <Card.Text
          style={{ color: "#333", textAlign: "center", width: "100%" }}
        >
          {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0
            ? recipe.ingredients.map(String).join(", ")
            : "No ingredients listed"}
        </Card.Text>

        {/* Instructions section */}
        <Card.Subtitle
          style={{
            color: "#008700",
            fontWeight: "600",
            marginTop: "10px",
          }}
        >
          Instructions:
        </Card.Subtitle>
        {Array.isArray(recipe.instructions) &&
        recipe.instructions.length > 0 ? (
          <ol
            style={{
              width: "100%",
              paddingLeft: "20px",
              textAlign: "left",
              textDecoration: "none",
            }}
          >
            {recipe.instructions.map((step, idx) => (
              <li key={idx} style={{ color: "#333", marginBottom: "5px" }}>
                {step}
              </li>
            ))}
          </ol>
        ) : (
          <Card.Text style={{ color: "#333" }}>
            No instructions provided
          </Card.Text>
        )}

        {/* External recipe link */}
        {recipe.url && (
          <Card.Link
            href={recipe.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#008700",
              textDecoration: "none",
              fontWeight: "600",
              marginTop: "10px",
            }}
          >
            View Recipe
          </Card.Link>
        )}
      </Card.Body>
    </Card>
  );
}

export default RecipeCard;
