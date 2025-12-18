import Order from "./Order";

export default function Home({ onLogout }) {
  return (
    <div>
      <h2>Customer Dashboard</h2>

      <Order />

      <br />
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}
