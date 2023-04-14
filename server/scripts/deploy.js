// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

//return the balance of the given address
const getBalances = async (address) => {
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
};

//logs the ether balances for a list of addresses
const printBalance = async (addresses) => {
  let i = 0;
  for (const address of addresses) {
    console.log(
      `Addreses ${i} : ${address} balances `,
      await getBalances(address)
    );
    i++;
  }
};

//print the memos
const printMemos = async (memos) => {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(
      `At ${timestamp} ${tipper} from ${tipperAddress} said: ${message}`
    );
  }
};

async function main() {
  //Get example accounts
  const [owner, tipper1, tipper2, tipper3] = await hre.ethers.getSigners();
  //Get the contract to deploy & deploy
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.deployed();
  console.log("Contract address is ", buyMeACoffee.address);
  //check balnces before buying the coffee
  const addresses = [
    owner.address,
    tipper1.address,
    tipper2.address,
    tipper3.address,
    buyMeACoffee.address,
  ];
  console.log("Before Balances : ");
  await printBalance(addresses);
  //but the owner a few coffee
  const tip = { value: hre.ethers.utils.parseEther("2") };
  await buyMeACoffee
    .connect(tipper1)
    .buyMeACoffee("Sourav", "Have a nice day", tip);
  await buyMeACoffee
    .connect(tipper2)
    .buyMeACoffee("Sourav", "Have a nice day", tip);
  await buyMeACoffee
    .connect(tipper3)
    .buyMeACoffee("Sourav", "Have a nice day", tip);
  //check balances after coffee purchased
  console.log("After Balances : ");
  await printBalance(addresses);
  //withdraw funds
  await buyMeACoffee.connect(owner).withdrawTips();
  //check balnce after withdraw
  console.log("after withdraw Balances : ");
  await printBalance(addresses);
  //read all the memos
  console.log("All the memos : ");
  printMemos(await buyMeACoffee.connect(owner).getMemos());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
