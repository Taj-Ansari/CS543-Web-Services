const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const app = express();
app.use(express.json());
app.use(express.static("public"));

const SECRET = "dev-secret-change-me";
const users = [
  {
    id: 1,
    email: "asha@campus.edu",
    role: "customer",
    hash: bcrypt.hashSync("customer123", 10),
  },
  {
    id: 2,
    email: "mealhub@campus.edu",
    role: "restaurant",
    hash: bcrypt.hashSync("resto123", 10),
  },
];
let items = [
  { id: 1, name: "Veg Thali", price: 90 },
  { id: 2, name: "Paneer Roll", price: 70 },
];
let nextId = 3;
app.post("/login", (req, res) => {
  const user = users.find((u) => u.email === req.body.email);
  if (!user || !bcrypt.compareSync(req.body.password, user.hash))
    return res.status(401).json({ error: "bad login" });
  const token = jwt.sign({ sub: user.id, role: user.role }, SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
});
function auth(req, res, next) {
  const token = (req.get("Authorization") || "").split(" ")[1];
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: "invalid or missing token" });
  }
}
function requireRole(...allowed) {
  return (req, res, next) =>
    allowed.includes(req.user.role)
      ? next()
      : res.status(403).json({ error: "forbidden" });
}
app.get("/items", auth, (req, res) => res.json(items));
app.post("/items", auth, requireRole("restaurant", "admin"), (req, res) => {
  const { name, price } = req.body;
  if (!name) return res.status(422).json({ error: "name required" });
  const item = { id: nextId++, name, price: Number(price) || 0 };
  items.push(item);
  res.status(201).json(item);
});
app.listen(3000, () =>
  console.log("Secured Catalogue on http://localhost:3000"),
);
