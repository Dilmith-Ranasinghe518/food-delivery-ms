const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 6001;
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "f468468cb80df37d0de5096e8f130519e8d60296f1b56448de012db650de94c7";

// In-memory orders
const orders = [];

// Auth middleware (local JWT verify — stable method)
function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
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
  res.json({ status: "Order service running" });
});

/* Create order (CUSTOMER only) */
app.post("/orders", authMiddleware, (req, res) => {
  if (req.user.role !== "CUSTOMER") {
    return res.status(403).json({ message: "Only customers can order" });
  }

  const { restaurantId, items } = req.body;

  const order = {
    id: Date.now().toString(),
    customerId: req.user.id,
    restaurantId,
    items,
    status: "CREATED"
  };

  orders.push(order);
  res.json(order);
});

/* View orders */
app.get("/orders", authMiddleware, (req, res) => {
  res.json(orders);
});

app.listen(PORT, () => {
  console.log(`Order service running on port ${PORT}`);
});
