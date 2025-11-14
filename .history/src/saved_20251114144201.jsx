// src/saved.jsx
import React, { useEffect, useState } from "react";
import Navigation from "./components/Navigation.jsx";
import RecipeCard from "./components/RecipeCard";
import { Modal, Button, Form } from "react-bootstrap";
import "./index.css";

const LS_KEY = "savedRecipes";
const FADE_MS = 250; // Must match CSS transition duration

export default function Saved() {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [deletingIndexes, setDeletingIndexes] = useState(new Set());

  // Editing state
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editIngredients, setEditIngredients] = useState("");
  const [editInstructions, setEditInstructions] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Load saved recipes from localStorage when the page mounts
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
      setSavedRecipes(saved);
    } catch {
      setSavedRecipes([]);
    }
  }, []);

  // Helpers to prepare editable text from recipe object
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
    if (recipe.customIngredients) return recipe.customIngredients;
    if (typeof recipe.ingredients === "string") return recipe.ingredients;
    if (Array.isArray(recipe.ingredients)) return recipe.ingredients.join(", ");
    if (Array.isArray(recipe.ingredientsList))
      return recipe.ingredientsList.join(", ");
    if (recipe.ingredientsText) return recipe.ingredientsText;
    return "";
  }

  function getEditableInstructions(recipe) {
    return (
      recipe.customInstructions ||
      recipe.instructions ||
      recipe.strInstructions ||
      ""
    );
  }

  // Start editing a specific recipe by index
  function handleStartEdit(recipe, index) {
    setEditingRecipe(recipe);
    setEditingIndex(index);
    setEditTitle(getEditableTitle(recipe));
    setEditIngredients(getEditableIngredients(recipe));
    setEditInstructions(getEditableInstructions(recipe));
    setShowModal(true);
  }

  // Cancel edit mode
  function handleCancelEdit() {
    setShowModal(false);
    setEditingRecipe(null);
    setEditingIndex(null);
  }

  // Save edited recipe back into state + localStorage
  function handleSaveEdit(event) {
    event.preventDefault();
    if (editingRecipe == null || editingIndex == null) return;

    const updated = {
      ...editingRecipe,
      customTitle: editTitle.trim(),
      customIngredients: editIngredients.trim(),
      customInstructions: editInstructions.trim(),
    };

    setSavedRecipes((prev) => {
      const next = [...prev];
      next[editingIndex] = updated; // update one item by index
      localStorage.setItem(LS_KEY, JSON.stringify(next));
      return next;
    });

    setShowModal(false);
    setEditingRecipe(null);
    setEditingIndex(null);
  }

  // Unsave with fade-out by index
  function handleUnsave(index) {
    setDeletingIndexes((prev) => new Set(prev).add(index));

    setTimeout(() => {
      setSavedRecipes((prev) => {
        const next = prev.filter((_, i) => i !== index);
        localStorage.setItem(LS_KEY, JSON.stringify(next));
        return next;
      });

      setDeletingIndexes((prev) => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
    }, FADE_MS);
  }

  // Empty state
  if (savedRecipes.length === 0) {
    return (
      <div>
        <Navigation />
        <div className="container" style={{ padding: "24px" }}>
          <h2>My Saved Recipes</h2>
          <p className="text-muted">No saved recipes yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      <div className="container" style={{ padding: "24px" }}>
        <h2>My Saved Recipes</h2>

        <div className="recipe-list" style={{ marginTop: 20 }}>
          {savedRecipes.map((recipe, index) => (
            <RecipeCard
              key={recipe.id || recipe.idMeal || index}
              recipe={recipe}
              onUnsave={() => handleUnsave(index)}
              isDeleting={deletingIndexes.has(index)}
              onEdit={() => handleStartEdit(recipe, index)}
            />
          ))}
        </div>

        {/* Edit Modal */}
        <Modal show={showModal} onHide={handleCancelEdit} centered>
          <Form onSubmit={handleSaveEdit}>
            <Modal.Header closeButton>
              <Modal.Title>Edit recipe</Modal.Title>
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
