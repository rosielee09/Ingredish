import { Link, useLocation } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { House, BookmarkHeart, PencilSquare } from "react-bootstrap-icons";
import "./Navigation.css";
import logo from "../assets/Ingredish Logo.png";

export default function Navigation() {
  const location = useLocation();

  return (
    <Navbar className="custom-navbar" fixed="top" expand="lg">
      <Container fluid className="px-4">
        <Navbar.Brand as={Link} to="/" className="brand-link">
          <img src={logo} alt="Ingredish Logo" className="logo" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            <Nav.Link
              as={Link}
              to="/"
              className={`nav-link-custom ${
                location.pathname === "/" ? "active" : ""
              }`}
            >
              <House className="nav-icon" />
              <span>Home</span>
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/saved"
              className={`nav-link-custom ${
                location.pathname === "/saved" ? "active" : ""
              }`}
            >
              <BookmarkHeart className="nav-icon" />
              <span>Saved Recipes</span>
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/create"
              className={`nav-link-custom ${
                location.pathname === "/create" ? "active" : ""
              }`}
            >
              <PencilSquare className="nav-icon" />
              <span>Create Own Recipe</span>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
