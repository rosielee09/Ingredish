import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "./RecipeCard.css";

function RecipeCard({ recipe, isError = false, onUnsave, isDeleting = false }) {
  const [saved, setSaved] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const savedRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];
    const isSaved = savedRecipes.some((r) => r.id === recipe?.id);
    setSaved(isSaved);
  }, [recipe]);

  const toggleSave = () => {
    const savedRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];

    if (saved) {
      const updated = savedRecipes.filter((r) => r.id !== recipe.id);
      localStorage.setItem("savedRecipes", JSON.stringify(updated));
      setSaved(false);
      // แจ้ง parent (หน้า Saved) ให้ลบการ์ดออกทันที
      if (typeof onUnsave === "function") onUnsave(recipe.id);
    } else {
      // กันการซ้ำ
      const exists = savedRecipes.some((r) => r.id === recipe.id);
      const next = exists ? savedRecipes : [...savedRecipes, recipe];
      localStorage.setItem("savedRecipes", JSON.stringify(next));
      setSaved(true);
    }
  };

  // การ์ด error / ไม่มี ingredients
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
        backgroundColor: "#ffffff",
        position: "relative",
      }}
    >
      {/* ปุ่มหัวใจ */}
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
          <ol style={{ width: "100%", paddingLeft: "20px" }}>
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
