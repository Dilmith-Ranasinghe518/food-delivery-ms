const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config({ path: "../../.env" });

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5001;

// Temporary in-memory data
const restaurants = [];
// { id, name, available, menus: [{ id, name, price }] }

// Middleware: verify JWT via Auth Service
async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token" });

    const token = authHeader.replace("Bearer ", "");

    // Call Auth Service (Kubernetes DNS name later)
    const AUTH_SERVICE_URL =
      process.env.AUTH_SERVICE_URL || "http://localhost:4000";

    const response = await axios.get(
      `${AUTH_SERVICE_URL}/auth/me`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );


    req.user = response.data;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

/* Health */
app.get("/health", (req, res) => {
  res.json({ status: "Restaurant service running" });
});

/* Add restaurant (ADMIN only) */
app.post("/restaurants", authMiddleware, (req, res) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Access denied" });
  }

  const { name } = req.body;
  const restaurant = {
    id: Date.now().toString(),
    name,
    available: true,
    menus: []
  };

  restaurants.push(restaurant);
  res.json(restaurant);
});

/* View restaurants (public) */
app.get("/restaurants", (req, res) => {
  res.json(restaurants);
});

/* Add menu item (RESTAURANT_ADMIN) */
app.post("/restaurants/:id/menu", authMiddleware, (req, res) => {
  if (req.user.role !== "RESTAURANT_ADMIN") {
    return res.status(403).json({ message: "Access denied" });
  }

  const restaurant = restaurants.find(r => r.id === req.params.id);
  if (!restaurant) return res.status(404).json({ message: "Not found" });

  const { name, price } = req.body;
  restaurant.menus.push({
    id: Date.now().toString(),
    name,
    price
  });

  res.json(restaurant);
});

app.listen(PORT, () => {
  console.log(`Restaurant service running on port ${PORT}`);
});
