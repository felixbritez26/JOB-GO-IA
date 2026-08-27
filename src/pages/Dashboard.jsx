import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";

function Dashboard() {
  return (
    <div className="dashboard">
      <Sidebar />

      <main className="dashboard-content">
        <h1>Hello Felix! 👋</h1>
        <p>Your AI job search assistant is working for you.</p>

        <div className="stats-container">
          <StatCard
            title="Applications Sent"
            value="47"
            detail="+12 this week"
          />

          <StatCard
            title="Interviews"
            value="6"
            detail="+2 this week"
          />

          <StatCard
            title="Response Rate"
            value="23%"
            detail="+5% this month"
          />

          <StatCard
            title="Saved Jobs"
            value="18"
            detail="4 new today"
          />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;