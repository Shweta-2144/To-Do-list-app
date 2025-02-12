document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("taskInput");
    const taskCategory = document.getElementById("taskCategory");
    const taskDate = document.getElementById("taskDate");
    const taskPriority = document.getElementById("taskPriority");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");
    const darkModeToggle = document.getElementById("darkModeToggle");
    const progressText = document.getElementById("progressText");
    const progressFill = document.getElementById("progressFill");

    addTaskBtn.addEventListener("click", addTask);

    function addTask() {
        const taskText = taskInput.value.trim();
        const category = taskCategory.value;
        const dueDate = taskDate.value;
        const priority = taskPriority.value;

        if (taskText === "") {
            alert("Please enter a task!");
            return;
        }

        const li = document.createElement("li");
        li.classList.add(category, priority);
        li.draggable = true;
        li.innerHTML = `
            <span>${taskText} <small>(${category} - ${priority})</small></span>
            <span class="due-date">${dueDate ? "Due: " + dueDate : ""}</span>
            <button class="complete-btn">✔</button>
            <button class="delete-btn">✖</button>
        `;

        taskList.appendChild(li);
        taskInput.value = "";
        taskDate.value = "";

        li.querySelector(".complete-btn").addEventListener("click", function () {
            li.classList.toggle("completed");
            updateProgress();
        });

        li.querySelector(".delete-btn").addEventListener("click", function () {
            li.remove();
            updateProgress();
        });

        updateProgress();
        saveTasks();
    }

    function updateProgress() {
        const tasks = document.querySelectorAll("li");
        const completedTasks = document.querySelectorAll("li.completed");
        const percent = tasks.length ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
        progressFill.style.width = percent + "%";
        progressText.textContent = `${percent}% Completed`;
    }

    darkModeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");
    });
});
// Enable touch-based drag & drop
document.addEventListener("touchstart", handleTouchStart, false);
document.addEventListener("touchmove", handleTouchMove, false);

let touchStartY = 0;
let draggedTask = null;

function handleTouchStart(e) {
    if (e.target.tagName === "LI") {
        touchStartY = e.touches[0].clientY;
        draggedTask = e.target;
    }
}

function handleTouchMove(e) {
    if (draggedTask) {
        let touchMoveY = e.touches[0].clientY;
        let moveDirection = touchMoveY - touchStartY;

        if (moveDirection > 50) {
            draggedTask.nextElementSibling?.after(draggedTask);
        } else if (moveDirection < -50) {
            draggedTask.previousElementSibling?.before(draggedTask);
        }

        draggedTask = null;
    }
}
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js")
        .then(() => console.log("Service Worker Registered!"))
        .catch(err => console.error("Service Worker Failed:", err));
}
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js")
    .then((registration) => {
        console.log("Service Worker Registered:", registration);
    })
    .catch((error) => {
        console.log("Service Worker Registration Failed:", error);
    });
} else {
    console.log("Service Worker not supported in this browser.");
}

