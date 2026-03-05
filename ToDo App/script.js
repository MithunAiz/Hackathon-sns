let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks(){
localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks(){

let taskList = document.getElementById("taskList");
taskList.innerHTML = "";

tasks.forEach((task,index)=>{

let li = document.createElement("li");

if(task.completed){
li.classList.add("completed");
}

li.innerHTML = `
${task.text} (Due: ${task.date})

<button onclick="completeTask(${index})">✔</button>
<button onclick="editTask(${index})">✏</button>
<button onclick="deleteTask(${index})">❌</button>
`;

taskList.appendChild(li);

checkReminder(task);

});

}

function addTask(){

let text = document.getElementById("taskInput").value;
let date = document.getElementById("dueDate").value;

if(text === ""){
alert("Enter a task");
return;
}

tasks.push({
text:text,
date:date,
completed:false
});

saveTasks();
renderTasks();

document.getElementById("taskInput").value="";
}

function completeTask(index){

tasks[index].completed = !tasks[index].completed;

saveTasks();
renderTasks();

}

function deleteTask(index){

tasks.splice(index,1);

saveTasks();
renderTasks();

}

function editTask(index){

let newTask = prompt("Edit task",tasks[index].text);

if(newTask){
tasks[index].text = newTask;
}

saveTasks();
renderTasks();

}

function toggleDarkMode(){

document.body.classList.toggle("dark");

}

function checkReminder(task){

let today = new Date().toISOString().split("T")[0];

if(task.date === today && !task.completed){

setTimeout(()=>{

alert("Reminder: Task due today -> " + task.text);

},1000);

}

}

renderTasks();