import { useState } from "react";
import { authApi } from "../api/api";

export default function Login({ onLogin, onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await authApi.post("/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);
      onLogin();
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <br />

      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={login}>Login</button>
      <br /><br />

      <button onClick={onSwitch}>Create new account</button>
    </div>
  );
}
