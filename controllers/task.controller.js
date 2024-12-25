const Task = require("../models/Schema");

// Helper function for handling errors
const handleError = (
  res,
  error,
  message = "An error occurred",
  statusCode = 500
) => {
  console.error(error);
  return res
    .status(statusCode)
    .json({ success: false, message, error: error.message || error });
};

// Get all tasks
const getAllTasks = async (req, res) => {
  try {
    const allTasks = await Task.find();
    res.status(200).json({ success: true, data: allTasks });
  } catch (error) {
    handleError(res, error, "Failed to fetch tasks");
  }
};

// Get a single task by ID
const getTask = async (req, res) => {
  const taskId = req.params.id;
  if (!taskId) {
    return res
      .status(400)
      .json({ success: false, message: "Task ID is required" });
  }
  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    handleError(res, error, "Failed to fetch the task");
  }
};

// Create a new task
const createTask = async (req, res) => {
  const { task } = req.body;

  // Validate request body
  if (!task || task.trim().length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Task field is required" });
  }

  try {
    const newTask = await Task.create({ task });
    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: newTask,
    });
  } catch (error) {
    handleError(res, error, "Failed to create the task");
  }
};

// Delete a task by ID
const deleteTask = async (req, res) => {
  const taskId = req.params.id;
  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }
    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: deletedTask,
    });
  } catch (error) {
    handleError(res, error, "Failed to delete the task");
  }
};

// Update a task by ID
const updateTask = async (req, res) => {
  const taskId = req.params.id;
  const { task, completed } = req.body;

  // Validate request body
  if (!task && completed === undefined) {
    return res.status(400).json({
      success: false,
      message: "Either task or completed field must be provided",
    });
  }

  const updateData = {};
  if (task) updateData.task = task;
  if (completed !== undefined) updateData.completed = completed;

  try {
    const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    handleError(res, error, "Failed to update the task");
  }
};

module.exports = { getAllTasks, getTask, createTask, deleteTask, updateTask };
