import { ethers } from "ethers";
import * as dotenv from "dotenv";
import MessageSenderABI from "../artifacts/contracts/MessageSender.sol/MessageSender.json";
import MessageReceiverABI from "../artifacts/contracts/MessageReceiver.sol/MessageReceiver.json";

dotenv.config();

async function main() {
  // Replace with your deployed contract addresses
  const messageSenderAddress = process.env.SENDER_CONTRACT as string;
  const messageReceiverAddress = process.env.RECEIVER_CONTRACT as string;

  // Connect to the Sepolia network
  const sepoliaProvider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const sepoliaWallet = new ethers.Wallet(process.env.PRIVATE_KEY || "", sepoliaProvider);

  // Connect to the deployed MessageSender contract
  const messageSender = new ethers.Contract(
    messageSenderAddress,
    MessageSenderABI.abi,
    sepoliaWallet
  );

  // Send a message
  const message = "Hello, Gnosis Chain!";
  const tx = await messageSender.sendMessage(message);
  await tx.wait();
  console.log(`Message sent: ${message}`);

  // Connect to the Chiado network
  const chiadoProvider = new ethers.providers.JsonRpcProvider(process.env.CHIADO_RPC_URL);

  // Connect to the deployed MessageReceiver contract
  const messageReceiver = new ethers.Contract(
    messageReceiverAddress,
    MessageReceiverABI.abi,
    chiadoProvider
  );

  // Listen for the MessageReceived event
  messageReceiver.once("MessageReceived", (receivedMessage: string) => {
    console.log(`Message received on Chiado: ${receivedMessage}`);
  });

  console.log("Waiting for the message to be received on Chiado...");

  // Keep the script running to listen for the event
  await new Promise((resolve) => setTimeout(resolve, 60000 * 20)); // Wait for 20 mins
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
