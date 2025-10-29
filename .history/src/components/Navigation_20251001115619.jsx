import { Link } from "react-router-dom";
import "./Navigation.css";
import logo from "../assets/Ingredish Logo.png";

export default function Navigation() {
  return (
    <nav className="nav">
      <div className="nav-container">
        <div className="brand">
          <Link to="/">
            <img src={logo} alt="Ingredish Logo" className="logo" />
          </Link>
        </div>

        <ul className="menu">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
<<<<<<< HEAD
            <a href="#">My Recipes</a>
=======
            <Link to="/saved">Saved</Link>
>>>>>>> baaeb1e6d56acddbba3b7c4cce6c91fa8f885c60
          </li>
        </ul>
      </div>
    </nav>
  );
}
