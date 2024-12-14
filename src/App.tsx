import { BrowserRouter, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./components/common/Layout/Layout";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes></Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
