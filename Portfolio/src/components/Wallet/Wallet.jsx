import { useEffect, useState } from "react";
import ABI from "./ABI.json";
import Web3 from "web3";
import { CONTRACT_ADDRESS } from "../../config/web3";
import "./Wallet.css";

const Wallet = ({ saveState, state, theme, onToggleTheme }) => {
  const [connected, setConnected] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState("");

  const isAndroid = typeof navigator !== "undefined" && /android/i.test(navigator.userAgent);
  const connectedAccount = state?.connectedAccount || "";
  const shortAccount = connectedAccount
    ? `${connectedAccount.slice(0, 6)}...${connectedAccount.slice(-4)}`
    : "";
  const isReadOnly = Boolean(state?.contract) && !connected;

  useEffect(() => {
    setConnected(Boolean(state?.isWalletConnected));
  }, [state?.isWalletConnected]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!window?.ethereum) return;

    const syncConnectedAccount = async () => {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        setConnected(accounts.length > 0);
        saveState({
          isWalletConnected: accounts.length > 0,
          connectedAccount: accounts[0] || "",
        });
      } catch (err) {
        console.error(err);
      }
    };

    syncConnectedAccount();

    const handleAccountsChanged = (accounts) => {
      setConnected(accounts.length > 0);
      saveState({
        isWalletConnected: accounts.length > 0,
        connectedAccount: accounts[0] || "",
      });
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, [saveState]);

  useEffect(() => {
    const contract = state?.contract;

    if (!contract) {
      setAvatarSrc("");
      setAvatarLoaded(false);
      return;
    }

    const loadAvatar = async () => {
      try {
        const imageCid = await contract.methods.imageLink().call();
        if (imageCid) {
          setAvatarSrc(`https://gateway.pinata.cloud/ipfs/${imageCid}`);
        } else {
          setAvatarSrc("");
        }
      } catch (err) {
        console.error(err);
        setAvatarSrc("");
      }
    };

    loadAvatar();
  }, [state?.contract]);

  const init = async () => {
    if (!window?.ethereum) {
      alert("Please install MetaMask or enable it in your browser.");
      return;
    }

    try {
      const web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

      setConnected(accounts.length > 0);
      saveState({
        web3,
        contract,
        isWalletConnected: accounts.length > 0,
        connectedAccount: accounts[0] || "",
      });
    } catch (err) {
      console.error(err);
      alert("Unable to connect wallet. Please try again.");
    }
  };

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Experience", href: "#experience" },
    { label: "Certifications", href: "#certifications" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}>
      <div className="header__inner">
        <div className="header__brand">
          <div className={`header__avatar ${scrolled ? "header__avatar--visible" : ""}`}>
            <span
              className={`header__avatar-fallback ${avatarLoaded ? "header__avatar-fallback--hidden" : ""}`}
              aria-hidden={avatarLoaded}
            >
              SS
            </span>
            <img
              className={`header__avatar-image ${avatarLoaded ? "header__avatar-image--loaded" : ""}`}
              src={avatarSrc}
              alt="Profile"
              loading="lazy"
              onLoad={() => setAvatarLoaded(true)}
              onError={() => setAvatarLoaded(false)}
            />
          </div>
          <a className="brand" href="#home">
            <span className="brand__name">Suryansh</span>
            <span className="brand__tag">Web3 Developer</span>
          </a>
        </div>

        <nav className={`nav ${menuOpen ? "nav--open" : ""}`}>
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header__actions">
          <div className="wallet-status" aria-label="Portfolio connection status">
            <span className={`wallet-status__dot ${connected ? "wallet-status__dot--live" : ""}`} />
            <div className="wallet-status__text">
              <span className="wallet-status__label">{connected ? "Wallet Linked" : "Read-Only Portfolio"}</span>
              <span className="wallet-status__value">{connected ? shortAccount : "Sepolia + IPFS"}</span>
            </div>
          </div>

          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            type="button"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <span className="theme-toggle__icon">{theme === "dark" ? "Light" : "Dark"}</span>
          </button>

          {isAndroid && (
            <a
              className="header__mobile-link"
              href="https://metamask.app.link/dapp/sriche.netlify.app/"
              target="_blank"
              rel="noreferrer"
            >
              Open in MetaMask
            </a>
          )}

          <button
            className={`connectBTN ${connected ? "connected" : ""}`}
            onClick={init}
            disabled={connected}
            title={connected ? connectedAccount : "Connect wallet"}
          >
            {connected ? "Connected" : "Connect Wallet"}
          </button>

          <button
            className="menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle navigation"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
      {isReadOnly && !menuOpen && (
        <div className="header__mode-banner">Portfolio data is loading in read-only mode until a wallet connects.</div>
      )}
    </header>
  );
};

export default Wallet;
