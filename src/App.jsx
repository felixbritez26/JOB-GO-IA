import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Opportunities from "./pages/Opportunities";
import Applications from "./pages/Applications";
import Interviews from "./pages/Interviews";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/interviews" element={<Interviews />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;