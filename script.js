class TaskList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
        <style>
        * {
        color: white;
        margin: 0;
        box-sizing: border-box;
      }
      body {
        background-color: rgb(23, 161, 161);
      }
      input {
        color: rgb(51, 50, 50);
      }
      h1 {
        margin-top: 20px;
        text-align: center;
        margin-bottom: 20px;
      }
      #add {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 20px;
        gap: 10px;
        font-size: 1.3rem;
      }
      label {
        font-size: 1.5rem;
      }
      #add-task {
        background-color: rgb(51, 50, 50);
        padding: 5px 15px;
        border-radius: 15px;
        font-size: 1.2rem;
        text-align: center;
        border: 0;
        color: white;
      }
      #button-end {
        position: fixed;
        z-index: 99;
        bottom: 0;
        left: 0;
        width: 100vw;
      }
      button {
        background-color: rgb(51, 50, 50);
      }
      #button-end > button {
        width: 100%;
        height: 80px;
        font-size: 1.5rem;
        border: none;
        outline: none;
      }

      .case {
        height: 25px;
        width: 25px;
      }
      .task {
        height: 80px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 1.5rem;
        text-decoration: none;
        gap: 20px;
      }
      #task-list{
        padding-inline: 7vw; 
      }
      .theTask{
        display: flex;
        gap: 5px;
      }
      .buttons{
        display: flex;
        gap: 15px;
      }
      .buttons button{
        width: fit-content;
        padding: 8px 15px;
        border-radius: 5px
      }
      .task-input{
        width: 100%;
      }
      .case:checked + label {
        text-decoration: line-through;
      }
        </style>
        <div id="task-list"></div>
      `;
  }

  connectedCallback() {
    const taskList = this.shadowRoot.getElementById("task-list");
    const taskInput = document.getElementById("task");
    const addTaskButton = document.getElementById("add-task");
    const clearCompletedButton = document.getElementById("button-end");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

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
