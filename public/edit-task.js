const taskIDDOM = document.querySelector(".task-edit-id");
const taskNameDOM = document.querySelector(".task-edit-name");
const taskCompletedDOM = document.querySelector(".task-edit-completed");
const editFormDOM = document.querySelector(".single-task-form");
const editBtnDOM = document.querySelector(".task-edit-btn");
const formAlertDOM = document.querySelector(".form-alert");
const params = window.location.search;
const id = new URLSearchParams(params).get("id");
let tempName;
// const localurl = `http://localhost:8000/api/task/${id}`;
const url = `/api/task/${id}`;
// Function to display task details
const showTask = async () => {
  try {
    const response = await fetch(`${url}`);
    if (!response.ok) {
      throw new Error("Failed to fetch task details");
    }

    const api_resp = await response.json();

    const { _id: taskID, completed, task } = api_resp.data;
    // const { _id: taskID, completed, name } = task;

    taskIDDOM.textContent = taskID;
    taskNameDOM.value = task;
    tempName = task;
    taskCompletedDOM.checked = completed;
  } catch (error) {
    console.error("Error fetching task:", error);
  }
};

// Call the function to show task details
showTask();

// Event listener for form submission
editFormDOM.addEventListener("submit", async (e) => {
  editBtnDOM.textContent = "Loading...";
  e.preventDefault();

  try {
    const taskName = taskNameDOM.value.trim();
    const taskCompleted = taskCompletedDOM.checked;
    if (!taskName) {
      formAlertDOM.style.display = "block";
      formAlertDOM.textContent = "Task name is required!";
      formAlertDOM.classList.add("text-danger"); // Add a class to style the alert as an error
      return; // Prevent submission if task name is empty
    }
    const response = await fetch(`${url}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task: taskName, completed: taskCompleted }),
    });

    if (!response.ok) {
      throw new Error("Failed to update task");
    }

    const api_resp = await response.json();
    const { _id: taskID, completed, task } = api_resp.data;

    taskIDDOM.textContent = taskID;
    taskNameDOM.value = task;
    tempName = task;
    taskCompletedDOM.checked = completed;

    formAlertDOM.style.display = "block";
    formAlertDOM.textContent = `Success, edited task`;
    formAlertDOM.classList.add("text-success");
  } catch (error) {
    console.error("Error updating task:", error);
    taskNameDOM.value = tempName;

    formAlertDOM.style.display = "block";
    formAlertDOM.textContent = `Error, please try again`;
  }

  editBtnDOM.textContent = "Edit";

  setTimeout(() => {
    formAlertDOM.style.display = "none";
    formAlertDOM.classList.remove("text-success");
  }, 3000);
});
