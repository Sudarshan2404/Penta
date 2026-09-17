import "dotenv/config";

import express from "express";
import dotenv from "dotenv";
import AuthRoutes from "./routes/auth.route.js";
import TransactionRoutes from "./routes/transactions.route.js";
import HealthRoutes from "./routes/health.route.js";
import { connectDB } from "./config/db.config.js";
import bodyParser from "body-parser";

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", frontendUrl);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  );

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
});

app.use("/api/auth", AuthRoutes);
app.use("/api/transactions", TransactionRoutes);
app.use("/api", HealthRoutes);

app.listen(port, () => {
  console.log(`server started on http://localhost:${port}`);
  void connectDB();
});
