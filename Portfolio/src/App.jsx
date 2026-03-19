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
import "./index.css";

function App() {
  const BLOCKCHAIN_VIDEO_PUBLIC_PATH =
    import.meta.env.VITE_BACKGROUND_VIDEO_URL || "/videos/blockchain-bg.mp4";
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
  const [backgroundVideoSrc, setBackgroundVideoSrc] = useState(null);
  const [videoFallbackLoaded, setVideoFallbackLoaded] = useState(false);

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

  useEffect(() => {
    let timeoutId = null;
    let cancelled = false;

    const shouldLoadBackgroundVideo = () => {
      if (typeof window === "undefined") return false;
      if (window.innerWidth <= 768) return false;
      if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return false;

      const connection = navigator?.connection;
      if (connection?.saveData) return false;
      if (typeof connection?.effectiveType === "string" && /2g|3g/i.test(connection.effectiveType)) {
        return false;
      }

      return true;
    };

    const loadVideoAsset = async () => {
      if (!shouldLoadBackgroundVideo()) return;

      try {
        if (!cancelled) setBackgroundVideoSrc(BLOCKCHAIN_VIDEO_PUBLIC_PATH);
      } catch (err) {
        console.error("Unable to load background video:", err);
      }
    };

    const scheduleLoad = () => {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(() => {
          void loadVideoAsset();
        });
      } else {
        timeoutId = window.setTimeout(() => {
          void loadVideoAsset();
        }, 1400);
      }
    };

    if (document.readyState === "complete") {
      scheduleLoad();
    } else {
      window.addEventListener("load", scheduleLoad, { once: true });
    }

    return () => {
      cancelled = true;
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      window.removeEventListener("load", scheduleLoad);
    };
  }, [BLOCKCHAIN_VIDEO_PUBLIC_PATH]);

  const handleBackgroundVideoError = async () => {
    if (videoFallbackLoaded) return;

    try {
      const module = await import("./assets/skills/bg.mp4");
      setBackgroundVideoSrc(module.default);
      setVideoFallbackLoaded(true);
    } catch (err) {
      console.error("Unable to load fallback background video:", err);
    }
  };

  return (
    <>
      <div className="app-background" aria-hidden="true">
        {backgroundVideoSrc && (
          <video
            className="app-background__video"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            onError={handleBackgroundVideoError}
          >
            <source src={backgroundVideoSrc} type="video/mp4" />
          </video>
        )}
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
