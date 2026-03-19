// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

//0x02D5797D9775f1F0227a22a6e85707bb421D4CdC
contract Portfolio {

    // -------- Structs --------
    struct Project {
        uint id;
        string name;
        string description;
        string image;
        string githubLink;
    }

    struct Education {
        uint id;
        string date;
        string degree;
        string knowledgeAcquired;
        string institutionName;
    }

    // -------- Storage --------
    Project[] public projects;
    Education[] public educationDetails;

    string public imageLink = "bafybeicv62ctttvsmi5sx446fjbsgsitn3iadbwq3lmi3m2hulbhzb5jaq";
    string public description = "I am a software engineer focused on building efficient, scalable, and user-friendly applications. I specialize in modern web technologies and enjoy turning complex problems into simple, practical solutions.";
    string public resumeLink = "bafybeih3iydz23yzu5vkd7qcot5uryuzywqp67toswqrv5skn63ggtgde4";

    address public manager;

    // -------- Events --------
    event ProjectAdded(uint id, string name);
    event ProjectUpdated(uint id);
    event EducationAdded(uint id);
    event EducationUpdated(uint id);
    event Donation(address indexed donor, uint amount);

    constructor() {
        manager = msg.sender;
    }

    // -------- Modifiers --------
    modifier onlyManager() {
        require(msg.sender == manager, "Not manager");
        _;
    }

    // -------- Education --------
    function insertEducation(
        string calldata _date,
        string calldata _degree,
        string calldata _knowledgeAcquired,
        string calldata _institutionName
    ) external onlyManager {

        uint id = educationDetails.length;

        educationDetails.push(Education(
            id,
            _date,
            _degree,
            _knowledgeAcquired,
            _institutionName
        ));

        emit EducationAdded(id);
    }

    function changeEducation(
        uint _id,
        string calldata _date,
        string calldata _degree,
        string calldata _knowledgeAcquired,
        string calldata _institutionName
    ) external onlyManager {

        require(_id < educationDetails.length, "Invalid ID");

        Education storage e = educationDetails[_id];
        e.date = _date;
        e.degree = _degree;
        e.knowledgeAcquired = _knowledgeAcquired;
        e.institutionName = _institutionName;

        emit EducationUpdated(_id);
    }

    // -------- Projects --------
    function insertProject(
        string calldata _name,
        string calldata _description,
        string calldata _image,
        string calldata _githubLink    
    ) external onlyManager {

        uint id = projects.length;

        projects.push(Project(
            id,
            _name,
            _description,
            _image,
            _githubLink
        ));

        emit ProjectAdded(id, _name);
    }
    
    function changeProject(
        uint _id,
        string calldata _name,
        string calldata _description, 
        string calldata _image,
        string calldata _githubLink
    ) external onlyManager {

        require(_id < projects.length, "Invalid ID");

        Project storage p = projects[_id];
        p.name = _name;
        p.description = _description;
        p.image = _image;
        p.githubLink = _githubLink;

        emit ProjectUpdated(_id);
    }

    function getAllProjects() external view returns (Project[] memory) {
        return projects;
    }

    function getAllEducation() external view returns (Education[] memory) {
        return educationDetails;
    }

    // -------- Profile --------
    function changeDescription(string calldata _description) external onlyManager {
        description = _description;
    }

    function changeResumeLink(string calldata _resumeLink) external onlyManager {
        resumeLink = _resumeLink;
    }

    function changeImageLink(string calldata _imageLink) external onlyManager {
        imageLink = _imageLink;
    }

    // -------- Donate --------
    function donate() external payable {
        require(msg.value > 0, "Send ETH");
        emit Donation(msg.sender, msg.value);
    }

    function getBalance() external view returns(uint) {
        return address(this).balance;
    }

    function withdraw() external onlyManager {
        (bool success, ) = payable(manager).call{value: address(this).balance}("");
        require(success, "Transfer failed");
    }
}