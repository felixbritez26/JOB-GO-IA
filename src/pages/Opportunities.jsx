import { useState } from "react";
import Sidebar from "../components/Sidebar";
import JobCard from "../components/JobCard";

function Opportunities() {
  const [search, setSearch] = useState("");

  const jobs = [
    {
      title: "Junior Full Stack Developer",
      company: "TechNova",
      location: "New York, NY",
      match: 94,
      technologies: ["React", "Python", "PostgreSQL"],
    },
    {
      title: "Frontend Developer",
      company: "Pixel Labs",
      location: "Remote",
      match: 88,
      technologies: ["React", "JavaScript", "CSS"],
    },
    {
      title: "Backend Developer",
      company: "Nova Systems",
      location: "New York, NY",
      match: 86,
      technologies: ["Python", "Flask", "PostgreSQL"],
    },
    {
      title: "Junior Software Engineer",
      company: "CodeStack",
      location: "Remote",
      match: 81,
      technologies: ["JavaScript", "React", "REST API"],
    },
  ];

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="dashboard-content">
        <h1>Opportunities</h1>
        <p>Jobs selected based on your profile and skills.</p>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="jobs-container">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.title}
              title={job.title}
              company={job.company}
              location={job.location}
              match={job.match}
              technologies={job.technologies}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default Opportunities;