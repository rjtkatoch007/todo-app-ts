interface Task {
    id: number;
    name: string;
    dueDate: string;
    completed: boolean;
}

const taskForm = document.getElementById("taskForm") as HTMLFormElement;

const taskNameInput = document.getElementById(
    "taskName"
) as HTMLInputElement;

const dueDateInput = document.getElementById(
    "dueDate"
) as HTMLInputElement;

const taskList = document.getElementById(
    "taskList"
) as HTMLDivElement;


let tasks: Task[] = loadTasks();


// Load tasks from localStorage
function loadTasks(): Task[] {

    const storedTasks: string | null =
        localStorage.getItem("tasks");

    if (storedTasks === null) {
        return [];
    }

    return JSON.parse(storedTasks) as Task[];
}


// Save tasks to localStorage
function saveTasks(): void {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}


// Display all tasks
function displayTasks(): void {

    taskList.innerHTML = "";

    if (tasks.length === 0) {

        taskList.innerHTML = `
            <div class="empty-message">
                No tasks available.
            </div>
        `;

        return;
    }

    tasks.forEach((task: Task) => {

        const taskElement: HTMLDivElement =
            document.createElement("div");

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
function addTask(
    name: string,
    dueDate: string
): void {

    const newTask: Task = {
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
function toggleTask(taskId: number): void {

    const task: Task | undefined =
        tasks.find((task: Task) => task.id === taskId);

    if (task === undefined) {
        return;
    }

    task.completed = !task.completed;

    saveTasks();

    displayTasks();
}


// Delete task
function deleteTask(taskId: number): void {

    tasks = tasks.filter(
        (task: Task) => task.id !== taskId
    );

    saveTasks();

    displayTasks();
}


// Handle form submission
taskForm.addEventListener(
    "submit",
    (event: SubmitEvent): void => {

        event.preventDefault();

        const name: string =
            taskNameInput.value.trim();

        const dueDate: string =
            dueDateInput.value;

        if (name === "" || dueDate === "") {
            return;
        }

        addTask(name, dueDate);

        taskForm.reset();
    }
);


// Handle checkbox and delete button
taskList.addEventListener(
    "click",
    (event: MouseEvent): void => {

        const target: HTMLElement =
            event.target as HTMLElement;


        // Checkbox
        if (
            target instanceof HTMLInputElement &&
            target.classList.contains("task-checkbox")
        ) {

            const taskId: number =
                Number(target.dataset.id);

            toggleTask(taskId);

            return;
        }


        // Delete button
        if (
            target instanceof HTMLButtonElement &&
            target.classList.contains("delete-btn")
        ) {

            const taskId: number =
                Number(target.dataset.id);

            deleteTask(taskId);
        }
    }
);


// Display tasks when page loads
displayTasks();