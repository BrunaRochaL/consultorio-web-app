import { Container, Nav, Navbar as BootstrapNavbar } from "react-bootstrap";
import "./Navbar.css";

const Navbar = () => {
  return (
    <BootstrapNavbar bg="light" variant="light" expand="lg" fixed="top">
      <Container fluid>
        <BootstrapNavbar.Brand href="#home">
          Advice Health
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#dashboard">Dashboard</Nav.Link>
            <Nav.Link href="#settings">Settings</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link href="#profile">Profile</Nav.Link>
            <Nav.Link href="#logout">Logout</Nav.Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
