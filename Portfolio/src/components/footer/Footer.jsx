import React from "react";
import { AiFillLinkedin } from "react-icons/ai";
import { FaGithubSquare } from "react-icons/fa";
import { CONTRACT_ADDRESS } from "../../config/web3";
import "./Footer.css";

const Footer = () => {
  const year = new Date().getFullYear();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="footer__title">Suryansh Soni</span>
          <span className="footer__subtitle">Full-Stack Blockchain Developer</span>
        </div>
        <div className="footer__links">
          <a
            href="https://www.linkedin.com/in/sonisuryansh/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <AiFillLinkedin />
          </a>
          <a
            href="https://github.com/sonisuryansh"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <FaGithubSquare />
          </a>
          <button type="button" className="footer__top-btn" onClick={scrollToTop} aria-label="Go to top">
            Top
          </button>
        </div>
      </div>
      <div className="footer__meta">
        <p className="footer__copyright">Copyright {"\u00A9"} {year} Suryansh Soni. All rights reserved.</p>
        <p className="footer__contract">Smart Contract: {CONTRACT_ADDRESS}</p>
        <p className="footer__note">
          This portfolio uses IPFS for content storage and the Sepolia testnet for blockchain
          interactions. As a result, temporary network or platform delays may occasionally affect
          how quickly some content loads or displays.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
