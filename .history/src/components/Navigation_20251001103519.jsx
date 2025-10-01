import "./Navigation.css";

export default function Navigation() {
  return (
    <nav className="nav">
      <div className="nav-container">
        <div className="brand">Ingredish</div>
        <ul className="menu">
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="saved.jsx">Saved</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
