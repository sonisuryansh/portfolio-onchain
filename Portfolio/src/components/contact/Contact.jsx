import { useState, useEffect } from "react";
import "./Contact.css";

const Contact = ({ state }) => {
  const [resume, setResume] = useState("");

  useEffect(() => {
    const contract = state?.contract;
    if (!contract) return;

    const resumeDetails = async () => {
      try {
        const resumeCid = await contract.methods.resumeLink().call();
        setResume(`https://gateway.pinata.cloud/ipfs/${resumeCid}`);
      } catch (err) {
        console.error(err);
      }
    };

    resumeDetails();
  }, [state?.contract]);

  return (
    <section className="contact-section" id="contact">
      <h1 className="title">
        Interested?
        <br />
        Let's Get in Touch!
      </h1>
      <a href={resume || "#"} target="_blank" rel="noopener noreferrer">
        <button className="downlodeBTN" disabled={!resume}>
          {resume ? "View Resume" : "Loading..."}
        </button>
      </a>
    </section>
  );
};

export default Contact;
