const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: { type: Number, default: 3 },
  reps: { type: Number, default: 10 },
  holdTime: { type: Number, default: 30 },
});

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  exercises: [exerciseSchema],
});

const workoutSchema = new mongoose.Schema({
  bodyPartCategories: [categorySchema],
});

module.exports = mongoose.model("Exehrcise", workoutSchema);
