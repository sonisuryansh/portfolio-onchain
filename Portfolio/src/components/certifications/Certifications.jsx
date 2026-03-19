import { useEffect, useRef, useState } from "react";
import "./Certifications.css";

const certificateSeeds = [
  {
    id: "019d033d-74dd-7267-957d-0151f868ab32",
    title: "JPMorganChase - Software Engineering Job Simulation",
    issuer: "Forage",
    cid: "bafkreigsqkllkdjj5eymwfwxz6aoopzq34f73p74odhglhg7qk7jvxvksu",
  },
  {
    id: "019d033d-d7fe-76df-a46f-845d4187a749",
    title: "Blockchain Fundamentals",
    issuer: "101 Blockchains",
    cid: "bafkreic5vg6vwi3bunzpe25v2tmtmlzir42ollduo5eymadvujeqs4rw5e",
  },
  {
    id: "019d033e-61fa-7635-8cfd-3750b0b1abc2",
    title: "Docker Essentials: A Developer Introduction",
    issuer: "IBM",
    cid: "bafkreicdekgfvo4kj5v5akyh7xtvwx4yw7em7l3s36uwiynax4owc2tl3y",
  },
  {
    id: "019d033e-ebed-7d1e-a229-5844ca3c0f1d",
    title: "Blockchain (Beginner + Advanced)",
    issuer: "Code Eater",
    cid: "bafkreigtcunnbh27o3fxdx3f5paqd3x4s56dluz6anzhc3kaven2w2lcem",
  },
  {
    id: "019d033f-65c1-7d12-8476-822918263353",
    title: "Smart Designing with Generative AI",
    issuer: "Babu Banarasi Das (BBD) University",
    cid: "bafybeigzelbda4agl4bdwszz6gbny4yup2rlkemw6ocljzotb4443bvbce",
  },
  {
    id: "019d033f-dcbe-7413-b524-dd0775e2243f",
    title: "Building IoT Apps with Watson, Node-RED, and Swift",
    issuer: "IBM",
    cid: "bafybeiatmczyowdjks4hcval2hgdnzlixhlhg5nrftfy2nh6nl67e7swnq",
  },
];

const rotateCertificates = (items) => {
  if (items.length <= 1) return items;
  return [...items.slice(1), items[0]];
};

const Certifications = () => {
  const [certificates, setCertificates] = useState(certificateSeeds);
  const [isShuffling, setIsShuffling] = useState(false);
  const shuffleIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (shuffleIntervalRef.current) {
        window.clearInterval(shuffleIntervalRef.current);
      }
    };
  }, []);

  const startShuffle = () => {
    if (shuffleIntervalRef.current) return;

    setIsShuffling(true);
    shuffleIntervalRef.current = window.setInterval(() => {
      setCertificates((current) => rotateCertificates(current));
    }, 760);
  };

  const stopShuffle = () => {
    if (shuffleIntervalRef.current) {
      window.clearInterval(shuffleIntervalRef.current);
      shuffleIntervalRef.current = null;
    }

    setIsShuffling(false);
  };

  const activeCertificate = certificates[0];

  return (
    <section className="certifications-section" id="certifications">
      <div className="certifications-shell">
        <div className="certifications-heading">
          <p className="certifications-kicker">Credentials</p>
          <h2 className="title">Certification Gallery</h2>
          <p className="certifications-copy">
            The certificates are arranged like a stacked deck. Hover over the pile to shuffle
            them and bring different certifications to the front.
          </p>
        </div>

        <div className="certifications-layout">
          <div
            className={`certificate-stack ${isShuffling ? "certificate-stack--shuffling" : ""}`}
            onMouseEnter={startShuffle}
            onMouseLeave={stopShuffle}
          >
            {certificates.map((certificate, index) => {
              const hasRealCid = !certificate.cid.startsWith("PASTE_YOUR_CERTIFICATE_CID_");
              const imageUrl = hasRealCid
                ? `https://gateway.pinata.cloud/ipfs/${certificate.cid}`
                : "";
              const visibleIndex = Math.min(index, 4);

              return (
                <article
                  key={certificate.id}
                  className={`certificate-card certificate-card--stack-${visibleIndex}`}
                  style={{ zIndex: certificates.length - index }}
                >
                  <div className="certificate-card__frame">
                    {hasRealCid ? (
                      <img
                        className="certificate-card__image"
                        src={imageUrl}
                        alt={certificate.title}
                        loading="lazy"
                      />
                    ) : (
                      <div className="certificate-card__placeholder">
                        <span>Drop CID Here</span>
                      </div>
                    )}
                  </div>

                  <div className="certificate-card__body">
                    <p className="certificate-card__issuer">{certificate.issuer}</p>
                    <h3>{certificate.title}</h3>
                    <p className="certificate-card__meta">
                      {hasRealCid ? "Stored on IPFS" : certificate.cid}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="certificate-spotlight">
            <p className="certificate-spotlight__label">
              {isShuffling ? "Shuffling certificates..." : "Top certificate"}
            </p>
            <h3>{activeCertificate.title}</h3>
            <p className="certificate-spotlight__issuer">{activeCertificate.issuer}</p>
            <p className="certificate-spotlight__copy">
              Hover over the stack to cycle through the deck and bring a different certificate to
              the top.
            </p>
            <p className="certificate-spotlight__meta">
              {activeCertificate.cid.startsWith("PASTE_YOUR_CERTIFICATE_CID_")
                ? activeCertificate.cid
                : "Loaded from IPFS"}
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Certifications;
