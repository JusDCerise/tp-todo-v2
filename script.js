class TaskList extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const taskList = document.getElementById("task-list");
    const taskInput = document.getElementById("task");
    const addTaskButton = document.getElementById("add-task");
    const clearCompletedButton = document.getElementById("button-end");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    console.log(tasks);

    function renderTasks() {
      taskList.innerHTML = "";
      for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];

        const taskElement = document.createElement("section");
        taskElement.classList.add("task");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "checkbox";
        checkbox.className = "case";
        checkbox.id = task.name;
        if (task.completed) {
          checkbox.ariaLabel = task.name + ", la tâche est terminé";
        } else {
          checkbox.ariaLabel = task.name + ", la tâche n'est pas terminé";
        }

        checkbox.checked = task.completed;
        checkbox.addEventListener("change", () => {
          task.completed = checkbox.checked;
          saveTasks();
        });

        const label = document.createElement("label");
        label.htmlFor = task.name;
        label.textContent = task.name;

        const input = document.createElement("input");
        input.type = "text";
        input.className = "task-input";
        input.value = task.name;
        input.style.display = "none";

        const editButton = document.createElement("button");
        editButton.textContent = "Modifier";
        editButton.addEventListener("click", () => {
          label.style.display = "none";
          input.style.display = "inline";
          editButton.style.display = "none";
          saveButton.style.display = "inline";
          input.focus();
        });

        const saveButton = document.createElement("button");
        saveButton.textContent = "Valider";
        saveButton.style.display = "none";
        saveButton.addEventListener("click", () => {
          const updatedTaskName = input.value;
          task.name = updatedTaskName;
          saveTasks();
          renderTasks();
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Supprimer";
        deleteButton.addEventListener("click", () => {
          tasks.splice(i, 1);
          saveTasks();
          renderTasks();
        });

        const checkLabel = document.createElement("div");
        checkLabel.classList.add("theTask");
        const buttons = document.createElement("div");
        buttons.classList.add("buttons");

        taskElement.appendChild(checkLabel);
        taskElement.appendChild(buttons);
        checkLabel.appendChild(checkbox);
        checkLabel.appendChild(label);
        checkLabel.appendChild(input);
        buttons.appendChild(editButton);
        buttons.appendChild(saveButton);
        buttons.appendChild(deleteButton);

        taskList.appendChild(taskElement);
      }
    }

    addTaskButton.addEventListener("click", () => {
      const taskName = taskInput.value.trim();
      if (taskName === "") return;
      tasks.push({ name: taskName, completed: false });
      saveTasks();
      taskInput.value = "";
      renderTasks();
    });

    clearCompletedButton.addEventListener("click", () => {
      tasks = tasks.filter((task) => !task.completed);
      saveTasks();
      renderTasks();
    });

    function saveTasks() {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    renderTasks();
  }
}

customElements.define("task-list", TaskList);
