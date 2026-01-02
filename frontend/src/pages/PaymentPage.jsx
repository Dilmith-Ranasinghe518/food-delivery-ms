import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const stripePromise = loadStripe("pk_test_51SkISpIj3tni1j19hpbyQYViz26VMhNeuQ7uyU8DAnwjWuWBmismnMLVghjURwkYMefhXpzHXHdk3dWa6HMJI5XA008bMEvST2");

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = React.useState("500.00");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    try {
      // 1. Create PaymentIntent on backend
      const res = await fetch("http://localhost:8001/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(amount) * 100, currency: "lkr" }), // Amount in cents
      });
      const data = await res.json();

      if (!data.clientSecret) {
        throw new Error("Failed to get client secret");
      }

      // 2. Confirm Card Payment
      const result = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (result.error) {
        toast.error(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        toast.success("✅ Payment Successful");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Something went wrong");
    }
  };

  return (
    <>
      <div style={styles.page}>
        <form onSubmit={handleSubmit} style={styles.card}>
          <h2 style={styles.title}>Secure Checkout</h2>
          <p style={styles.subtitle}>
            Complete your payment safely
          </p>

          <div style={styles.amountBox}>
            <span style={{ alignSelf: "center" }}>Total Amount (LKR)</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={styles.amountInput}
              placeholder="0.00"
            />
          </div>

          <div style={styles.cardInput}>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#32325d",
                    "::placeholder": {
                      color: "#a0aec0",
                    },
                  },
                  invalid: {
                    color: "#fa755a",
                  },
                },
              }}
            />
          </div>

          <button
            type="submit"
            disabled={!stripe}
            style={{
              ...styles.button,
              ...(!stripe ? styles.buttonDisabled : {}),
            }}
          >
            Pay Now
          </button>

          <p style={styles.secureText}>
            🔒 Secured by Stripe
          </p>
        </form>
      </div>

      <ToastContainer position="top-center" />
    </>
  );
}

export default function PaymentPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100vw",              // ✅ IMPORTANT

    background: "linear-gradient(135deg, #667eea, #764ba2)",
    display: "flex",              // ✅ REQUIRED
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#ffffff",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
    textAlign: "center",
    fontFamily: "Inter, Arial, sans-serif",
  },

  title: {
    marginBottom: "6px",
    fontSize: "24px",
    fontWeight: "600",
    color: "#2d3748",
  },

  subtitle: {
    marginBottom: "20px",
    fontSize: "14px",
    color: "#718096",
  },

  amountBox: {
    display: "flex",
    justifyContent: "space-between",
    background: "#f7fafc",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "15px",
    color: "#2d3748",
    alignItems: "center",
  },

  amountInput: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #cbd5e0",
    fontSize: "16px",
    fontWeight: "600",
    width: "120px",
    textAlign: "right",
    outline: "none",
  },

  cardInput: {
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "14px",
    marginBottom: "20px",
  },

  button: {
    width: "100%",
    padding: "14px",
    background: "#635bff",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },

  buttonDisabled: {
    background: "#b3b0ff",
    cursor: "not-allowed",
  },

  secureText: {
    marginTop: "14px",
    fontSize: "12px",
    color: "#a0aec0",
  },
};
