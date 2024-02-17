import { Navigate } from "react-router-dom";
import { lazyImport } from "../utils/apputils";

const { NoticePage } = lazyImport(
  () => import("../pages/notice"),
  "NoticePage"
);

export const PublicRoutes = [
  { path: "", element: <Navigate to="/notice" /> },
  { path: "notice", element: <NoticePage /> },
  { path: "/*", element: <Navigate to="." /> },
];
