/* eslint-disable react-refresh/only-export-components */
import { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useMoralis } from "react-moralis";
import Abi from "../constants/abi.json";
import Addresses from "../constants/addresses.json";
import { lazyImport } from "../utils/apputils";

const { Dashboard } = lazyImport(
  () => import("../pages/dashboard"),
  "Dashboard"
);

const { History } = lazyImport(() => import("../pages/history"), "History");

const User = () => {
  const { chainId: chainIdHex, account } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const address = Addresses[chainId]?.[0] || "";
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <p>Loading... Please wait</p>
        </div>
      }
    >
      <Outlet context={{ address, chainId, account, abi: Abi }} />
    </Suspense>
  );
};

export const ProtectedRoutes = [
  {
    path: "",
    element: <User />,
    children: [
      { path: "", element: <Navigate to="/dashboard" /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "history", element: <History /> },
      { path: "/*", element: <Navigate to="." /> },
    ],
  },
];
