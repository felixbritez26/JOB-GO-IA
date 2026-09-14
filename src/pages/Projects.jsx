import Sidebar from "../components/Sidebar";

function Projects() {
  const projects = [
    {
      name: "BarberOn",
      description:
        "Marketplace app for barbers with booking and authentication.",
      technologies: ["React", "Flask", "PostgreSQL"],
      status: "In Progress",
    },
    {
      name: "AI Job Finder",
      description:
        "Job search dashboard with applications, interviews, and skills tracking.",
      technologies: ["React", "JavaScript", "LocalStorage"],
      status: "In Progress",
    },
  ];

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="dashboard-content">
        <h1>Projects</h1>
        <p>Showcase your projects and track your development progress.</p>

        <div className="projects-container">
          {projects.map((project) => (
            <div className="project-card" key={project.name}>
              <h3>{project.name}</h3>

              <p>{project.description}</p>

              <p>Status: {project.status}</p>

              <div className="technology-list">
                {project.technologies.map((technology) => (
                  <span key={technology}>{technology}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Projects;