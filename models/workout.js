const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WorkoutSchema = new Schema({
  day: { 
      type: Date,
      default: Date.now
    },
  exercises: [
    {
      type: {
        type: String,
        required: "Exercise Type is required"
      },
      name: {
        type: String,
        trim: true,
        required: "Exercise Name is required"
      },
      duration: {
        type: Number,
      },
      weight: {
        type: Number,
      },
      reps: {
        type: Number,
      },
      sets: {
        type: Number
      },
      distance: {
        type: Number
      }
    }
  ]
});

// WorkoutSchema.methods.durationTotals = function() {
//   this.totalDuration = 0;
//   for (var i =0; i < this.exercises.length; i++) {
//     this.totalDuration = this.exercises[i].duration + this.totalDuration;
//   }
//   return this.totalDuration;
// };

const Workout = mongoose.model("Workout", WorkoutSchema);

module.exports = Workout;