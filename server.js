const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/admin", require("./routes/admin"));
app.use("/", require("./routes/order"));

app.get("/", (req, res) => {
  res.send("Welcome to the order system API");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});