import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import JobCard from "../components/JobCard";
import { useState } from "react";

function Dashboard() {
  const [savedJobs] = useState(() => {
    const storedJobs = localStorage.getItem("savedJobs");

    return storedJobs ? JSON.parse(storedJobs) : [];
  });
  const [applications] = useState(() => {
    const storedApplications = localStorage.getItem("applications");

    return storedApplications ? JSON.parse(storedApplications) : [];
  });

  const interviewCount = applications.filter(
    (application) => application.status === "Interview",
  ).length;

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="dashboard-content">
        <h1>Hello Felix! 👋</h1>
        <p>Your AI job search assistant is working for you.</p>

        <div className="stats-container">
          <StatCard
            title="Applications Sent"
            value={applications.length}
            detail="Total applications"
          />

          <StatCard
            title="Interviews"
            value={interviewCount}
            detail="Current interviews"
          />

          <StatCard title="Response Rate" value="23%" detail="+5% this month" />

          <StatCard
            title="Saved Jobs"
            value={savedJobs.length}
            detail="Total saved jobs"
          />
        </div>

        <section className="jobs-section">
          <div className="section-header">
            <div>
              <h2>Recommended Opportunities</h2>
              <p>Jobs selected based on your skills and profile.</p>
            </div>
          </div>

          <div className="jobs-container">
            <JobCard
              title="Junior Full Stack Developer"
              company="TechNova"
              location="New York, NY"
              match={94}
              technologies={["React", "Python", "PostgreSQL"]}
            />

            <JobCard
              title="Frontend Developer"
              company="Pixel Labs"
              location="Remote"
              match={88}
              technologies={["React", "JavaScript", "CSS"]}
            />

            <JobCard
              title="Software Engineer"
              company="CloudWorks"
              location="New York, NY"
              match={82}
              technologies={["Python", "Flask", "SQL"]}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
