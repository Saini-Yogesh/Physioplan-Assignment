import React, { useEffect, useState } from "react";
import "./exerciseAssignment.css";

const initialWeek = [
  { day: "Sunday", exercises: [], frequency: 1, note: "" },
  { day: "Monday", exercises: [], frequency: 1, note: "" },
  { day: "Tuesday", exercises: [], frequency: 1, note: "" },
  { day: "Wednesday", exercises: [], frequency: 1, note: "" },
  { day: "Thursday", exercises: [], frequency: 1, note: "" },
  { day: "Friday", exercises: [], frequency: 1, note: "" },
  { day: "Saturday", exercises: [], frequency: 1, note: "" },
];

const Dropdown = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [bodyPartCategories, setBodyPartCategories] = useState({});
  const [weekData, setWeekData] = useState(initialWeek);
  const [selectedDayIndex, setSelectedDayIndex] = useState(1); // Default to Monday
  const [dayExercises, setDayExercises] = useState([]);
  const [frequency, setFrequency] = useState(1);
  const [note, setNote] = useState("");

  // Fetch workout categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        let response = await fetch("http://localhost:5000/exercise");
        let data = await response.json();
        if (data.success) {
          const categories = data.result.bodyPartCategories.reduce(
            (acc, category) => {
              acc[category.name] = category.exercises;
              return acc;
            },
            {}
          );
          setBodyPartCategories(categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch data for Monday by default on initial load
  useEffect(() => {
    fetchDayData("Monday");
  }, []);

  // Fetch exercises for selected day
  const fetchDayData = async (day) => {
    try {
      let response = await fetch(`http://localhost:5000/plan/${day}`);
      let data = await response.json();
      if (response.ok) {
        setDayExercises(data.exercises);
        setFrequency(data.frequencyInDay);
        setNote(data.notes);
      }
    } catch (error) {
      console.error(`Error fetching data for ${day}:`, error);
    }
  };

  // Update UI and fetch data when a new day is selected
  const handleDaySelect = (index) => {
    setSelectedDayIndex(index);
    fetchDayData(weekData[index].day);
  };

  // Handle adding exercises
  const handleExerciseClick = (exercise) => {
    setDayExercises((prevExercises) => [
      ...prevExercises,
      {
        exercise: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        holdTime: exercise.holdTime,
        side: "Left",
      },
    ]);
  };

  // Handle deletinng exercises
  const handleDeleteExercise = (index) => {
    setDayExercises((prevExercises) =>
      prevExercises.filter((_, i) => i !== index)
    );
  };

  // Handles duplication of an exercise at a specific index
  const handleDuplicateExercise = (index) => {
    setDayExercises((prevExercises) => {
      const exerciseToDuplicate = prevExercises[index]; // Exercise to duplicate

      // Check if the exercise above or below is the same
      const isAboveSame =
        index > 0 &&
        prevExercises[index - 1].exercise === exerciseToDuplicate.exercise;
      const isBelowSame =
        index < prevExercises.length - 1 &&
        prevExercises[index + 1].exercise === exerciseToDuplicate.exercise;

      // If already sandwiched by duplicates, return without change
      if (isAboveSame && isBelowSame) return prevExercises;

      // Determine insertion position: below if above is same, otherwise duplicate at current position
      const updatedExercises = [...prevExercises];
      const position = isAboveSame ? index + 1 : index;
      updatedExercises.splice(position, 0, { ...exerciseToDuplicate }); // Insert duplicate

      return updatedExercises; // Return updated list with duplicate
    });
  };

  // Save exercises to backend for the selected day
  const handleSaveDay = async () => {
    const day = weekData[selectedDayIndex].day;
    try {
      let response = await fetch(`http://localhost:5000/plan/${day}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          exercises: dayExercises,
          frequencyInDay: frequency,
          notes: note,
        }),
      });
      if (response.ok) {
        setWeekData((prevData) =>
          prevData.map((d, index) =>
            index === selectedDayIndex
              ? { ...d, exercises: dayExercises, frequency, note }
              : d
          )
        );
      }
    } catch (error) {
      console.error(`Error saving data for ${day}:`, error);
    }
  };

  // Clear exercises for selected day both locally and on backend
  const handleClearDay = async () => {
    const day = weekData[selectedDayIndex].day;
    try {
      let response = await fetch(`http://localhost:5000/plan/${day}/clear`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        setDayExercises([]);
        setFrequency(1);
        setNote("");
      }
    } catch (error) {
      console.error(`Error clearing data for ${day}:`, error);
    }
  };

  return (
    <div className="navbar-container">
      <p className="heading">Physioplan Assignment</p>
      {/* body part categories */}
      <div className="navbar">
        {Object.keys(bodyPartCategories).map((category) => (
          <div
            key={category}
            className="navbar-item"
            onMouseEnter={() => setHoveredCategory(category)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            {category}
            {hoveredCategory === category && (
              <ul className="submenu">
                {bodyPartCategories[category].map((exercise) => (
                  <li
                    key={exercise._id}
                    className="submenu-item"
                    onClick={() => handleExerciseClick(exercise)}
                  >
                    {exercise.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* all days in th form of small circle */}
      <div className="selected-exercises">
        <div className="days">
          {weekData.map((day, index) => (
            <button
              key={day.day}
              className={index === selectedDayIndex ? "current-day" : ""}
              onClick={() => handleDaySelect(index)}
            >
              {day.day.charAt(0)}
            </button>
          ))}
        </div>

        {/* frequency and buttons */}
        <div className="frequency-buttons">
          <div className="frequency">
            <p>Daily frequency</p>
            <span>
              <button
                onClick={() => setFrequency((f) => Math.max(f - 1, 1))}
                disabled={frequency === 1}
              >
                -
              </button>{" "}
              {frequency}{" "}
              <button onClick={() => setFrequency(frequency + 1)}>+</button>
            </span>
          </div>
          <div className="bottom-buttons">
            <button className="save" onClick={handleSaveDay}>
              Save
            </button>
            <button className="clear-all" onClick={handleClearDay}>
              Clear All
            </button>
          </div>
        </div>

        {/* list of exercises */}
        <h3 className="exercises-programme-heading">Exercises Programme</h3>
        <div className="exercises-container">
          {dayExercises.map((item, index) => (
            <div className="exercise-item" key={index}>
              <div className="item-exercise-name-and-button">
                <p>{item.exercise}</p>
                <div>
                  <button
                    className="duplicate"
                    onClick={() => handleDuplicateExercise(index)}
                  >
                    <i className="fa-regular fa-clone"></i> Duplicate
                  </button>
                  <i
                    className="fa-solid fa-trash-can delete"
                    onClick={() => handleDeleteExercise(index)}
                  ></i>
                </div>
              </div>
              <div className="exercise-details">
                <p className="sets">Sets: {item.sets}</p>
                <p className="reps">Reps: {item.reps}</p>
                <p className="hold-time">Hold Time: {item.holdTime} seconds</p>
              </div>
            </div>
          ))}
        </div>

        {/* Therapist Notes  */}
        <h2 style={{ marginTop: "2vmin", fontSize: "3vmin" }}>
          Therapist Notes -
        </h2>
        <textarea
          className="userNote"
          placeholder="Add Notes..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Dropdown;
