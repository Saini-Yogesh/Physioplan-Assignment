const express = require("express");
const router = express.Router();
const WeeklyPlan = require("../models/WeeklyPlan");

const initialWeek = [
  { day: "Sunday", exercises: [], frequencyInDay: 1, notes: "" },
  { day: "Monday", exercises: [], frequencyInDay: 1, notes: "" },
  { day: "Tuesday", exercises: [], frequencyInDay: 1, notes: "" },
  { day: "Wednesday", exercises: [], frequencyInDay: 1, notes: "" },
  { day: "Thursday", exercises: [], frequencyInDay: 1, notes: "" },
  { day: "Friday", exercises: [], frequencyInDay: 1, notes: "" },
  { day: "Saturday", exercises: [], frequencyInDay: 1, notes: "" },
];

// Add a previous collection of WeeklyPlan
router.get("/plans", async (req, res) => {
  try {
    // Check if any documents exist in the WeeklyPlan collection
    const existingPlans = await WeeklyPlan.countDocuments();

    // Only insert initialWeek data if no documents are found
    if (existingPlans === 0) {
      await WeeklyPlan.insertMany(initialWeek);
    }

    // Fetch and return all plans from the database
    const allPlans = await WeeklyPlan.find();
    return res.status(200).json(allPlans);
  } catch (error) {
    console.error("Error fetching plans:", error);
    res.status(500).json({ message: "Error fetching plans", error });
  }
});

// Get a plan for a specific day
router.get("/plan/:day", async (req, res) => {
  const { day } = req.params;
  try {
    const plan = await WeeklyPlan.findOne({ day });
    if (plan) {
      res.status(200).json(plan);
    } else {
      res.status(404).json({ message: `No plan found for ${day}` });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching the plan", error });
  }
});

// Create or update a plan for a specific day
router.post("/plan/:day", async (req, res) => {
  const { day } = req.params;
  const { exercises, frequencyInDay, notes } = req.body;

  try {
    const updatedPlan = await WeeklyPlan.findOneAndUpdate(
      { day },
      {
        $set: {
          exercises,
          frequencyInDay,
          notes,
        },
      },
      { new: true, upsert: true }
    );
    res.status(200).json(updatedPlan);
  } catch (error) {
    res.status(500).json({ message: "Error updating the plan", error });
  }
});

// Clear all data for a specific day
router.put("/plan/:day/clear", async (req, res) => {
  const { day } = req.params;
  try {
    const clearedPlan = await WeeklyPlan.findOneAndUpdate(
      { day },
      {
        $set: {
          exercises: [],
          frequencyInDay: 1,
          notes: "",
        },
      },
      { new: true }
    );
    res.status(200).json(clearedPlan);
  } catch (error) {
    res.status(500).json({ message: "Error clearing the plan", error });
  }
});

module.exports = router;
