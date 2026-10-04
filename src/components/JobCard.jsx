function JobCard({
  title,
  company,
  location,
  match,
  technologies,
  matchedSkills,
  missingSkills,
  onSave,
  saved,
  onApply,
  applied,
}) {
  return (
    <div className="job-card">
      <div className="job-card-header">
        <div>
          <h3>{title}</h3>
          <p>{company}</p>
        </div>

        <span className="match">{match}% match</span>
      </div>
      {onApply && (
        <button className="apply-job-btn" onClick={onApply} disabled={applied}>
          {applied ? "Applied" : "Apply"}
        </button>
      )}

      {onSave && (
        <button
          className={`save-job-btn ${saved ? "saved" : ""}`}
          onClick={onSave}
        >
          {saved ? "Saved" : "Save Job"}
        </button>
      )}

      <p className="job-location">{location}</p>

      <div className="technology-list">
        {technologies.map((technology) => (
          <span key={technology}>{technology}</span>
        ))}
      </div>
      <div className="skill-analysis">
        {matchedSkills && matchedSkills.length > 0 && (
          <p className="matched-skills">
            ✓ Matched: {matchedSkills.join(", ")}
          </p>
        )}

        {missingSkills && missingSkills.length > 0 && (
          <p className="missing-skills">
            ✗ Missing: {missingSkills.join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}

export default JobCard;
