import { useOutletContext } from "react-router-dom";
import { useWeb3Contract } from "react-moralis";
import { ethers } from "ethers";

export const useCreateRequest = (payload = {}) => {
  const { address, abi } = useOutletContext();
  const { runContractFunction: createRequest } = useWeb3Contract({
    abi: abi,
    contractAddress: address,
    functionName: "createRequest",
    params: {
      user: payload.user,
      _amount: payload.amount
        ? ethers.utils.parseEther(`${payload.amount}`)
        : "",
      _message: payload.message,
    },
  });

  return { createRequest };
};
