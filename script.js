
const API_URL = "http://localhost:8080/api/tasks";

const taskForm = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const taskList = document.getElementById("taskList");
const message = document.getElementById("message");

async function loadTasks() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Unable to load tasks");
        }

        const tasks = await response.json();
        taskList.innerHTML = "";

        tasks.forEach(task => {
            const li = document.createElement("li");

            const title = document.createElement("span");
            title.className = "task-title";
            title.textContent = task.title;

            if (task.completed) {
                title.classList.add("completed");
            }

            const actions = document.createElement("div");
            actions.className = "task-actions";

            const completeButton = document.createElement("button");
            completeButton.textContent = task.completed ? "Undo" : "Complete";
            completeButton.addEventListener("click", () => {
                updateTask(task.id, task.title, !task.completed);
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.className = "delete-btn";
            deleteButton.addEventListener("click", () => {
                deleteTask(task.id);
            });

            actions.append(completeButton, deleteButton);
            li.append(title, actions);
            taskList.appendChild(li);
        });
    } catch (error) {
        message.textContent =
            "Backend connect aagala. Spring Boot server running-ah check pannu.";
        console.error(error);
    }
}

taskForm.addEventListener("submit", async event => {
    event.preventDefault();

    const title = taskTitle.value.trim();

    if (!title) return;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                completed: false
            })
        });

        if (!response.ok) {
            throw new Error("Unable to add task");
        }

        taskTitle.value = "";
        message.textContent = "Task added successfully!";
        await loadTasks();
    } catch (error) {
        message.textContent = "Task add aagala. Backend check pannu.";
        console.error(error);
    }
});

async function updateTask(id, title, completed) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                completed: completed
            })
        });

        if (!response.ok) {
            throw new Error("Unable to update task");
        }

        message.textContent = "Task updated!";
        await loadTasks();
    } catch (error) {
        message.textContent = "Task update aagala.";
        console.error(error);
    }
}

async function deleteTask(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Unable to delete task");
        }

        message.textContent = "Task deleted!";
        await loadTasks();
    } catch (error) {
        message.textContent = "Task delete aagala.";
        console.error(error);
    }
}

loadTasks();