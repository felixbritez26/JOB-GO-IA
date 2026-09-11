import Sidebar from "../components/Sidebar";
import { useState } from "react";

function Skills() {
  const [skills, setSkills] = useState([
    { name: "React", level: 85 },
    { name: "JavaScript", level: 80 },
    { name: "Python", level: 75 },
    { name: "Flask", level: 70 },
    { name: "PostgreSQL", level: 65 },
  ]);

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="dashboard-content">
        <h1>Skills & Growth</h1>
        <p>Track your technical skills and development progress.</p>

        <div className="skill-form">
          <input type="text" placeholder="Skill name" />

          <input type="number" placeholder="Level" min="0" max="100" />

          <button>Add Skill</button>
        </div>

        <div className="skills-container">
          {skills.map((skill) => (
            <div className="skill-card" key={skill.name}>
              <div className="skill-header">
                <h3>{skill.name}</h3>
                <span>{skill.level}%</span>
              </div>
              <div className="skill-progress">
                <div
                  className="skill-progress-fill"
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Skills;
