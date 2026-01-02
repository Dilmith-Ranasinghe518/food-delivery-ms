import Order from "./Order";
import PaymentPage from "./PaymentPage";


export default function Home({ onLogout }) {
  return (
    <div style={styles.container}>
      <h2>Customer Dashboard</h2>

      <div style={styles.paymentWrapper}>
        <PaymentPage />
      </div>

      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
  },
  paymentWrapper: {
    display: "flex",
    justifyContent: "center",
    marginTop: "30px",
  },
};
