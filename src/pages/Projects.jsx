import Sidebar from "../components/Sidebar";

function Projects() {
  return (
    <div className="dashboard">
      <Sidebar />

      <main className="dashboard-content">
        <h1>Projects</h1>
        <p>Showcase your projects and track your development progress.</p>
      </main>
    </div>
  );
}

export default Projects;