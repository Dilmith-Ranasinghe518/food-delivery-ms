import { useState } from "react";
import { authApi } from "../api/api";

export default function Register({ onSwitch }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER");

  const register = async () => {
    try {
      const res = await authApi.post("/auth/register", {
        name,
        email,
        password,
        role
      });

      localStorage.setItem("token", res.data.token);
      alert("Registration successful");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div>
      <h2>Register</h2>

      <input placeholder="Name" onChange={e => setName(e.target.value)} />
      <br />

      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <br />

      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
      />
      <br />

      <select onChange={e => setRole(e.target.value)}>
        <option value="CUSTOMER">Customer</option>
        <option value="ADMIN">Admin</option>
        <option value="DELIVERY_AGENT">Delivery Agent</option>
      </select>
      <br /><br />

      <button onClick={register}>Register</button>
      <br /><br />

      <button onClick={onSwitch}>Already have an account? Login</button>
    </div>
  );
}
