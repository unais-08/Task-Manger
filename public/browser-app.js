const tasksDOM = document.querySelector(".tasks");
const loadingDOM = document.querySelector(".loading-text");
const formDOM = document.querySelector(".task-form");
const taskInputDOM = document.querySelector(".task-input");
const formAlertDOM = document.querySelector(".form-alert");
// Load tasks from /api/tasks
const url = "http://localhost:8000/api/task";

// get all tasks /api/task
const showTasks = async () => {
  loadingDOM.style.visibility = "visible"; // Show loading spinner
  try {
    // Fetch tasks using fetch
    const response = await fetch(`${url}`);
    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }

    const apiData = await response.json(); // Parse the JSON response
  
    // Check if no tasks are available
    if (!apiData.data || apiData.data < 1) {
      tasksDOM.innerHTML = '<h5 class="empty-list">No tasks in your list</h5>';
      loadingDOM.style.visibility = "hidden"; // Hide loading spinner
      return;
    }

    // Map through the tasks and generate HTML
    const allTasks = apiData.data
      .map((tasks) => {
        
        const { completed, _id: taskID, task } = tasks; // Destructure task properties
        return `<div class="single-task ${completed ? "task-completed" : ""}">
<h5><span><i class="far fa-check-circle"></i></span>${task}</h5>
<div class="task-links">
  <!-- edit link -->
  <a href="task.html?id=${taskID}" class="edit-link">
    <i class="fas fa-edit"></i>
  </a>
  <!-- delete button -->
  <button type="button" class="delete-btn" data-id="${taskID}">
    <i class="fas fa-trash"></i>
  </button>
</div>
</div>`;
      })
      .join(""); // Join the task HTML into a single string

    tasksDOM.innerHTML = allTasks; // Inject the tasks into the DOM
  } catch (error) {
    console.error("Error fetching tasks:", error);
    tasksDOM.innerHTML =
      '<h5 class="empty-list">There was an error, please try later....</h5>';
  }
  loadingDOM.style.visibility = "hidden"; // Hide loading spinner
};

// Call the function to display tasks
showTasks();

// delete task /api/task/:id
tasksDOM.addEventListener("click", async (e) => {
  const el = e.target;

  // Check if the clicked element is inside a delete button
  if (el.parentElement.classList.contains("delete-btn")) {
    loadingDOM.style.visibility = "visible"; // Show loading spinner
    const id = el.parentElement.dataset.id; // Get task ID

    try {
      // Use fetch to delete the task
      const response = await fetch(`${url}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the task");
      }

      // Refresh tasks after deletion
      showTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }

    loadingDOM.style.visibility = "hidden"; // Hide loading spinner
  }
});

// form
//create task
formDOM.addEventListener("submit", async (e) => {
  e.preventDefault();

  const task = taskInputDOM.value.trim();
  if (!task) {
    formAlertDOM.style.display = "block";
    formAlertDOM.textContent = "Task name is required!";
    formAlertDOM.classList.add("text-danger"); // Add a class to style the alert as an error
    return; // Prevent submission if task name is empty
  }
  try {
    await fetch(`${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task }),
    });

    showTasks();
    taskInputDOM.value = "";
    formAlertDOM.style.display = "block";
    formAlertDOM.textContent = `success, task added`;
    formAlertDOM.classList.add("text-success");
  } catch (error) {
    formAlertDOM.style.display = "block";
    formAlertDOM.innerHTML = `error, please try again`;
  }
  setTimeout(() => {
    formAlertDOM.style.display = "none";
    formAlertDOM.classList.remove("text-success");
  }, 2000);
});
