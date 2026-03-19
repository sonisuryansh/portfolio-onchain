import {useState,useEffect} from "react";
import './Experience.css'
import { SlCalender } from "react-icons/sl"


const Experience = ({state}) => {
    const [education,setEducation]=useState([]);
    const [loadError, setLoadError] = useState("");

    useEffect(()=>{
        const contract = state?.contract;
        if (!contract) {
            setEducation([]);
            setLoadError("");
            return;
        }

        const educationDetails=async()=>{
            try {
                const education = await contract.methods.getAllEducation().call();
                setEducation(education || []);
                setLoadError("");
            } catch (err) {
                console.error(err);
                setEducation([]);
                setLoadError("Unable to load education cards from the connected contract.");
            }
        }
        educationDetails();
    },[state?.contract])
    return (
        <section className="exp-section" id="experience">
            <h1 className="title">Experience & Education</h1>

            <div className="exp-container">

                <div className="education">
                    <h1 className="edu-title">Education</h1>
                    {education &&
                        education.map((edu) => {
                            return (
                                <div
                                    key={`${edu.date}-${edu.degree}`}
                                    className="edu-card"
                                >
                                    <p className="card-text1">
                                        <SlCalender className="icon" /> {edu.date}
                                    </p>
                                    <h3 className="card-text2">{edu.degree}</h3>
                                    <p className="card-text3">{edu.knowledgeAcquired}</p>
                                    <p className="card-text4">{edu.institutionName}</p>
                                </div>
                            );
                        })}

                    {!state?.contract && (
                        <p className="section-status">Connect your wallet to load education cards from the contract.</p>
                    )}

                    {state?.contract && loadError && (
                        <p className="section-status">{loadError}</p>
                    )}

                    {state?.contract && !loadError && education.length === 0 && (
                        <p className="section-status">No education cards were returned by this contract yet.</p>
                    )}

                </div>
                {/* experience */}
                <div className="education">
                    <h1 className="edu-title">Experience</h1>
                    <div className="edu-card">
                        <p className="card-text1">
                            <SlCalender className="icon" /> September 2025
                        </p>
                        <h3 className="card-text2">Blockchain & Web3 Engineer</h3>
                        <p className="card-text3">
                             Handled Web3 integration along with backend logic and API workflows, while developing and deploying ERC-20 smart contracts using Solidity with MetaMask and Ethers.js integration.
                        </p>
                        <p className="card-text4">Suryansh Soni</p>
                    </div>
                    <div className="edu-card">
                        <p className="card-text1">
                            <SlCalender className="icon" /> September 2024 - August 2025
                        </p>
                        <h3 className="card-text2">Aaina Technical Member</h3>
                        <p className="card-text3">
                            Worked as a Technical Member at Aaina, the central forum of the university, for one year—contributing to technical initiatives and actively managing multiple events.
                        </p>
                        <p className="card-text4">Suryansh Soni</p>
                    </div>
                    <div className="edu-card">
                        <p className="card-text1">
                            <SlCalender className="icon" /> December 2023 - February 2024
                        </p>
                        <h3 className="card-text2">Java Intern</h3>
                        <p className="card-text3">
                           Worked at HCLTech from December 2023 to February 2024 as a Java Developer, contributing to development tasks and gaining hands-on experience in backend programming.
                        </p>
                        <p className="card-text4">Suryansh Soni</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Experience
