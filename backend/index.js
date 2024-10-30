const mongoose = require("mongoose");
const express = require("express");
const app = express();

// enables support for the Cross-Origin Resource Sharing
const cors = require("cors");
app.use(cors());

app.use(express.json());

// body Part Categories data
const bodyPartCategories = require("./bodyPartCategories");

// routes
const MenuDataRouter = require("./routes/menuData");
const weeklyPlanRouter = require("./routes/weeklyPlan");

// MongoDB URI
// const URI = "mongodb://localhost:27017/physioplan";
const URI = "mongodb+srv://yogesh:yogesh@cluster0.lej9v.mongodb.net/physioplan";

// Connect to MongoDB
(async () => {
  await mongoose
    .connect(URI)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error);
    });
})();

// Route to save/get workout/menuData data
app.get("/exercise", MenuDataRouter);

// Route to save/get/delete  daily workout data
app.use("/", weeklyPlanRouter); // Prefix your routes with /api

const port = 5000;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
});
