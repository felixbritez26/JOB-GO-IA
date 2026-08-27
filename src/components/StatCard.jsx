function StatCard({ title, value, detail }) {
  return (
    <div className="stat-card">
      <p className="stat-title">{title}</p>
      <h2>{value}</h2>
      <span>{detail}</span>
    </div>
  );
}

export default StatCard;