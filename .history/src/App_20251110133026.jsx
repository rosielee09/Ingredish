import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import RecipeCard from "./components/RecipeCard";
import FoodBackground from "./components/FoodBackground";
import Saved from "./saved.jsx";
import {
  searchRecipes,
  searchRecipesByIngredient,
} from "./lib/recipe-generator";
import {
  Container,
  Form,
  InputGroup,
  Button,
  Badge,
  Modal,
  Spinner,
  Row,
  Col,
} from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import "./App.css";

function Home() {
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState(null);
  const [inputError, setInputError] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleClearError = () => {
    setError(null);
    setShowErrorModal(false);
  };

  const handleSearchRecipes = async (ingredientList) => {
    const list = Array.isArray(ingredientList) ? ingredientList : ingredients;
    if (!list || list.length === 0) {
      setRecipes([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const results = await searchRecipes(list);

      if (!Array.isArray(results) || results.length === 0) {
        setRecipes([{ id: "error", isError: true }]);
        return;
      }

      const validRecipes = results.filter(
        (recipe) => recipe.ingredients && recipe.ingredients.length > 0
      );

      setRecipes(
        validRecipes.length > 0
          ? validRecipes
          : [{ id: "error", isError: true }]
      );
    } catch (err) {
      console.error("Failed to fetch recipes:", err);
      setError(
        (err && err.message) || "Failed to fetch recipes. Please try again."
      );
      setShowErrorModal(true);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIngredient = async (ingredient) => {
    const trimmed = ingredient.trim();
    if (!trimmed) return;

    const splitter = /[,;\/\|]+/;
    const parts = splitter.test(trimmed)
      ? trimmed
          .split(splitter)
          .map((p) => p.trim())
          .filter(Boolean)
      : [trimmed];

    setError(null);
    setValidating(true);
    try {
      const toValidate = parts.filter((p) => !ingredients.includes(p));
      const validations = await Promise.all(
        toValidate.map(async (p) => {
          try {
            const res = await searchRecipesByIngredient(p);
            return {
              p,
              ok: Array.isArray(res) && res.length > 0,
            };
          } catch {
            return { p, ok: false };
          }
        })
      );

      const validAdded = validations.filter((v) => v.ok).map((v) => v.p);
      const invalid = validations.filter((v) => !v.ok).map((v) => v.p);

      if (validAdded.length === 0 && parts.length > 0) {
        setInputError(
          invalid.length
            ? `Not existing ingredient or incorrect name: ${invalid.join(", ")}`
            : "No valid ingredients found."
        );
        return;
      }

      const newIngredients = Array.from(
        new Set([...ingredients, ...validAdded])
      );
      setIngredients(newIngredients);
      setInputValue("");
      setInputError(
        invalid.length
          ? `Not existing ingredient or incorrect name: ${invalid.join(", ")}`
          : null
      );

      handleSearchRecipes(newIngredients);
    } catch (err) {
      console.error("Ingredient validation failed:", err);
      setError(
        (err && err.message) ||
          "Failed to validate ingredient. Please try again."
      );
      setShowErrorModal(true);
    } finally {
      setValidating(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    handleSearchRecipes();
  };

  const handleRemoveIngredient = (ingredient) => {
    const newIngredients = ingredients.filter((i) => i !== ingredient);
    setIngredients(newIngredients);
    if (newIngredients.length === 0) {
      setRecipes([]);
    } else {
      handleSearchRecipes(newIngredients);
    }
  };

  return (
    <>
      <div
        style={{
          position: "relative",
          height: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "2rem",
          overflow: "hidden",
        }}
      >
        <FoodBackground />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            color: "white",
            padding: "2rem",
          }}
        >
          <h1
            style={{
              fontSize: "3.5rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            Welcome to Ingredish!
          </h1>
          <p
            style={{
              fontSize: "1.3rem",
              textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
            }}
          >
            Transform your ingredients into delicious recipes
          </p>
        </div>
      </div>

      <Container className="py-5 text-center">
        <Row className="justify-content-center mb-3">
          <Col xs={10} md={12} lg={12}>
            <InputGroup className="shadow-sm rounded-pill modern-input">
              <Form.Control
                type="text"
                placeholder="Enter an ingredient here"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setInputError(null);
                }}
                disabled={loading || validating}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddIngredient(inputValue);
                  }
                }}
                className="rounded-start-pill ps-4"
              />
              <Button
                onClick={() => {
                  if (inputValue.trim()) {
                    handleAddIngredient(inputValue);
                  } else {
                    handleSearchRecipes();
                  }
                }}
                disabled={loading || (ingredients.length === 0 && !inputValue)}
                className="rounded-end-pill modern-btn"
              >
                {loading || validating ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <Search size={20} />
                )}
              </Button>
            </InputGroup>
          </Col>
        </Row>

        {inputError ? (
          <p className="text-danger small">{inputError}</p>
        ) : (
          <p className="text-muted small">
            Enter one ingredient at a time. Press Enter to add.
          </p>
        )}

        <div className="my-3">
          {ingredients.map((i) => (
            <Badge key={i} pill className="ingredient-badge shadow-sm">
              {i}
              <Button
                variant="link"
                size="sm"
                className="remove-btn ms-1"
                onClick={() => handleRemoveIngredient(i)}
                disabled={loading}
              >
                ×
              </Button>
            </Badge>
          ))}
        </div>

        <div className="recipe-list">
          {recipes.length > 0
            ? recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isError={recipe.isError}
                />
              ))
            : ingredients.length > 0 &&
              !loading &&
              !error && (
                <div className="mt-4">
                  <h4>No recipes found</h4>
                  <p>We couldn't find recipes that match your ingredients.</p>
                  <p>Try removing or changing some ingredients.</p>
                </div>
              )}
        </div>

        <Modal
          show={showErrorModal}
          onHide={handleClearError}
          centered
          contentClassName="modern-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>{error}</Modal.Body>
          <Modal.Footer>
            <Button className="modern-btn" onClick={handleRetry}>
              Retry
            </Button>
            <Button variant="outline-secondary" onClick={handleClearError}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}

function App() {
  return (
    <div>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/saved" element={<Saved />} />
      </Routes>
    </div>
  );
}

export default App;
