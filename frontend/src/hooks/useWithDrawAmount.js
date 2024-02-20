import { useWeb3Contract } from "react-moralis";
import { useOutletContext } from "react-router-dom";

export function useWithdrawAmount() {
  const { address, abi } = useOutletContext();
  const { runContractFunction: withdrawAmount } = useWeb3Contract({
    abi: abi,
    contractAddress: address,
    functionName: "withdrawAmountReceived",
    params: {},
  });
  return { withdrawAmount };
}
