import React, { useEffect, useState } from "react";
import Navigation from "./components/Navigation.jsx";
import RecipeCard from "./components/RecipeCard";
import { Modal, Button, Form } from "react-bootstrap";
import "./index.css";

const LS_KEY = "savedRecipes";

export default function Saved() {
  const [savedRecipes, setSavedRecipes] = useState([]);

  // modal + editing state
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editIngredients, setEditIngredients] = useState("");
  const [editInstructions, setEditInstructions] = useState("");

  // load recipes on mount
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
      setSavedRecipes(stored);
    } catch {
      setSavedRecipes([]);
    }
  }, []);

  // ---------------- helpers ----------------

  function getEditableTitle(recipe) {
    return (
      recipe.customTitle ||
      recipe.title ||
      recipe.name ||
      recipe.strMeal ||
      "Untitled recipe"
    );
  }

  function getEditableIngredients(recipe) {
    const value =
      recipe.customIngredients ||
      recipe.ingredients ||
      recipe.ingredientsText ||
      recipe.ingredientsList ||
      "";

    return typeof value === "string" ? value : String(value || "");
  }

  function getEditableInstructions(recipe) {
    const value =
      recipe.customInstructions ||
      recipe.instructions ||
      recipe.strInstructions ||
      "";

    return typeof value === "string" ? value : String(value || "");
  }

  // ---------------- actions ----------------

  function handleStartEdit(index) {
    const recipe = savedRecipes[index];
    if (!recipe) return;

    setEditingIndex(index);
    setEditTitle(getEditableTitle(recipe));
    setEditIngredients(getEditableIngredients(recipe));
    setEditInstructions(getEditableInstructions(recipe));
    setShowModal(true);
  }

  function handleCancelEdit() {
    setShowModal(false);
    setEditingIndex(null);
  }

  function handleSaveEdit(e) {
    e.preventDefault();
    if (editingIndex === null) return;

    const trimmedTitle =
      typeof editTitle === "string" ? editTitle.trim() : String(editTitle);
    const trimmedIng =
      typeof editIngredients === "string"
        ? editIngredients.trim()
        : String(editIngredients || "");
    const trimmedIns =
      typeof editInstructions === "string"
        ? editInstructions.trim()
        : String(editInstructions || "");

    setSavedRecipes((prev) => {
      const next = [...prev];
      const current = next[editingIndex];
      if (!current) return prev;

      next[editingIndex] = {
        ...current,
        customTitle: trimmedTitle,
        customIngredients: trimmedIng,
        customInstructions: trimmedIns,
        // also sync fallback fields
        title: trimmedTitle,
        name: trimmedTitle,
        strMeal: trimmedTitle,
      };

      localStorage.setItem(LS_KEY, JSON.stringify(next));
      return next;
    });

    setShowModal(false);
    setEditingIndex(null);
  }

  function handleUnsave(index) {
    setSavedRecipes((prev) => {
      const next = prev.filter((_, i) => i !== index);
      localStorage.setItem(LS_KEY, JSON.stringify(next));
      return next;
    });

    if (editingIndex === index) setEditingIndex(null);
  }

  // ---------------- render ----------------

  return (
    <div>
      <Navigation />
      <div className="container" style={{ padding: "24px" }}>
        <h2>My Saved Recipes</h2>

        <div className="recipe-list" style={{ marginTop: 20 }}>
          {savedRecipes.map((recipe, index) => (
            <RecipeCard
              key={recipe.strMeal || index}
              recipe={recipe}
              onUnsave={() => handleUnsave(index)}
              onEdit={() => handleStartEdit(index)}
            />
          ))}
        </div>

        {/* ---------- EDIT MODAL ---------- */}
        <Modal centered show={showModal} onHide={handleCancelEdit}>
          <Form onSubmit={handleSaveEdit}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Recipe</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  Ingredients (comma-separated or free text)
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editIngredients}
                  onChange={(e) => setEditIngredients(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Instructions</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={editInstructions}
                  onChange={(e) => setEditInstructions(e.target.value)}
                />
              </Form.Group>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="outline-secondary" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button type="submit" variant="success">
                Save changes
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </div>
  );
}
