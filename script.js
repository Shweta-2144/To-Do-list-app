document.addEventListener("DOMContentLoaded", () => {  
    const taskInput = document.getElementById("taskInput");  
    const taskCategory = document.getElementById("taskCategory");  
    const taskDate = document.getElementById("taskDate");  
    const taskPriority = document.getElementById("taskPriority");  
    const addTaskBtn = document.getElementById("addTaskBtn");  
    const taskList = document.getElementById("taskList");  
    const progressFill = document.getElementById("progressFill");  
    const progressText = document.getElementById("progressText");  
    const darkModeToggle = document.getElementById("darkModeToggle");  
    const alarmSelect = document.getElementById("alarmSelect");  
    const taskTime = document.getElementById("taskTime");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];  

    // Function to toggle dark mode and store preference
    function toggleDarkMode() {
        document.body.classList.toggle("dark-mode");
        const isDarkMode = document.body.classList.contains("dark-mode");
        localStorage.setItem("darkMode", isDarkMode);
    }

    // Apply dark mode if it was previously enabled
    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark-mode");
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener("click", toggleDarkMode);
    } else {
        console.error("❌ Error: darkModeToggle not found!");
    }
    // Dark Mode Toggle with Local Storage
if (darkModeToggle) {
    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        // Store user preference in localStorage
        const isDarkMode = document.body.classList.contains("dark-mode");
        localStorage.setItem("darkMode", isDarkMode);
    });

    // Load dark mode preference on page load
    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark-mode");
    }
}
    function notifyUser(taskText, alarmFile) {
    let notificationDiv = document.getElementById("notification");
    notificationDiv.innerHTML = `<p>⏰ Your time has started for "<strong>${taskText}</strong>"!</p>`;

    let alarmSound = new Audio(alarmFile);
    alarmSound.play();

    // Hide notification after 5 seconds
    setTimeout(() => {
        notificationDiv.innerHTML = "";
    }, 5000);
}


    function updateProgress() {  
        const completedTasks = tasks.filter(task => task.completed).length;  
        const totalTasks = tasks.length;  
        const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);  
        progressFill.style.width = `${progress}%`;  
        progressText.textContent = `${progress}% Completed`;  
    }
    darkModeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    });

    function saveTasks() {  
        localStorage.setItem("tasks", JSON.stringify(tasks));  
    }

    function renderTasks() {  
        taskList.innerHTML = "";  
        tasks.forEach((task, index) => {  
            const li = document.createElement("li");  
            li.className = `${task.category} ${task.priority} ${task.completed ? "completed" : ""}`;  
            li.innerHTML = `  
                <span>${task.text} (${task.date ? task.date : "No Date"})</span>  
                <button class="completeBtn">✔</button>  
                <button class="deleteBtn">✖</button>  
            `;  

            li.querySelector(".completeBtn").addEventListener("click", () => {  
                tasks[index].completed = !tasks[index].completed;  
                saveTasks();  
                renderTasks();  
                updateProgress();  
            });  

            li.querySelector(".deleteBtn").addEventListener("click", () => {  
                tasks.splice(index, 1);  
                saveTasks();  
                renderTasks();  
                updateProgress();  
            });  

            taskList.appendChild(li);  
        });  

        updateProgress();  
    }

    addTaskBtn.addEventListener("click", () => {  
        if (!taskInput.value.trim()) {  
            alert("Task cannot be empty!");  
            return;  
        }  

        tasks.push({ text: taskInput.value.trim(), completed: false });  
        saveTasks();  
        renderTasks();  
        taskInput.value = "";  
    });

    renderTasks();  
});
