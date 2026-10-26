
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import JobCard from "../components/JobCard";
import { useEffect, useState } from "react";
import AIAssistant from "../components/AIAssistant";

function Dashboard() {
  // Saved jobs
  const [savedJobs] = useState(() => {
    try {
      const storedJobs = localStorage.getItem("savedJobs");
      const parsedJobs = storedJobs ? JSON.parse(storedJobs) : [];

      return Array.isArray(parsedJobs) ? parsedJobs : [];
    } catch (error) {
      console.error("Error loading saved jobs:", error);
      return [];
    }
  });

  // Applications
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [applicationsError, setApplicationsError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchApplications = async () => {
      try {
        setLoadingApplications(true);
        setApplicationsError("");

        const token = localStorage.getItem("access_token");

        if (!token) {
          setApplications([]);
          setApplicationsError(
            "Please log in to see your job applications."
          );
          return;
        }

        const response = await fetch("/api/applications", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        if (response.status === 401) {
          throw new Error(
            "Your session is invalid or expired. Please log in again."
          );
        }

        if (!response.ok) {
          throw new Error(
            `Failed to load applications (${response.status}).`
          );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error(
            "The server returned an invalid applications format."
          );
        }

        setApplications(data);
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        console.error("Error fetching applications:", error);

        setApplications([]);
        setApplicationsError(error.message);
      } finally {
        if (!controller.signal.aborted) {
          setLoadingApplications(false);
        }
      }
    };

    fetchApplications();

    return () => controller.abort();
  }, []);

  // Dashboard statistics
  const interviewCount = applications.filter(
    (application) => application.status === "Interview"
  ).length;

  const responseRate =
    applications.length > 0
      ? Math.round(
          (interviewCount / applications.length) * 100
        )
      : 0;

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="dashboard-content">
        <h1>Hello Felix! 👋</h1>
        <p>Your AI job search assistant is working for you.</p>

        {loadingApplications && (
          <p>Loading your applications...</p>
        )}

        {applicationsError && !loadingApplications && (
          <p role="alert" className="dashboard-error">
            {applicationsError}
          </p>
        )}

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

          <StatCard
            title="Response Rate"
            value={`${responseRate}%`}
            detail="Interview response rate"
          />

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
              <p>
                Jobs selected based on your skills and profile.
              </p>
            </div>
          </div>

          <div className="jobs-container">
            <JobCard
              title="Junior Full Stack Developer"
              company="TechNova"
              location="New York, NY"
              match={94}
              technologies={[
                "React",
                "Python",
                "PostgreSQL",
              ]}
            />

            <JobCard
              title="Frontend Developer"
              company="Pixel Labs"
              location="Remote"
              match={88}
              technologies={[
                "React",
                "JavaScript",
                "CSS",
              ]}
            />

            <JobCard
              title="Software Engineer"
              company="CloudWorks"
              location="New York, NY"
              match={82}
              technologies={[
                "Python",
                "Flask",
                "SQL",
              ]}
            />
          </div>
        </section>

        <AIAssistant />
      </main>
    </div>
  );
}

export default Dashboard;
