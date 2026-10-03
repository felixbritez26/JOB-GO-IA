import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function Interviews() {
  const [scheduledInterviews, setScheduledInterviews] = useState(() => {
    const storedInterviews = localStorage.getItem("scheduledInterviews");

    return storedInterviews ? JSON.parse(storedInterviews) : [];
  });

  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewType, setInterviewType] = useState("Video Call");
  const [notes, setNotes] = useState("");
  const [selectedInterview, setSelectedInterview] = useState(null);

  const [applications, setApplications] = useState([]);

  // Get applications from Flask
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

  // Only show applications with Interview status
  const interviews = applications.filter(
    (application) => application.status === "Interview",
  );

  // Save or update an interview
  const handleSaveInterview = (application) => {
    const interviewDetails = {
      applicationId: application.id,
      company: application.company,
      position: application.position,
      date: interviewDate,
      time: interviewTime,
      type: interviewType,
      notes: notes,
    };

    const interviewExists = scheduledInterviews.some(
      (interview) => interview.applicationId === application.id,
    );

    let updatedInterviews;

    if (interviewExists) {
      updatedInterviews = scheduledInterviews.map((interview) => {
        if (interview.applicationId === application.id) {
          return interviewDetails;
        }

        return interview;
      });
    } else {
      updatedInterviews = [...scheduledInterviews, interviewDetails];
    }

    setScheduledInterviews(updatedInterviews);

    localStorage.setItem(
      "scheduledInterviews",
      JSON.stringify(updatedInterviews),
    );

    setSelectedInterview(null);
    setInterviewDate("");
    setInterviewTime("");
    setInterviewType("Video Call");
    setNotes("");
  };

  // Open the interview form
  const handleOpenInterview = (application) => {
    const existingInterview = scheduledInterviews.find(
      (interview) => interview.applicationId === application.id,
    );

    if (existingInterview) {
      setInterviewDate(existingInterview.date);
      setInterviewTime(existingInterview.time);
      setInterviewType(existingInterview.type);
      setNotes(existingInterview.notes);
    } else {
      setInterviewDate("");
      setInterviewTime("");
      setInterviewType("Video Call");
      setNotes("");
    }

    setSelectedInterview(application.id);
  };

  // Close the interview form
  const handleCancelInterview = () => {
    setSelectedInterview(null);
    setInterviewDate("");
    setInterviewTime("");
    setInterviewType("Video Call");
    setNotes("");
  };

  // Delete scheduled interview information
  const handleDeleteInterview = (application) => {
    const updatedInterviews = scheduledInterviews.filter(
      (interview) => interview.applicationId !== application.id,
    );

    setScheduledInterviews(updatedInterviews);

    localStorage.setItem(
      "scheduledInterviews",
      JSON.stringify(updatedInterviews),
    );
  };

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
                key={application.id}
              >
                <h3>{application.position}</h3>

                <p>{application.company}</p>

                <p>{application.date}</p>

                <span className="status interview">
                  Interview
                </span>

                {scheduledInterviews
                  .filter(
                    (interview) =>
                      interview.applicationId === application.id,
                  )
                  .map((interview) => (
                    <div
                      className="interview-details"
                      key={interview.applicationId}
                    >
                      <p>Date: {interview.date}</p>

                      <p>Time: {interview.time}</p>

                      <p>Type: {interview.type}</p>

                      {interview.notes && (
                        <p>Notes: {interview.notes}</p>
                      )}

                      <button
                        className="delete-interview-btn"
                        onClick={() =>
                          handleDeleteInterview(application)
                        }
                      >
                        Delete Interview
                      </button>
                    </div>
                  ))}

                <button
                  className="schedule-interview-btn"
                  onClick={() =>
                    handleOpenInterview(application)
                  }
                >
                  {scheduledInterviews.some(
                    (interview) =>
                      interview.applicationId === application.id,
                  )
                    ? "Edit Interview"
                    : "Schedule Interview"}
                </button>

                {selectedInterview === application.id && (
                  <div className="interview-form">
                    <input
                      type="date"
                      value={interviewDate}
                      onChange={(event) =>
                        setInterviewDate(event.target.value)
                      }
                    />

                    <input
                      type="time"
                      value={interviewTime}
                      onChange={(event) =>
                        setInterviewTime(event.target.value)
                      }
                    />

                    <select
                      value={interviewType}
                      onChange={(event) =>
                        setInterviewType(event.target.value)
                      }
                    >
                      <option value="Video Call">
                        Video Call
                      </option>

                      <option value="Phone Call">
                        Phone Call
                      </option>

                      <option value="In Person">
                        In Person
                      </option>
                    </select>

                    <textarea
                      placeholder="Notes..."
                      value={notes}
                      onChange={(event) =>
                        setNotes(event.target.value)
                      }
                    />

                    <button
                      onClick={() =>
                        handleSaveInterview(application)
                      }
                    >
                      Save Interview
                    </button>

                    <button
                      type="button"
                      className="cancel-interview-btn"
                      onClick={handleCancelInterview}
                    >
                      Cancel
                    </button>
                  </div>
                )}
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