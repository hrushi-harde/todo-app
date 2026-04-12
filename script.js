const API_URL = "https://todo-backend-o6jo.onrender.com";

function showToast(message, color) {
    Toastify({
        text: message,
        duration: 2000,
        gravity: "top",
        position: "right",
        style: { background: color }
    }).showToast();
}

async function loadTasks(){
    let display = document.getElementById('displayContainer');
    display.innerHTML = "Loading tasks...";

    try {
        let res = await fetch(`${API_URL}/tasks`);
        let data = await res.json();
        displayTask(data);
    } catch (error) {
        console.error(error);
    }
}

window.addTask = async function (){
    let task = document.getElementById('task').value;
    let priority = document.getElementById('priority').value;

    if(task.trim() === ""){
        showToast("Enter task first", "orange");
        return;
    }

    try {
        await fetch(`${API_URL}/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ task, priority })
        });

        showToast("Task Added", "green");

        document.getElementById('task').value = "";
        loadTasks();

    } catch (error) {
        console.error(error);
    }
};

function displayTask(tasks){
    let display = document.getElementById('displayContainer');
    display.innerHTML = "";

    tasks.forEach(t => {
        display.innerHTML += `
        <div class="task-card">
            <h3>${t.task}</h3>
            <p class="priority">${t.priority}</p>
            <button class="btn2" onclick="deleteTask(${t.id})">✔ Complete</button>
        </div>`;
    });
}

window.deleteTask = async function(id){
    await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE"
    });

    showToast("Task Completed", "#2196f3");
    loadTasks();
};

document.addEventListener("DOMContentLoaded", () => {
    loadTasks();

    document.getElementById("task").addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            addTask();
        }
    });
});