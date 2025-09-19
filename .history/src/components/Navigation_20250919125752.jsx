import "./Navigation.css";

export default function Navigation() {
  return (
    <nav className="nav">
      <div className="nav-container">
        <div className="brand">Ingredish</div>
      </div>
      <ul>
        <li>
          <a href="#">Home</a>
        </li>
        <li>
          <a href="#">Saved</a>
        </li>
      </ul>
    </nav>
  );
}
