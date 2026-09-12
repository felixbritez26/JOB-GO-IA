import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";

function Skills() {
  const [skills, setSkills] = useState(() => {
    const storedSkills = localStorage.getItem("skills");

    return storedSkills
      ? JSON.parse(storedSkills)
      : [
          { name: "React", level: 85 },
          { name: "JavaScript", level: 80 },
          { name: "Python", level: 75 },
          { name: "Flask", level: 70 },
          { name: "PostgreSQL", level: 65 },
        ];
  });

  const [skillName, setSkillName] = useState("");
  const [skillLevel, setSkillLevel] = useState("");

  useEffect(() => {
    localStorage.setItem("skills", JSON.stringify(skills));
  }, [skills]);

  const handleAddSkill = () => {
    if (!skillName || !skillLevel) {
      return;
    }

    const newSkill = {
      name: skillName,
      level: Number(skillLevel),
    };

    setSkills([...skills, newSkill]);

    setSkillName("");
    setSkillLevel("");
  };

  const handleDeleteSkill = (skillName) => {
    const updatedSkills = skills.filter((skill) => skill.name !== skillName);

    setSkills(updatedSkills);
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="dashboard-content">
        <h1>Skills & Growth</h1>
        <p>Track your technical skills and development progress.</p>

        <div className="skill-form">
          <input
            type="text"
            placeholder="Skill name"
            value={skillName}
            onChange={(event) => setSkillName(event.target.value)}
          />

          <input
            type="number"
            placeholder="Level"
            min="0"
            max="100"
            value={skillLevel}
            onChange={(event) => setSkillLevel(event.target.value)}
          />

          <button onClick={handleAddSkill}>Add Skill</button>
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
              <button onClick={() => handleDeleteSkill(skill.name)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Skills;
