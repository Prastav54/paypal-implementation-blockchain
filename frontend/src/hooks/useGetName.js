import { useWeb3Contract } from "react-moralis";
import { useOutletContext } from "react-router-dom";

export const useGetName = () => {
  const { address, abi } = useOutletContext();
  const { runContractFunction: getName } = useWeb3Contract({
    abi: abi,
    contractAddress: address,
    functionName: "getName",
    params: {},
  });
  return { getName };
};
