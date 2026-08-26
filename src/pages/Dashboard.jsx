import Sidebar from "../components/Sidebar";

function Dashboard() {
  return (
    <div className="dashboard">
      <Sidebar />

      <main className="dashboard-content">
        <h1>Hello Felix! 👋</h1>
        <p>Your AI job search assistant is working for you.</p>
      </main>
    </div>
  );
}

export default Dashboard;