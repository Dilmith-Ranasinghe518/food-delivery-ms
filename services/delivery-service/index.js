const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 7001;
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "f468468cb80df37d0de5096e8f130519e8d60296f1b56448de012db650de94c7";

// In-memory deliveries
const deliveries = [];
// { id, orderId, address, status, agentId }

// Auth middleware (local JWT verify)
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
  res.json({ status: "Delivery service running" });
});

/* Create delivery (ADMIN only) */
app.post("/deliveries", authMiddleware, (req, res) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Only admin can create deliveries" });
  }

  const { orderId, address } = req.body;

  const delivery = {
    id: Date.now().toString(),
    orderId,
    address,
    status: "ASSIGNED",
    agentId: null
  };

  deliveries.push(delivery);
  res.json(delivery);
});

/* Update delivery status (DELIVERY_AGENT) */
app.put("/deliveries/:id/status", authMiddleware, (req, res) => {
  if (req.user.role !== "DELIVERY_AGENT") {
    return res.status(403).json({ message: "Only delivery agents allowed" });
  }

  const delivery = deliveries.find(d => d.id === req.params.id);
  if (!delivery) {
    return res.status(404).json({ message: "Delivery not found" });
  }

  const { status } = req.body;
  delivery.status = status;
  delivery.agentId = req.user.id;

  res.json(delivery);
});

/* View deliveries (ADMIN or CUSTOMER) */
app.get("/deliveries", authMiddleware, (req, res) => {
  if (!["ADMIN", "CUSTOMER"].includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied" });
  }

  res.json(deliveries);
});

app.listen(PORT, () => {
  console.log(`Delivery service running on port ${PORT}`);
});
