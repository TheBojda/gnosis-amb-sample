// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

interface IAMB {
    function messageSender() external view returns (address);
}

contract MessageReceiver {
    IAMB public amb;
    address public trustedSender; // Address of the MessageSender contract on Ethereum

    event MessageReceived(string message);

    constructor(address _amb, address _trustedSender) {
        amb = IAMB(_amb);
        trustedSender = _trustedSender;
    }

    function receiveMessage(string memory _message) public {
        require(msg.sender == address(amb), "Caller is not the AMB");
        require(amb.messageSender() == trustedSender, "Invalid message sender");

        emit MessageReceived(_message);

        // Implement additional logic to process the received message
    }
}
