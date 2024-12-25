const {
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getAllTasks,
} = require("./task.controller");

module.exports = { getTask, createTask, updateTask, deleteTask, getAllTasks };
