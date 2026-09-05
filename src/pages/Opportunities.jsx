import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import JobCard from "../components/JobCard";

function Opportunities() {
  const [search, setSearch] = useState("");
  const [technologyFilter, setTechnologyFilter] = useState("All");
  const [savedJobs, setSavedJobs] = useState(() => {
    const storedJobs = localStorage.getItem("savedJobs");

    return storedJobs ? JSON.parse(storedJobs) : [];
  });

  useEffect(() => {
    localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
  }, [savedJobs]);

  const [locationFilter, setLocationFilter] = useState("All");
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

  const handleSaveJob = (jobTitle) => {
    if (savedJobs.includes(jobTitle)) {
      setSavedJobs(savedJobs.filter((title) => title !== jobTitle));
    } else {
      setSavedJobs([...savedJobs, jobTitle]);
    }
  };
  const handleApplyJob = (job) => {
    const storedApplications = localStorage.getItem("applications");

    const applications = storedApplications
      ? JSON.parse(storedApplications)
      : [];

    const newApplication = {
      company: job.company,
      position: job.title,
      status: "Applied",
      date: new Date().toLocaleDateString(),
    };

    const updatedApplications = [...applications, newApplication];

    localStorage.setItem("applications", JSON.stringify(updatedApplications));
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesLocation =
      locationFilter === "All" || job.location === locationFilter;

    const matchesTechnology =
      technologyFilter === "All" || job.technologies.includes(technologyFilter);

    return matchesSearch && matchesLocation && matchesTechnology;
  });

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

          <select
            value={locationFilter}
            onChange={(event) => setLocationFilter(event.target.value)}
          >
            <option value="All">All Locations</option>
            <option value="New York, NY">New York, NY</option>
            <option value="Remote">Remote</option>
          </select>

          <select
            value={technologyFilter}
            onChange={(event) => setTechnologyFilter(event.target.value)}
          >
            <option value="All">All Technologies</option>
            <option value="React">React</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Python">Python</option>
            <option value="Flask">Flask</option>
            <option value="PostgreSQL">PostgreSQL</option>
          </select>
        </div>

        <div className="jobs-container">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobCard
                key={job.title}
                title={job.title}
                company={job.company}
                location={job.location}
                match={job.match}
                technologies={job.technologies}
                onSave={() => handleSaveJob(job.title)}
                saved={savedJobs.includes(job.title)}
                onApply={() => handleApplyJob(job)}
              />
            ))
          ) : (
            <p className="no-jobs">No jobs found.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default Opportunities;
