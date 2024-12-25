const cors = require("cors");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
const mongoose = require("mongoose");
const connectDB = require("./db");
const router = require("./routes");
const path = require("path");
//DataBase connection
connectDB();

// Middlewares
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public"));
});
//routes
app.use("/api/task", router);

//when db not connected server cannot be run.
mongoose.connection.once("open", () => {
  app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
  });
});
