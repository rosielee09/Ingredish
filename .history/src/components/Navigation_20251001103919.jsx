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
            <Link to="/saved">Saved</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
