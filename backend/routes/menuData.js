const express = require("express");
const router = express.Router();
const Exercises = require("../models/Exercise");
const bodyPartCategories = require("../bodyPartCategories");

router.get("/exercise", async (req, res) => {
  try {
    // Check if bodyPartCategories already exists in the collection
    let data = await Exercises.findOne();

    // If no exists, create and save new data
    if (!data) {
      data = new Exercises({ bodyPartCategories });
      await data.save();
    }

    // Send the found or newly created data as a response
    res.send({ success: true, result: data });
  } catch (error) {
    console.error("Failed to retrieve data:", error);
    res.status(500).send({ success: false, result: "Failed to retrieve data" });
  }
});

module.exports = router;
