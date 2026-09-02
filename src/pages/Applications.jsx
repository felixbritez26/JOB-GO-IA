import Sidebar from "../components/Sidebar";

function Applications() {
  return (
    <div className="dashboard">
      <Sidebar />

      <main className="dashboard-content">
        <h1>Applications</h1>
        <p>Track the jobs you have applied to.</p>
      </main>
    </div>
  );
}

export default Applications;