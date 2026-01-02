require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 8001;
const JWT_SECRET =
  process.env.JWT_SECRET;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY; // Secret Key must be set in Environment Variables
if (!STRIPE_SECRET_KEY) {
  console.warn("⚠️  STRIPE_SECRET_KEY is missing. Payments will fail.");
}
const stripe = require("stripe")(STRIPE_SECRET_KEY);

// In-memory payments
const payments = [];

// Auth middleware
function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    // Allow public access for now for the frontend integration demo if no token passed, 
    // OR enforce it. user said "Integrate with frontend", frontend has no auth logic visible in PaymentPage yet
    // but the App.jsx has token check.
    // Let's assume we need auth, but for create-payment-intent often we just need amount.

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

/* Health */
app.get("/health", (req, res) => {
  res.json({ status: "Payment service running" });
});

/* Create Payment Intent (Stripe) */
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount || 1000, // Default 10.00
      currency: currency || "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* Webhook (Optional - for real updates) */
// app.post("/webhook", ...)

/* Process Payment (Legacy/Manual) */
app.post("/payments", authMiddleware, (req, res) => {
  const { orderId, amount, currency } = req.body;

  if (!orderId || !amount) {
    return res.status(400).json({ message: "Missing orderId or amount" });
  }

  const payment = {
    id: Date.now().toString(),
    userId: req.user.id,
    orderId,
    amount,
    currency: currency || "USD",
    status: "COMPLETED",
    timestamp: new Date().toISOString()
  };

  payments.push(payment);
  console.log(`Payment processed for Order ${orderId} by User ${req.user.id}`);
  res.json(payment);
});

/* View Payments (maybe restricted to admin in real life, but open for now for dev) */
app.get("/payments", authMiddleware, (req, res) => {
  // Optionally filter by user if not admin, but keeping simple
  // const userPayments = payments.filter(p => p.userId === req.user.id); 
  res.json(payments);
});

app.listen(PORT, () => {
  console.log(`Payment service running on port ${PORT}`);
});
