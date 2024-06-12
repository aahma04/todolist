document.addEventListener('DOMContentLoaded', () => {
    const addTaskBtn = document.getElementById("addTask");
    const taskList = document.getElementById("tasks");

    // Load tasks from localStorage on page load
    loadTasksFromLocalStorage();
    saveTasksToLocalStorage();

    addTaskBtn.addEventListener("click", () => addTask());

    function addTask(taskTextContent = '', inEditMode = true) {
        // create list item
        let task = document.createElement("li");
        task.classList.add('task-item');

        if (inEditMode) {
            // create input text
            let taskText = document.createElement('input');
            taskText.type = 'text';
            taskText.classList.add("task-text");
            taskText.placeholder = "Click on me to jot down an objective";
            taskText.value = taskTextContent;

            // Add focus and blur event listeners
            taskText.addEventListener('focus', () => {
                taskText.dataset.placeholder = taskText.placeholder;
                taskText.placeholder = '';
            });
            taskText.addEventListener('blur', () => {
                taskText.placeholder = taskText.dataset.placeholder;
            });

            // create done button
            let doneBtn = document.createElement('button');
            doneBtn.textContent = "Done";
            doneBtn.addEventListener("click", () => doneEditing(taskText, doneBtn, task));
            doneBtn.classList.add("done-btn");

            // add done button and input text into list item
            task.appendChild(taskText);
            task.appendChild(doneBtn);
        } else {
            doneEditing(null, null, task, taskTextContent);
        }

        // add list item into list
        taskList.appendChild(task);
    }

    function doneEditing(taskText, doneBtn, taskItem, preloadedText = '') {
        let newText = taskText ? taskText.value.trim() : preloadedText;

        // create text container
        let textContainer = document.createElement("div");
        textContainer.classList.add("textContainer");

        // set text
        let text = document.createElement("span");
        if (newText == "") {
            text.textContent = "Apparently nothing.";
        } else {
            text.textContent = newText; // Update text content with the new value
        }
        text.classList.add("taskSpan");
        text.addEventListener("click", () => {
            text.classList.toggle('line-through');
        });

        // create button container
        let btnContainer = document.createElement("div");
        btnContainer.classList.add("btnContainer");

        // create edit button
        let editBtn = document.createElement("button");
        editBtn.textContent = "edit";
        editBtn.addEventListener("click", () => editTask(text, taskItem));
        editBtn.classList.add("editBtn");

        // create delete button
        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "delete";
        deleteBtn.addEventListener("click", () => deleteTask(taskItem));
        deleteBtn.classList.add("deletebtn");

        // add text to text container
        textContainer.appendChild(text);

        // add edit and delete buttons into button container
        btnContainer.appendChild(editBtn);
        btnContainer.appendChild(deleteBtn);

        // add text and container into taskItem while deleting done button and input text
        taskItem.innerHTML = '';
        taskItem.appendChild(textContainer);
        taskItem.appendChild(btnContainer);

        // Save to local storage
        saveTasksToLocalStorage();
    }

    function editTask(text, taskItem) {
        let taskText = document.createElement('input');

        // initialize text (use same text as before) (add same placeholder)
        taskText.type = 'text';
        taskText.classList.add('task-text');
        taskText.value = text.textContent;
        taskText.placeholder = "Click on me to jot down an objective";

        // Add focus and blur event listeners
        taskText.addEventListener('focus', () => {
            taskText.dataset.placeholder = taskText.placeholder;
            taskText.placeholder = '';
        });
        taskText.addEventListener('blur', () => {
            taskText.placeholder = taskText.dataset.placeholder;
        });

        // create new done button
        let newDoneBtn = document.createElement('button');
        newDoneBtn.textContent = "Done";
        newDoneBtn.classList.add("done-btn");
        newDoneBtn.addEventListener("click", () => doneEditing(taskText, newDoneBtn, taskItem));

        // empty out task item and add text input as well as done button
        taskItem.innerHTML = '';
        taskItem.appendChild(taskText);
        taskItem.appendChild(newDoneBtn);
    }

    function deleteTask(taskItem) {
        taskItem.remove();
        // Save to local storage
        saveTasksToLocalStorage();
    }

    function saveTasksToLocalStorage() {
        const tasks = [];
        document.querySelectorAll('.task-item .taskSpan').forEach(taskSpan => {
            tasks.push(taskSpan.textContent);
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasksFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(taskTextContent => {
            addTask(taskTextContent, false);
        });
    }
});
