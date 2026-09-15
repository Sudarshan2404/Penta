import urlencoded = require("body-parser");
import bodyParser = require("body-parser");
import express from "express";
import dotenv from "dotenv";
import AuthRoutes from "./routes/auth.route.js";

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", AuthRoutes);

app.listen(port, () => {
  console.log(`server started on http:localhost:${port}`);
});
