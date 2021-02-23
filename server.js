const express = require("express");
const mongojs = require("mongojs");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/workout",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }
);

// HTML Routes
// route to stats.html
app.get("/stats", function(req, res) {
  res.sendFile(path.join(__dirname, "public/stats.html"));
});

// route to exercise.html
app.get("/exercise", function(req, res) {
  res.sendFile(path.join(__dirname, "public/exercise.html"));
});

//API Routes
// Get last workout info on index.html
app.get("/api/workouts", (req, res) => {
  db.Workout.find({}, (error, data) => {
    if (error) {
      res.send(error);
    } else {
      res.json(data);
    }
  });
});

/*Below is a collection of my (sad) attempts to try to use 
$addFields and $sum... */
// app.get("/api/workouts", (req, res) => {
//   db.Workout.aggregate( [
//     {
//       $addFields: {
//         totalDuration: { $sum: "$exercises.duration"}
//       }
//     }
//   ]).sort({"_id": -1}).limit(1, (error, data) => {
//     console.log(data);
//     if (error) {
//       res.send(error);
//     } else {
//       res.json(data);
//     }
//   });
// });

// app.get("/api/workouts", (req, res) => {
//   db.Workout.aggregate([
//     { $match: { _id: req.params.query}},
//     { $addFields: {
//       totalDuration: { $sum: "$exercises.duration"}
//     }}
//   ], (error, data) => {
//     if (error) {
//       res.send(error);
//     } else {
//       console.log(data);
//       res.json(data);
//     }
//   });
// });

// app.get("/api/workouts", (req, res) => {
//   db.Workout.find({}).sort({"_id": -1}).limit(1).aggregate( [
//     {
//       $addFields: {
//         totalDuration: { $sum: "$exercises.duration"}
//       }
//     }
//   ], (error, data) => {
//     console.log(data);
//     if (error) {
//       res.send(error);
//     } else {
//       res.json(data);
//     }
//   });
// });

// Create new exercise/workout entry on exercise.html
app.post("/api/workouts", (req, res) => {
  db.Workout.create(req.body, (error, data) => {
    if (error) {
      res.send(error);
    } else {
      res.send(data);
    }
  });
});

// Add exercise to existing workout on /exercise.html
app.put("/api/workouts/:id", (req, res) => {
  db.Workout.updateOne(
    {
      _id: mongojs.ObjectId(req.params.id)
    },
    {
      $push: { 
        exercises: req.body
      }
    },
    (error, data) => {
      if (error) {
        res.send(error);
      } else {
        res.json(data);
      }
    }
  );
});

// View stats
app.get("/api/workouts/range", (req, res) => {
  db.Workout.find({}).limit(7)
  .then(dbWorkout => {
    res.json(dbWorkout);
  })
  .catch(err => {
    res.json(err);
  });
});

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
  });