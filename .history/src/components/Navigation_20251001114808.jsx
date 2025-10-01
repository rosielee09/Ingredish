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
            <Link to="/saved">Saved</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
