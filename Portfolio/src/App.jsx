import { useCallback, useEffect, useState } from "react";
import Web3 from "web3";
import Wallet from "./components/Wallet/Wallet";
import Handles from "./components/handles/Handles";
import Hero from "./components/hero/Hero";
import Projects from "./components/projects/Projects";
import Skills from "./components/skills/Skills";
import Experience from "./components/experience/Experience";
import Certifications from "./components/certifications/Certifications";
import Contact from "./components/contact/Contact";
import Footer from "./components/footer/Footer";
import ABI from "./components/Wallet/ABI.json";
import { CONTRACT_ADDRESS, READ_ONLY_RPC_URL } from "./config/web3";
import backgroundVideo from "./assets/skills/bg.mp4";
import "./index.css";

function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";

    const savedTheme = window.localStorage.getItem("portfolio-theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const [state, setState] = useState({
    web3: null,
    contract: null,
    isWalletConnected: false,
    connectedAccount: "",
  });

  const saveState = useCallback((nextState) => {
    setState((currentState) => ({ ...currentState, ...nextState }));
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  useEffect(() => {
    const initializeReadOnlyContract = async () => {
      try {
        const web3 = new Web3(READ_ONLY_RPC_URL);
        const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
        setState((currentState) => ({
          ...currentState,
          web3,
          contract,
          isWalletConnected: currentState.isWalletConnected,
          connectedAccount: currentState.connectedAccount,
        }));
      } catch (err) {
        console.error("Unable to initialize the read-only contract:", err);
      }
    };

    initializeReadOnlyContract();
  }, []);

  return (
    <>
      <div className="app-background" aria-hidden="true">
        <video
          className="app-background__video"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
        <div className="app-background__overlay" />
      </div>
      <Wallet
        saveState={saveState}
        state={state}
        theme={theme}
        onToggleTheme={() => setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"))}
      />
      <main className="app-main">
        <Hero state={state} />
        <Projects state={state} />
        <Skills />
        <Experience state={state} />
        <Certifications />
        <Contact state={state} />
      </main>
      <Handles />
      <Footer />
    </>
  );
}

export default App;
