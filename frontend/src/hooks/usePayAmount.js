import { useWeb3Contract } from "react-moralis";
import { useOutletContext } from "react-router-dom";

export const usePayAmount = (amount, receiver) => {
  const { address, abi } = useOutletContext();
  const { runContractFunction: payAmount } = useWeb3Contract({
    abi: abi,
    contractAddress: address,
    functionName: "payRequest",
    msgValue: amount,
    params: {
      requestor: receiver,
    },
  });

  return { payAmount };
};
