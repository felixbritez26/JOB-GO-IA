import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("Applied");

  // GET applications from Flask
  useEffect(() => {
    fetch("/api/applications")
      .then((response) => response.json())
      .then((data) => {
        setApplications(data);
      })
      .catch((error) => {
        console.error("Error fetching applications:", error);
      });
  }, []);

  // POST a new application to Flask
  const handleAddApplication = async (event) => {
    event.preventDefault();

    const newApplication = {
      company,
      position,
      status,
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

      const createdApplication = await response.json();

      setApplications([...applications, createdApplication]);

      setCompany("");
      setPosition("");
      setStatus("Applied");
    } catch (error) {
      console.error("Error creating application:", error);
    }
  };

  // Change status in React for now
  const handleStatusChange = (position, newStatus) => {
    const updatedApplications = applications.map((application) => {
      if (application.position === position) {
        return {
          ...application,
          status: newStatus,
        };
      }

      return application;
    });

    setApplications(updatedApplications);
  };

  // Delete from React for now
  const handleDeleteApplication = (position) => {
    const updatedApplications = applications.filter(
      (application) => application.position !== position,
    );

    setApplications(updatedApplications);
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="dashboard-content">
        <h1>Applications</h1>
        <p>Track the jobs you have applied to.</p>

        <form className="application-form" onSubmit={handleAddApplication}>
          <input
            type="text"
            placeholder="Company"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Position"
            value={position}
            onChange={(event) => setPosition(event.target.value)}
            required
          />

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Rejected">Rejected</option>
            <option value="Offer">Offer</option>
          </select>

          <button type="submit">Add Application</button>
        </form>

        <div className="applications-container">
          {applications.map((application) => (
            <div
              className="application-card"
              key={
                application.id ||
                `${application.company}-${application.position}`
              }
            >
              <h3>{application.position}</h3>

              <p>{application.company}</p>

              <p>{application.date}</p>

              <span className={`status ${application.status.toLowerCase()}`}>
                {application.status}
              </span>

              <select
                value={application.status}
                onChange={(event) =>
                  handleStatusChange(application.position, event.target.value)
                }
              >
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Rejected">Rejected</option>
                <option value="Offer">Offer</option>
              </select>

              <button
                className="delete-application-btn"
                onClick={() => handleDeleteApplication(application.position)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Applications;
