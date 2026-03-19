import React, { useEffect, useState } from "react";
import { FaDonate } from "react-icons/fa";
import { Modal, ModalHeader, ModalBody, Row, Button } from "reactstrap";
import "./Projects.css";

const Projects = ({ state }) => {
  const [modal, setModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [donation, setDonation] = useState("");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const contract = state?.contract;
    if (!contract) {
      setProjects([]);
      setLoadError("");
      return;
    }

    const projectDetails = async () => {
      try {
        const projects = await contract.methods.getAllProjects().call();
        setProjects(projects || []);
        setLoadError("");
      } catch (err) {
        console.error(err);
        setProjects([]);
        setLoadError("Unable to load projects from the connected contract.");
      }
    };

    projectDetails();
  }, [state?.contract]);

  const donateEth = async (event) => {
    event.preventDefault();
    if (!donation) return;

    try {
      const { contract, web3 } = state;
      const weiValue = web3.utils.toWei(donation, "ether");
      const accounts = await web3.eth.getAccounts();
      await contract.methods.donate().send({ from: accounts[0], value: weiValue, gas: 480000 });
      alert("Transaction successful!");
      setDonation("");
      setModal(false);
    } catch (err) {
      console.error(err);
      alert("Transaction not successful. Please check your wallet and try again.");
    }
  };

  return (
    <section className="project-section" id="projects">
      <h1 className="title">Projects</h1>
      <div className="card-wrapper">
        {projects.map((project) => {
          const githubLink = `https://github.com/sonisuryansh/${project.githubLink}`;
          return (
            <a
              key={project.name}
              href={githubLink}
              className="project-card"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="card-img">
                <img
                  src={`https://gateway.pinata.cloud/ipfs/${project.image}`}
                  alt={project.name}
                />
              </div>
              <div className="card-text">
                <h3>{project.name}</h3>
                <p>{project.description}</p>
              </div>
            </a>
          );
        })}
      </div>

      {!state?.contract && (
        <p className="projects-status">Connect your wallet to load project cards from the contract.</p>
      )}

      {state?.contract && loadError && <p className="projects-status">{loadError}</p>}

      {state?.contract && !loadError && projects.length === 0 && (
        <p className="projects-status">No project cards were returned by this contract yet.</p>
      )}

      <Modal size="md" isOpen={modal} toggle={() => setModal(!modal)}>
        <ModalHeader toggle={() => setModal(!modal)}>
          Enter the ETH amount to donate
        </ModalHeader>
        <ModalBody>
          <form onSubmit={donateEth}>
            <Row className="align-items-center gap-3">
              <label htmlFor="eth" className="mb-0" style={{ flex: 1 }}>
                Amount (ETH)
              </label>
              <input
                id="eth"
                type="number"
                min="0"
                step="0.0001"
                value={donation}
                onChange={(e) => setDonation(e.target.value)}
                placeholder="0.01"
                className="form-control"
              />
            </Row>
            <Button type="submit" className="mt-4" disabled={!donation}>
              Send
            </Button>
          </form>
        </ModalBody>
      </Modal>

      <p className="donate" onClick={() => setModal(true)}>
        Enjoyed the projects? Consider donating ETH
        <FaDonate className="icon" />
      </p>
    </section>
  );
};

export default Projects;
