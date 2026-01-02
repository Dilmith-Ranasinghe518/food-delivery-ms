import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Payment from "./pages/PaymentPage";

function App() {
  // const [page, setPage] = useState(
  //   localStorage.getItem("token") ? "home" : "login"
  // );

  // const logout = () => {
  //   localStorage.removeItem("token");
  //   setPage("login");
  // };

  const [page, setPage] = useState(
    localStorage.getItem("token") ? "payment" : "payment"
  );

  const logout = () => {
    localStorage.removeItem("token");
    setPage("payment");
  };

  if (page === "login") {
    return <Login onLogin={() => setPage("home")} onSwitch={() => setPage("register")} />;
  }

  if (page === "register") {
    return <Register onSwitch={() => setPage("login")} />;
  }
   if (page === "payment") {
    return <Payment onBack={() => setPage("payment")} />;
  }

  // return <Home onLogout={logout} />
  // ;
  // return <Home onLogout={logout} onPayment={() => setPage("payment")} />;
}

export default App;
