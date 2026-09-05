import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

const initialApplications = [
  {
    company: "TechNova",
    position: "Junior Full Stack Developer",
    status: "Applied",
    date: "Sep 1, 2026",
  },
  {
    company: "Pixel Labs",
    position: "Frontend Developer",
    status: "Interview",
    date: "Aug 29, 2026",
  },
  {
    company: "CloudWorks",
    position: "Software Engineer",
    status: "Rejected",
    date: "Aug 25, 2026",
  },
];

function Applications() {
  const [applications, setApplications] = useState(() => {
    const storedApplications = localStorage.getItem("applications");

    return storedApplications
      ? JSON.parse(storedApplications)
      : initialApplications;
  });

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("Applied");

  useEffect(() => {
    localStorage.setItem("applications", JSON.stringify(applications));
  }, [applications]);

  const handleAddApplication = (event) => {
    event.preventDefault();

    const newApplication = {
      company,
      position,
      status,
      date: new Date().toLocaleDateString(),
    };

    setApplications([...applications, newApplication]);

    setCompany("");
    setPosition("");
    setStatus("Applied");
  };

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
          />

          <input
            type="text"
            placeholder="Position"
            value={position}
            onChange={(event) => setPosition(event.target.value)}
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
              key={`${application.company}-${application.position}`}
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
