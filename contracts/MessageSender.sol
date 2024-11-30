// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

interface IAMB {
    function requireToPassMessage(
        address _contract,
        bytes calldata _data,
        uint256 _gas
    ) external returns (bytes32);
}

contract MessageSender {
    IAMB public amb;
    address public receiverContract; // Address of the contract on Gnosis Chain
    address public owner; // Address of the contract owner

    constructor(address _amb) {
        amb = IAMB(_amb);
        owner = msg.sender; // Set the contract deployer as the owner
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    function setReceiverContract(address _receiverContract) public onlyOwner {
        receiverContract = _receiverContract;
    }

    function sendMessage(string memory _message) public {
        require(receiverContract != address(0), "Receiver contract not set");
        bytes4 methodSelector = bytes4(keccak256("receiveMessage(string)"));
        bytes memory data = abi.encodeWithSelector(methodSelector, _message);
        uint256 gasLimit = 200000; // Adjust based on the complexity of receiveMessage on Gnosis Chain
        amb.requireToPassMessage(receiverContract, data, gasLimit);
    }
}
