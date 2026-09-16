import { useEffect, useState } from "react";
import Login from "./pages/login";
import Register from "./pages/register";

function App() {
  const [path, setPath] = useState(window.location.hash);

  useEffect(() => {
    const updatePath = () => setPath(window.location.hash);
    window.addEventListener("hashchange", updatePath);
    return () => window.removeEventListener("hashchange", updatePath);
  }, []);

  return path === "#signup" ? <Register /> : <Login />;
}

export default App;
