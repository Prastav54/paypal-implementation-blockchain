const { ethers, network } = require("hardhat");
const fs = require("fs");
const {
  FRONT_END_ADDRESS_FILE_LOCATION,
  FRONT_END_ABI_FILE_LOCATION,
} = require("../helper-hardhat-config");

module.exports = async function () {
  if (process.env.UPDATE_FRONT_END === "true") {
    console.log("Updating Front End........");
    await updateContractAddresses();
    await updateApi();
  }
};

async function updateApi() {
  const paypal = await ethers.getContract("Paypal");
  fs.writeFileSync(
    FRONT_END_ABI_FILE_LOCATION,
    paypal.interface.format(ethers.utils.FormatTypes.json)
  );
}

async function updateContractAddresses() {
  const paypal = await ethers.getContract("Paypal");
  const chainId = network.config.chainId.toString();
  const contractAddress = JSON.parse(
    fs.readFileSync(FRONT_END_ADDRESS_FILE_LOCATION, "utf-8")
  );
  if (chainId in contractAddress) {
    if (!contractAddress[chainId].includes(paypal.address)) {
      contractAddress[chainId].push(paypal.address);
    }
  } else {
    contractAddress[chainId] = [paypal.address];
  }
  fs.writeFileSync(
    FRONT_END_ADDRESS_FILE_LOCATION,
    JSON.stringify(contractAddress)
  );
}

module.exports.tags = ["all", "frontend"];