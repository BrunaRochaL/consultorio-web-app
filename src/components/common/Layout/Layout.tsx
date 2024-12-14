import { Container } from "react-bootstrap";
import "./Layout.css";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout">
      <Navbar />
      <Sidebar />
      <main className="content">
        <Container fluid className="p-4">
          {children}
        </Container>
      </main>
    </div>
  );
};

export default Layout;
