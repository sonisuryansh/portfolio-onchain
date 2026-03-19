import React, { useEffect, useState} from 'react'
import { Modal, ModalBody, Row } from "reactstrap"
import heroImg from "../../assets/hero-img.png";
import './Hero.css'

const techQuotes = [
  "It works on my machine. My machine is a museum artifact.",
  "Deploy on Friday? Bold move, captain.",
  "404: Sleep not found. Debugging in progress.",
  "I speak fluent JavaScript and mild panic.",
  "Blockchain never forgets... unlike my RAM.",
  "Gas fees are just surprise boss fights.",
  "Smart contracts are forever. Typos are too.",
];

const Hero = ({ state }) => {
  const [modal, setModal] = useState(false);
  const [description, setDescription] = useState("");
  const [cid, setCid] = useState("");
  const [hoveredQuote, setHoveredQuote] = useState("");
  const [showQuote, setShowQuote] = useState(false);

  useEffect(() => {
    const contract = state?.contract;
    if (!contract) return;

    const loadContent = async () => {
      try {
        const [descriptionText, imageCid] = await Promise.all([
          contract.methods.description().call(),
          contract.methods.imageLink().call(),
        ]);
        setDescription(descriptionText);
        setCid(imageCid);
      } catch (err) {
        console.error(err);
      }
    };

    loadContent();
  }, [state?.contract]);

  const pickRandomQuote = () => {
    const candidates = techQuotes.filter((quote) => quote !== hoveredQuote);
    const source = candidates.length ? candidates : techQuotes;
    const randomIndex = Math.floor(Math.random() * source.length);
    setHoveredQuote(source[randomIndex]);
  };

  return (
    <section className="hero" id="home">
      <div className="hero__container">
        <div className="hero-text">
          <p>
            <span>Suryansh Soni</span> is a Full-Stack Blockchain Developer based in India.
          </p>
          <h1>I build decentralized applications in the Web3 space.</h1>
          <h3>{description}</h3>

          <button className="msg-btn" onClick={() => setModal(true)}>
            Get in Touch
          </button>

          <Modal
            size="md"
            isOpen={modal}
            toggle={() => setModal(!modal)}
            className="hero-contact-modal"
            centered
          >
            <ModalBody>
              <Row className="text-align">
                <label>Email: sonisuryansh53@gmail.com</label>
              </Row>
            </ModalBody>
          </Modal>
        </div>

        <div className="hero-img">
          <div
            className="img-container"
            onMouseEnter={() => {
              pickRandomQuote();
              setShowQuote(true);
            }}
            onMouseLeave={() => setShowQuote(false)}
          >
            <img
              src={cid ? `https://gateway.pinata.cloud/ipfs/${cid}` : heroImg}
              alt="Profile"
            />
          </div>
          <p className={`hero-quote ${showQuote ? "hero-quote--visible" : ""}`}>
            {hoveredQuote || techQuotes[0]}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero
