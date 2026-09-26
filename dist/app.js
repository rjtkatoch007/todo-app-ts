"use strict";
const taskForm = document.getElementById("taskForm");
const taskNameInput = document.getElementById("taskName");
const dueDateInput = document.getElementById("dueDate");
const taskList = document.getElementById("taskList");
let tasks = loadTasks();
// Load tasks from localStorage
function loadTasks() {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks === null) {
        return [];
    }
    return JSON.parse(storedTasks);
}
// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
// Display all tasks
function displayTasks() {
    taskList.innerHTML = "";
    if (tasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-message">
                No tasks available.
            </div>
        `;
        return;
    }
    tasks.forEach((task) => {
        const taskElement = document.createElement("div");
        taskElement.className = "task";
        if (task.completed) {
            taskElement.classList.add("completed");
        }
        taskElement.innerHTML = `
            <div class="task-left">

                <input
                    type="checkbox"
                    class="task-checkbox"
                    data-id="${task.id}"
                    ${task.completed ? "checked" : ""}
                >

                <div class="task-info">

                    <span class="task-name">
                        ${task.name}
                    </span>

                    <span class="task-date">
                        Due: ${task.dueDate}
                    </span>

                    <span class="status">
                        Status:
                        ${task.completed ? "Completed" : "Pending"}
                    </span>

                </div>

            </div>

            <button
                class="delete-btn"
                data-id="${task.id}"
            >
                Delete
            </button>
        `;
        taskList.appendChild(taskElement);
    });
}
// Add a new task
function addTask(name, dueDate) {
    const newTask = {
        id: Date.now(),
        name: name,
        dueDate: dueDate,
        completed: false
    };
    tasks.push(newTask);
    saveTasks();
    displayTasks();
}
// Toggle task status
function toggleTask(taskId) {
    const task = tasks.find((task) => task.id === taskId);
    if (task === undefined) {
        return;
    }
    task.completed = !task.completed;
    saveTasks();
    displayTasks();
}
// Delete task
function deleteTask(taskId) {
    tasks = tasks.filter((task) => task.id !== taskId);
    saveTasks();
    displayTasks();
}
// Handle form submission
taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = taskNameInput.value.trim();
    const dueDate = dueDateInput.value;
    if (name === "" || dueDate === "") {
        return;
    }
    addTask(name, dueDate);
    taskForm.reset();
});
// Handle checkbox and delete button
taskList.addEventListener("click", (event) => {
    const target = event.target;
    // Checkbox
    if (target instanceof HTMLInputElement &&
        target.classList.contains("task-checkbox")) {
        const taskId = Number(target.dataset.id);
        toggleTask(taskId);
        return;
    }
    // Delete button
    if (target instanceof HTMLButtonElement &&
        target.classList.contains("delete-btn")) {
        const taskId = Number(target.dataset.id);
        deleteTask(taskId);
    }
});
// Display tasks when page loads
displayTasks();
