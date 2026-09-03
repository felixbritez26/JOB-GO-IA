import { useState } from "react";
import Sidebar from "../components/Sidebar";

function Applications() {
  const [applications, setApplications] = useState([
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
  ]);

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

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="dashboard-content">
        <h1>Applications</h1>
        <p>Track the jobs you have applied to.</p>

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
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Applications;
