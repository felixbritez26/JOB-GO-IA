import { useState } from "react";
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

  const [applications] = useState(() => {
    const storedApplications = localStorage.getItem("applications");

    return storedApplications ? JSON.parse(storedApplications) : [];
  });

  const interviews = applications.filter(
    (application) => application.status === "Interview",
  );

  const handleSaveInterview = (application) => {
    const interviewDetails = {
      company: application.company,
      position: application.position,
      date: interviewDate,
      time: interviewTime,
      type: interviewType,
      notes: notes,
    };

    const interviewExists = scheduledInterviews.some(
      (interview) =>
        interview.company === application.company &&
        interview.position === application.position,
    );

    let updatedInterviews;

    if (interviewExists) {
      updatedInterviews = scheduledInterviews.map((interview) => {
        if (
          interview.company === application.company &&
          interview.position === application.position
        ) {
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

  const handleOpenInterview = (application) => {
    const existingInterview = scheduledInterviews.find(
      (interview) =>
        interview.company === application.company &&
        interview.position === application.position,
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

    setSelectedInterview(application.position);
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
                key={`${application.company}-${application.position}`}
              >
                <h3>{application.position}</h3>
                <p>{application.company}</p>
                <p>{application.date}</p>

                <span className="status interview">Interview</span>

                {scheduledInterviews
                  .filter(
                    (interview) =>
                      interview.company === application.company &&
                      interview.position === application.position,
                  )
                  .map((interview, index) => (
                    <div className="interview-details" key={index}>
                      <p>Date: {interview.date}</p>
                      <p>Time: {interview.time}</p>
                      <p>Type: {interview.type}</p>

                      {interview.notes && <p>Notes: {interview.notes}</p>}
                    </div>
                  ))}

                <button
                  className="schedule-interview-btn"
                  onClick={() => handleOpenInterview(application)}
                >
                  Schedule Interview
                </button>

                {selectedInterview === application.position && (
                  <div className="interview-form">
                    <input
                      type="date"
                      value={interviewDate}
                      onChange={(event) => setInterviewDate(event.target.value)}
                    />

                    <input
                      type="time"
                      value={interviewTime}
                      onChange={(event) => setInterviewTime(event.target.value)}
                    />

                    <select
                      value={interviewType}
                      onChange={(event) => setInterviewType(event.target.value)}
                    >
                      <option value="Video Call">Video Call</option>
                      <option value="Phone Call">Phone Call</option>
                      <option value="In Person">In Person</option>
                    </select>

                    <textarea
                      placeholder="Notes..."
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                    />

                    <button onClick={() => handleSaveInterview(application)}>
                      Save Interview
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
