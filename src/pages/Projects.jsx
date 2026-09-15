import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function Projects() {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectStatus, setProjectStatus] = useState("In Progress");
  const [projects, setProjects] = useState(() => {
    const storedProjects = localStorage.getItem("projects");

    return storedProjects
      ? JSON.parse(storedProjects)
      : [
          {
            name: "BarberOn",
            description:
              "Marketplace app for barbers with booking and authentication.",
            technologies: ["React", "Flask", "PostgreSQL"],
            status: "In Progress",
            github: "#",
            demo: "#",
          },
          {
            name: "AI Job Finder",
            description:
              "Job search dashboard with applications, interviews, and skills tracking.",
            technologies: ["React", "JavaScript", "LocalStorage"],
            status: "In Progress",
            github: "#",
            demo: "#",
          },
        ];
  });
  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);
  const handleAddProject = () => {
    if (!projectName || !projectDescription) {
      return;
    }

    const newProject = {
      name: projectName,
      description: projectDescription,
      technologies: [],
      status: projectStatus,
      github: "#",
      demo: "#",
    };

    setProjects([...projects, newProject]);

    setProjectName("");
    setProjectDescription("");
    setProjectStatus("In Progress");
  };
  const handleDeleteProject = (projectName) => {
    const updatedProjects = projects.filter(
      (project) => project.name !== projectName,
    );

    setProjects(updatedProjects);
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="dashboard-content">
        <h1>Projects</h1>
        <p>Showcase your projects and track your development progress.</p>
        <div className="project-form">
          <input
            type="text"
            placeholder="Project name"
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
          />

          <input
            type="text"
            placeholder="Project description"
            value={projectDescription}
            onChange={(event) => setProjectDescription(event.target.value)}
          />

          <select
            value={projectStatus}
            onChange={(event) => setProjectStatus(event.target.value)}
          >
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Paused">Paused</option>
          </select>

          <button onClick={handleAddProject}>Add Project</button>
        </div>

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
              <div className="project-actions">
                <a href={project.github} target="_blank" rel="noreferrer">
                  GitHub
                </a>
                <button
                  className="delete-project-btn"
                  onClick={() => handleDeleteProject(project.name)}
                >
                  Delete Project
                </button>

                <a href={project.demo} target="_blank" rel="noreferrer">
                  Live Demo
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Projects;
