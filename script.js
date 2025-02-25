document.addEventListener("DOMContentLoaded", function () {
    const darkModeToggle = document.getElementById("darkModeToggle");
    const body = document.body;
    const taskInput = document.getElementById("taskInput");
    const taskCategory = document.getElementById("taskCategory");
    const taskDate = document.getElementById("taskDate");
    const taskTime = document.getElementById("taskTime");
    const taskList = document.getElementById("taskList");
    const alarmSelect = document.getElementById("alarmSelect");
    const playAlarmBtn = document.getElementById("playAlarmBtn");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const progressFill = document.getElementById("progressFill");
    const progressText = document.getElementById("progressText");
  
    // Retrieve tasks from localStorage or set as empty array
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  
    // Load tasks from localStorage and update UI
    function loadTasks() {
      taskList.innerHTML = "";
      tasks.forEach((task, index) => {
        const li = document.createElement("li");
        // Add "completed" class if task is marked as complete
        li.className = task.completed ? "completed" : "";
        li.innerHTML = `
          <span>${task.text} - ${task.category} - ${task.date} - ${task.time}</span>
          <div class="task-buttons">
            <button class="complete-btn" onclick="completeTask(${index})">✔</button>
            <button class="delete-btn" onclick="removeTask(${index})">❌</button>
          </div>
        `;
        taskList.appendChild(li);
      });
      updateProgress();
    }
  
    // Save tasks to localStorage
    function saveTasks() {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  
    // Add new task
    addTaskBtn.addEventListener("click", function () {
      const taskText = taskInput.value.trim();
      const category = taskCategory.value;
      const date = taskDate.value;
      const time = taskTime.value;
      const alarm = alarmSelect.value;
  
      if (taskText && date && time) {
        tasks.push({ 
          text: taskText, 
          category, 
          date, 
          time, 
          alarm, 
          alerted: false, 
          completed: false 
        });
        saveTasks();
        loadTasks();
        taskInput.value = "";
        taskDate.value = "";
        taskTime.value = "";
      } else {
        alert("Please enter all fields.");
      }
    });
  
    // Expose completeTask to global scope so onclick works
    window.completeTask = function (index) {
      // Toggle completed status in the tasks array
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      loadTasks();
    };
  
    // Expose removeTask to global scope so onclick works
    window.removeTask = function (index) {
      tasks.splice(index, 1);
      saveTasks();
      loadTasks();
    };
  
    // Preview Alarm Sound
    playAlarmBtn.addEventListener("click", function () {
      const selectedAlarm = alarmSelect.value;
      if (selectedAlarm) {
        console.log("Playing preview:", selectedAlarm);
        const audio = new Audio(selectedAlarm);
        audio.play().catch(error => console.error("Error playing alarm:", error));
      }
    });
  
    // Check tasks every minute and play alarm when time matches
    function checkTasksAndPlayAlarm() {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const formattedCurrentTime = `${String(currentHours).padStart(2, '0')}:${String(currentMinutes).padStart(2, '0')}`;
  
      console.log("Checking tasks at:", formattedCurrentTime);
  
      tasks.forEach((task, index) => {
        // Log each task to help with debugging time format issues
        console.log(`Task ${index}: ${task.text} - ${task.time}`);
        if (!task.alerted && task.time === formattedCurrentTime) {
          alert(`⏰ Time for task: ${task.text}`);
          if (task.alarm) {
            const alarmAudio = new Audio(task.alarm);
            alarmAudio.play().catch(error => console.error("Error playing alarm:", error));
          }
          task.alerted = true;
          saveTasks();
        }
      });
    }
  
    // Update progress bar based on completed tasks
    function updateProgress() {
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(task => task.completed).length;
      const percent = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
      progressFill.style.width = percent + "%";
      progressText.textContent = `${percent}% Completed`;
    }
  
    // Dark Mode Toggle
    darkModeToggle.addEventListener("click", function () {
      body.classList.toggle("dark-mode");
      darkModeToggle.textContent = body.classList.contains("dark-mode") ? "☀️ Light Mode" : "🌙 Dark Mode";
    });
  
    // Check tasks on load and start alarm check interval (every minute)
    loadTasks();
    setInterval(checkTasksAndPlayAlarm, 60000);
  });
  
