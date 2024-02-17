import { useMoralis } from "react-moralis";
import { useRoutes } from "react-router-dom";
import Addresses from "../constants/addresses.json";
import { ProtectedRoutes } from "./protected";
import { PublicRoutes } from "./public";

export const AppRoutes = () => {
  const { account, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const routingCondition =
    account && Object.keys(Addresses).includes(`${chainId}`);

  const routes = routingCondition ? ProtectedRoutes : PublicRoutes;

  const element = useRoutes([...routes]);

  return <>{element}</>;
};
