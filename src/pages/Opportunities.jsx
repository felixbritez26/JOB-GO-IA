import Sidebar from "../components/Sidebar";
import JobCard from "../components/JobCard";

function Opportunities() {
  return (
    <div className="dashboard">
      <Sidebar />

      <main className="dashboard-content">
        <h1>Opportunities</h1>
        <p>Jobs selected based on your profile and skills.</p>

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
            title="Backend Developer"
            company="Nova Systems"
            location="New York, NY"
            match={86}
            technologies={["Python", "Flask", "PostgreSQL"]}
          />

          <JobCard
            title="Junior Software Engineer"
            company="CodeStack"
            location="Remote"
            match={81}
            technologies={["JavaScript", "React", "REST API"]}
          />
        </div>
      </main>
    </div>
  );
}

export default Opportunities;