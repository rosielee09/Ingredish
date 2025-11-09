import React, { useEffect, useState } from "react";
import Navigation from "./components/Navigation.jsx";
import RecipeCard from "./components/RecipeCard";
import "./index.css";

const LS_KEY = "savedRecipes";
const FADE_MS = 250; // ต้องตรงกับ CSS transition

export default function Saved() {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [deletingIds, setDeletingIds] = useState(new Set());

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(LS_KEY)) || [];
    setSavedRecipes(saved);
  }, []);

  // เรียกจาก RecipeCard -> เริ่ม fade แล้วค่อยลบจริงหลัง 250ms
  function handleUnsave(id) {
    // mark ว่ากำลังลบ เพื่อใส่คลาส fade-out
    setDeletingIds((prev) => new Set(prev).add(id));

    // หน่วงเวลาให้อนิเมชันเล่นเสร็จ แล้วค่อยลบจริง
    setTimeout(() => {
      setSavedRecipes((prev) => {
        const next = prev.filter((r) => r.id !== id);
        localStorage.setItem(LS_KEY, JSON.stringify(next));
        return next;
      });
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, FADE_MS);
  }

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
          {savedRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onUnsave={handleUnsave}
              isDeleting={deletingIds.has(recipe.id)} // ส่งสถานะกำลังลบ
            />
          ))}
        </div>
      </div>
    </div>
  );
}
