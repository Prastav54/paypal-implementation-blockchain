import { useWeb3Contract } from "react-moralis";
import { useOutletContext } from "react-router-dom";

export const useAddName = (name) => {
  const { address, abi } = useOutletContext();
  const { runContractFunction: addName } = useWeb3Contract({
    abi: abi,
    contractAddress: address,
    functionName: "addName",
    params: { _name: name },
  });
  return { addName };
};
