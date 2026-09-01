function JobCard({
  title,
  company,
  location,
  match,
  technologies,
  onSave,
  saved,
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

      <button
        className={`save-job-btn ${saved ? "saved" : ""}`}
        onClick={onSave}
      >
        {saved ? "Saved" : "Save Job"}
      </button>

      <p className="job-location">{location}</p>

      <div className="technology-list">
        {technologies.map((technology) => (
          <span key={technology}>{technology}</span>
        ))}
      </div>
    </div>
  );
}

export default JobCard;
