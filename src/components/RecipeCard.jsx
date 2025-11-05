import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "./RecipeCard.css";

function RecipeCard({ recipe, isError = false }) {
  const [saved, setSaved] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const savedRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];
    const isSaved = savedRecipes.some((r) => r.id === recipe.id);
    setSaved(isSaved);
  }, [recipe]);

  const toggleSave = () => {
    const savedRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];

    if (saved) {
      const updated = savedRecipes.filter((r) => r.id !== recipe.id);
      localStorage.setItem("savedRecipes", JSON.stringify(updated));
      setSaved(false);
    } else {
      savedRecipes.push(recipe);
      localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
      setSaved(true);
    }
  };

  // Error card for recipes with no ingredients
  if (isError || !recipe || !recipe.ingredients || recipe.ingredients.length === 0) {
    return (
      <Card
        className="recipe-card"
        style={{
          border: "2px solid #008700",
          borderRadius: "12px",
          backgroundColor: "#f8fff6",
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
            We can't find any recipe, find some other recipe.
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card
      className="recipe-card"
      style={{
        border: "2px solid #008700",
        borderRadius: "12px",
        backgroundColor: "#f8fff6",
        position: "relative",
      }}
    >
      <Button
        variant="link"
        onClick={toggleSave}
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

      <Card.Body className="d-flex flex-column align-items-center">
        {recipe.image && !imageError && (
          <Card.Img
            variant="top"
            src={recipe.image}
            alt={recipe.title}
            onError={() => setImageError(true)}
            style={{
              width: "100%",
              height: "150px",
              borderRadius: "8px",
              objectFit: "cover",
              marginBottom: "10px",
            }}
          />
        )}

        <Card.Title style={{ color: "#008700", fontWeight: "bold" }}>
          {recipe.title}
        </Card.Title>

        <Card.Text style={{ color: "#333", textAlign: "center" }}>
          {recipe.description}
        </Card.Text>

        <Card.Subtitle
          style={{
            color: "#008700",
            fontWeight: "600",
            marginTop: "10px",
          }}
        >
          Ingredients:
        </Card.Subtitle>
        <Card.Text style={{ color: "#333", textAlign: "center", width: "100%" }}>
          {recipe.ingredients && recipe.ingredients.length > 0 
            ? recipe.ingredients.join(", ") 
            : "No ingredients listed"}
        </Card.Text>

        <Card.Subtitle
          style={{
            color: "#008700",
            fontWeight: "600",
            marginTop: "10px",
          }}
        >
          Instructions:
        </Card.Subtitle>
        <ol style={{ width: "100%", paddingLeft: "20px" }}>
          {recipe.instructions.map((step, idx) => (
            <li key={idx} style={{ color: "#333", marginBottom: "5px" }}>
              {step}
            </li>
          ))}
        </ol>

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