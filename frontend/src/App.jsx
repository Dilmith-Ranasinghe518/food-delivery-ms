import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

function App() {
  const [page, setPage] = useState(
    localStorage.getItem("token") ? "home" : "login"
  );

  const logout = () => {
    localStorage.removeItem("token");
    setPage("login");
  };

  if (page === "login") {
    return <Login onLogin={() => setPage("home")} onSwitch={() => setPage("register")} />;
  }

  if (page === "register") {
    return <Register onSwitch={() => setPage("login")} />;
  }

  return <Home onLogout={logout} />;
}

export default App;
