const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      require: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
