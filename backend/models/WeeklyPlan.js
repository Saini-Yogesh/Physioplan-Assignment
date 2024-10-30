const mongoose = require("mongoose");

const WeeklyPlanSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
  },
  exercises: [
    {
      exercise: { type: String, required: true },
      sets: { type: Number, default: 3 },
      reps: { type: Number, default: 10 },
      holdTime: { type: Number, default: 30 },
    },
  ],
  frequencyInDay: { type: Number, default: 1 },
  notes: String,
});

module.exports = mongoose.model("WeeklyPlan", WeeklyPlanSchema);
