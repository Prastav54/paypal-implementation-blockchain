import "./App.css";
import { AppProvider } from "./provider/AppProvider";
import { AppRoutes } from "./routes";

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
