import { useWeb3Contract } from "react-moralis";
import { useOutletContext } from "react-router-dom";

export const useGetCollectedAmount = () => {
  const { address, abi } = useOutletContext();
  const { runContractFunction: getCollectedAmount } = useWeb3Contract({
    abi: abi,
    contractAddress: address,
    functionName: "getCollectedAmount",
    params: {},
  });
  return { getCollectedAmount };
};
