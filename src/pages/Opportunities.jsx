import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import JobCard from "../components/JobCard";

function Opportunities() {
  const [search, setSearch] = useState("");
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [technologyFilter, setTechnologyFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [jobs, setJobs] = useState([]);

  const [savedJobs, setSavedJobs] = useState(() => {
    const storedJobs = localStorage.getItem("savedJobs");

    return storedJobs ? JSON.parse(storedJobs) : [];
  });

  // Save saved jobs to localStorage
  useEffect(() => {
    localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
  }, [savedJobs]);

  // Get jobs from Flask
  useEffect(() => {
    fetch("/api/jobs")
      .then((response) => response.json())
      .then((data) => {
        setJobs(data);
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
      });
  }, []);

  // Get applications from the database
  useEffect(() => {
    fetch("/api/applications")
      .then((response) => response.json())
      .then((data) => {
        const positions = data.map(
          (application) => application.position
        );

        setAppliedJobs(positions);
      })
      .catch((error) => {
        console.error("Error fetching applications:", error);
      });
  }, []);

  const handleSaveJob = (jobTitle) => {
    if (savedJobs.includes(jobTitle)) {
      setSavedJobs(savedJobs.filter((title) => title !== jobTitle));
    } else {
      setSavedJobs([...savedJobs, jobTitle]);
    }
  };

  const handleApplyJob = async (job) => {
    if (appliedJobs.includes(job.title)) {
      return;
    }

    const newApplication = {
      company: job.company,
      position: job.title,
      status: "Applied",
      date: new Date().toLocaleDateString(),
    };

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newApplication),
      });

      if (!response.ok) {
        console.error("Failed to create application");
        return;
      }

      await response.json();

      setAppliedJobs([...appliedJobs, job.title]);
    } catch (error) {
      console.error("Error creating application:", error);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesLocation =
      locationFilter === "All" || job.location === locationFilter;

    const matchesTechnology =
      technologyFilter === "All" ||
      job.technologies.includes(technologyFilter);

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
                applied={appliedJobs.includes(job.title)}
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