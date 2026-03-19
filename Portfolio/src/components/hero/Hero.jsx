import React, { useEffect, useState} from 'react'
import { Modal, ModalBody, Row } from "reactstrap"
import heroImg from "../../assets/hero-img.png";
import './Hero.css'

const Hero = ({ state }) => {
  const [modal, setModal] = useState(false);
  const [description, setDescription] = useState("");
  const [cid, setCid] = useState("");

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

          <Modal size="md" isOpen={modal} toggle={() => setModal(!modal)}>
            <ModalBody>
              <Row className="text-align">
                <label>Email: sonisuryansh53@gmail.com</label>
              </Row>
            </ModalBody>
          </Modal>
        </div>

        <div className="hero-img">
          <div className="img-container">
            <img
              src={cid ? `https://gateway.pinata.cloud/ipfs/${cid}` : heroImg}
              alt="Profile"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero
