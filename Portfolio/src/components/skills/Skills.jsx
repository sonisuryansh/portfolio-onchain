import "./Skills.css";

import docker from "../../assets/skills/docker.png";
import ethereum from "../../assets/skills/ethereum.png";
import git from "../../assets/skills/git.png";
import ipfs from "../../assets/skills/ipfs.png";
import java from "../../assets/skills/java.png";
import mongo from "../../assets/skills/mongo.png";
import node from "../../assets/skills/node.svg";
import react from "../../assets/skills/react.png";
import solidity from "../../assets/skills/solidity.png";

const featuredSkills = [
  { name: "React", image: react, keyName: "react" },
  { name: "Java", image: java, keyName: "java" },
  { name: "Solidity", image: solidity, keyName: "solidity" },
  { name: "Ethereum", image: ethereum, keyName: "ethereum" },
  { name: "IPFS", image: ipfs, keyName: "ipfs" },
  { name: "Node.js", image: node, keyName: "node" },
  { name: "MongoDB", image: mongo, keyName: "mongo" },
  { name: "Docker", image: docker, keyName: "docker" },
  { name: "Git", image: git, keyName: "git" },
];

const capabilityGroups = [
  {
    title: "Application Engineering",
    items: ["JavaScript", "React.js", "Node.js", "Express.js", "Spring Boot", "REST APIs", "Microservices"],
  },
  {
    title: "Blockchain Development",
    items: ["Solidity", "Ethereum", "Hardhat", "Truffle", "Remix IDE", "MetaMask", "IPFS", "Smart Contracts"],
  },
  {
    title: "Data & Tooling",
    items: ["Java", "MongoDB", "MySQL", "Docker", "Git/GitHub", "Linux", "VS Code", "IoT Systems"],
  },
];

const Skills = () => {
  return (
    <section className="skills-section" id="skills">
      <div className="skills-shell">
        <div className="skills-top">
          <div className="skills-heading">
            <p className="skills-kicker">What I Bring</p>
            <h2 className="skills-title">Skills & Capabilities</h2>
            <p className="skills-copy">
              Full-stack development with a strong Web3 focus across frontend, backend, smart
              contracts, APIs, and developer tooling.
            </p>
          </div>

          <div className="skills-featured" aria-label="Featured skills">
            {featuredSkills.map((skill) => (
              <article key={skill.name} className={`skill-badge skill-badge--${skill.keyName}`}>
                <div className="skill-badge__icon">
                  <img src={skill.image} alt={skill.name} />
                </div>
                <span>{skill.name}</span>
              </article>
            ))}
          </div>
        </div>

        <div className="skills-groups">
          {capabilityGroups.map((group) => (
            <article key={group.title} className="skills-group">
              <h3>{group.title}</h3>
              <div className="skills-group__tags">
                {group.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
