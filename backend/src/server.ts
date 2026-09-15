import urlencoded = require("body-parser");
import bodyParser = require("body-parser");
import express from "express";

const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`server started on http:localhost:${port}`);
});
