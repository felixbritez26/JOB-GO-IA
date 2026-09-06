import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>Felix AI</h2>
      <p>Job Finder</p>

      <nav>
        <Link to="/">Dashboard</Link>
        <Link to="/opportunities">Opportunities</Link>
        <Link to="/applications">Applications</Link>
        <Link to="/interviews">Interviews</Link>
        <p>Skills & Growth</p>
        <p>Projects</p>
      </nav>
    </aside>
  );
}

export default Sidebar;
