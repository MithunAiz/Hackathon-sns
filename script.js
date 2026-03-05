const taskInput = document.getElementById('taskInput');
const dueDate = document.getElementById('dueDate');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const themeToggle = document.getElementById('themeToggle');
const icons = ['📘', '✏️', '🎯', '✅', '📌', '🛠️', '🚀', '💡'];

// 🔊 Sound Alert
const audio = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");

// 📊 Progress Bar
const progressBar = document.createElement('div');
progressBar.id = 'progressBar';
progressBar.style.margin = '10px 0';
progressBar.style.height = '10px';
progressBar.style.background = '#ddd';
progressBar.style.borderRadius = '10px';
progressBar.innerHTML = '<div id="progressFill" style="height:100%; width:0%; background:#4caf50; border-radius:10px;"></div>';
document.body.insertBefore(progressBar, document.querySelector('.app').nextSibling);

// 🌙 Dark Mode Toggle
themeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode');
});

// ➕ Add Task
addBtn.addEventListener('click', addTask);

function addTask() {
  const text = taskInput.value.trim();
  const date = dueDate.value;
  if (text === '' || date === '') return;

  const task = {
    id: Date.now(),
    text,
    date,
    icon: icons[Math.floor(Math.random() * icons.length)],
    completed: false
  };

  saveTask(task);
  renderTasks();
  scheduleReminder(task);
  taskInput.value = '';
  dueDate.value = '';
}

// 💾 Local Storage Save/Get
function saveTask(task) {
  const tasks = getTasks();
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasks() {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}

// 🧾 Render Task List
function renderTasks() {
  const tasks = getTasks();
  taskList.innerHTML = '';
  let completedCount = 0;

  tasks.forEach(task => {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task';
    if (task.completed) {
      taskDiv.classList.add('completed');
      completedCount++;
    }

    const icon = document.createElement('span');
    icon.className = 'icon';
    icon.textContent = task.icon;
    icon.addEventListener('click', () => toggleComplete(task.id));

    const taskContent = document.createElement('div');
    taskContent.innerHTML = `<div>${task.text}</div><div class="due-date">Due: ${task.date.replace("T", " ")}</div>`;

    const delBtn = document.createElement('span');
    delBtn.className = 'icon';
    delBtn.textContent = '🗑️';
    delBtn.addEventListener('click', () => deleteTask(task.id));

    taskDiv.append(icon, taskContent, delBtn);
    taskList.appendChild(taskDiv);
  });

  // Update progress bar
  const progressFill = document.getElementById('progressFill');
  const percent = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);
  progressFill.style.width = percent + '%';
}

// ✅ Complete & Delete
function toggleComplete(id) {
  const tasks = getTasks();
  const updatedTasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  renderTasks();
}

function deleteTask(id) {
  const tasks = getTasks();
  const updatedTasks = tasks.filter(t => t.id !== id);
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  renderTasks();
}

// ⏰ Sound Reminder
function scheduleReminder(task) {
  const due = new Date(task.date).getTime();
  const now = Date.now();
  const timeout = due - now;

  if (timeout > 0) {
    setTimeout(() => {
      audio.play();
      alert(`⏰ Reminder: "${task.text}" is due now!`);
    }, timeout);
  }
}

// 🗂️ View Switching
function showTaskView() {
  document.getElementById("taskView").style.display = "block";
  document.getElementById("calendarView").style.display = "none";
}

function showCalendarView() {
  document.getElementById("taskView").style.display = "none";
  document.getElementById("calendarView").style.display = "block";
  renderCalendar();
}

// 📅 Render Calendar View
function renderCalendar() {
  const calendar = document.getElementById('calendarGrid');
  calendar.innerHTML = '';

  const popup = document.getElementById('popup');
  const overlay = document.getElementById('overlay');
  const popupDate = document.getElementById('popupDate');
  const taskListPopup = document.getElementById('popupTaskList');

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const tasks = getTasks();

  for (let i = 0; i < firstDay; i++) {
    const blank = document.createElement('div');
    calendar.appendChild(blank);
  }

  for (let d = 1; d <= lastDate; d++) {
    const date = new Date(year, month, d);
    const localDate = date.toLocaleDateString('en-CA'); // ✅ LOCAL DATE FORMAT
    const todaysTasks = tasks.filter(t => t.date.startsWith(localDate));

    const cell = document.createElement('div');
    cell.className = 'day';
    if (d === today.getDate()) cell.classList.add('today');

    const number = document.createElement('div');
    number.className = 'date-num';
    number.textContent = d;
    cell.appendChild(number);

    if (todaysTasks.length > 0) {
      const dot = document.createElement('div');
      dot.className = 'task-dot';
      cell.appendChild(dot);

      cell.addEventListener('click', () => {
        popup.style.display = 'block';
        overlay.style.display = 'block';
        popupDate.textContent = localDate;
        taskListPopup.innerHTML = todaysTasks.map(t => `<li>${t.icon} ${t.text}</li>`).join('');
      });
    }

    calendar.appendChild(cell);
  }

  overlay.addEventListener('click', () => {
    popup.style.display = 'none';
    overlay.style.display = 'none';
  });
}

// 🔃 On Page Load
renderTasks();
getTasks().forEach(scheduleReminder);
