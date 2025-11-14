import React, { useEffect, useState } from "react";
import Navigation from "./components/Navigation.jsx";
import RecipeCard from "./components/RecipeCard";
import { Modal, Button, Form } from "react-bootstrap";
import "./index.css";

const LS_KEY = "savedRecipes";

export default function Saved() {
  const [savedRecipes, setSavedRecipes] = useState([]);

  // index ของการ์ดที่กำลังแก้ไขอยู่
  const [editingIndex, setEditingIndex] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editIngredients, setEditIngredients] = useState("");
  const [editInstructions, setEditInstructions] = useState("");
  const [showModal, setShowModal] = useState(false);

  // โหลดข้อมูลจาก localStorage ครั้งแรก
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
      setSavedRecipes(saved);
    } catch {
      setSavedRecipes([]);
    }
  }, []);

  // ------- helpers สำหรับดึงค่ามาใส่ฟอร์ม -------

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

  // ------- กดปุ่ม Edit บนการ์ด -------

  function handleStartEdit(index) {
    const recipe = savedRecipes[index];
    if (!recipe) return;

    setEditingIndex(index);
    setEditTitle(getEditableTitle(recipe));
    setEditIngredients(getEditableIngredients(recipe));
    setEditInstructions(getEditableInstructions(recipe));
    setShowModal(true);
  }

  // ------- กด Cancel หรือปิด modal -------

  function handleCancelEdit() {
    setShowModal(false);
    setEditingIndex(null);
  }

  // ------- กด Save changes -------

  function handleSaveEdit() {
    if (editingIndex === null) return;

    setSavedRecipes((prev) => {
      const next = [...prev];
      const current = next[editingIndex];
      if (!current) return prev;

      const trimmedTitle = editTitle.trim();
      const trimmedIng = editIngredients.trim();
      const trimmedIns = editInstructions.trim();

      // อัปเดตทุก field ที่เกี่ยวกับชื่อ/ingredients/instructions
      const updated = {
        ...current,
        customTitle: trimmedTitle,
        title: trimmedTitle,
        name: trimmedTitle,
        strMeal: trimmedTitle,
        customIngredients: trimmedIng,
        customInstructions: trimmedIns,
      };

      next[editingIndex] = updated;
      localStorage.setItem(LS_KEY, JSON.stringify(next));
      return next;
    });

    setShowModal(false);
    setEditingIndex(null);
  }

  // ------- ลบ (unsave) การ์ด -------

  function handleUnsave(index) {
    setSavedRecipes((prev) => {
      const next = prev.filter((_, i) => i !== index);
      localStorage.setItem(LS_KEY, JSON.stringify(next));
      return next;
    });
  }

  // ------- ถ้ายังไม่มีสูตรที่เซฟ -------

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

  // ------- หน้าแสดงการ์ด + modal -------

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
              onEdit={() => handleStartEdit(index)}
            />
          ))}
        </div>

        {/* Edit Modal */}
        <Modal show={showModal} onHide={handleCancelEdit} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit recipe</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
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
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="outline-secondary" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleSaveEdit}>
              Save changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
