import { useState } from "react";
import Sidebar from "../components/Sidebar";

function Interviews() {
  const [applications] = useState(() => {
    const storedApplications = localStorage.getItem("applications");

    return storedApplications
      ? JSON.parse(storedApplications)
      : [];
  });

  const interviews = applications.filter(
    (application) => application.status === "Interview"
  );

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="dashboard-content">
        <h1>Interviews</h1>
        <p>Track your upcoming job interviews.</p>

        <div className="applications-container">
          {interviews.length > 0 ? (
            interviews.map((application) => (
              <div
                className="application-card"
                key={`${application.company}-${application.position}`}
              >
                <h3>{application.position}</h3>
                <p>{application.company}</p>
                <p>{application.date}</p>

                <span className="status interview">
                  Interview
                </span>
              </div>
            ))
          ) : (
            <p>No interviews yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default Interviews;