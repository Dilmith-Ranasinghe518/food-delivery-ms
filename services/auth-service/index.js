const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4000;
const JWT_SECRET = "1000295fd6fb986102664798d1d5a87860c0d20cfa3913f313818234a0b1363b";

// Temporary in-memory user store
const users = [];

/* Health check */
app.get("/health", (req, res) => {
  res.json({ status: "Auth service running" });
});

/* Register */
app.post("/auth/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields required" });
  }

  if (users.find(u => u.email === email)) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hash = await bcrypt.hash(password, 10);
  const user = {
    id: Date.now().toString(),
    name,
    email,
    password: hash,
    role
  };

  users.push(user);

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ message: "Registered", token });
});

/* Login */
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ message: "Logged in", token });
});

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
