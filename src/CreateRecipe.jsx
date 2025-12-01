import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "./components/Navigation.jsx";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "./index.css";

const LS_KEY = "savedRecipes";

export default function CreateRecipe() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const newRecipe = {
      customTitle: title,
      customIngredients: ingredients,
      customInstructions: instructions,
      strMealThumb: image,
      // Add a unique ID
      idMeal: `custom-${Date.now()}`,
    };

    try {
      const stored = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
      const updatedRecipes = [...stored, newRecipe];
      localStorage.setItem(LS_KEY, JSON.stringify(updatedRecipes));
      navigate("/saved");
    } catch (error) {
      console.error("Failed to save recipe", error);
    }
  };

  const handleCancel = () => {
    navigate("/saved");
  };

  return (
    <div>
      <Navigation />
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <h2>Create Your Own Recipe</h2>
            <Form onSubmit={handleSave} style={{ marginTop: 20 }}>
              <Form.Group className="mb-3">
                <Form.Label>Recipe Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter recipe title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Ingredients</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="List ingredients, separated by commas"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Instructions</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={8}
                  placeholder="Enter recipe instructions"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Upload Image</Form.Label>
                <Form.Control type="file" onChange={handleImageChange} accept="image/*" />
              </Form.Group>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <Button variant="outline-secondary" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button variant="success" type="submit">
                  Save Recipe
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
