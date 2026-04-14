
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("./Models/db");

const app = express();
app.use(cors());
require("dotenv").config();

const PORT = process.env.PORT || 8080;
app.use(bodyParser.json());
app.use('/auth', require('./Routes/AuthRouter'));


app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


