const networkConfig = {
  31337: {
    name: "localhost",
  },
  11155111: {
    name: "sepolia",
  },
};

const developmentChains = ["hardhat", "localhost"];
const VERIFICATION_BLOCK_CONFIRMATIONS = 6;

const FRONT_END_ADDRESS_FILE_LOCATION =
  "../frontend/src/constants/addresses.json";
const FRONT_END_ABI_FILE_LOCATION = "../frontend/src/constants/abi.json";

module.exports = {
  networkConfig,
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
  FRONT_END_ABI_FILE_LOCATION,
  FRONT_END_ADDRESS_FILE_LOCATION
};