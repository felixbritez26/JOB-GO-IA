function JobCard({ title, company, location, match, technologies }) {
  return (
    <div className="job-card">
      <div className="job-card-header">
        <div>
          <h3>{title}</h3>
          <p>{company}</p>
        </div>

        <span className="match">{match}% match</span>
      </div>

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