import { ethers } from "hardhat";

async function main() {
  // Deploy MessageSender on Sepolia
  const sepoliaProvider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const sepoliaWallet = new ethers.Wallet(process.env.PRIVATE_KEY || "", sepoliaProvider);

  const MessageSender = await ethers.getContractFactory("MessageSender", sepoliaWallet);
  const sender = await MessageSender.deploy("0xf2546D6648BD2af6a008A7e7C1542BB240329E11");
  await sender.deployed();
  console.log(`MessageSender deployed to Sepolia at: ${sender.address}`);

  // Deploy MessageReceiver on Chiado
  const chiadoProvider = new ethers.providers.JsonRpcProvider(process.env.CHIADO_RPC_URL);
  const chiadoWallet = new ethers.Wallet(process.env.PRIVATE_KEY || "", chiadoProvider);

  const MessageReceiver = await ethers.getContractFactory("MessageReceiver", chiadoWallet);
  const receiver = await MessageReceiver.deploy("0x8448E15d0e706C0298dECA99F0b4744030e59d7d", sender.address);
  await receiver.deployed();
  console.log(`MessageReceiver deployed to Chiado at: ${receiver.address}`);

  // Update MessageSender with the receiver's address
  const tx = await sender.setReceiverContract(receiver.address);
  await tx.wait();
  console.log(`MessageSender's receiver contract set to: ${receiver.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
