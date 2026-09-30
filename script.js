const form = document.querySelector('#task-form');
const input = document.querySelector('#task-input');
const errorMsg = document.querySelector('#error');
const list = document.querySelector('#task-list');
const counter = document.querySelector('#counter');
const emptyState = document.querySelector('#empty-state');

let tasks = load();

function save() {
  const json = JSON.stringify(tasks);
  localStorage.setItem('tasks', json);
}

function load() {
  const raw = localStorage.getItem('tasks');
  return JSON.parse(raw) || [];
}

function addTask(e) {
  e.preventDefault();
  const title = input.value.trim();

  if (title === '') {
    errorMsg.textContent = 'Please type a task first.';
    return;
  }

  tasks.push({ title: title, done: false });
  input.value = '';
  save();
  renderTasks();
}

function toggleTask(task) {
  task.done = !task.done;
  save();
  renderTasks();
}

function deleteTask(task) {
  tasks = tasks.filter(t => t !== task);
  save();
  renderTasks();
}

function createTaskItem(task) {
  const li = document.createElement('li');
  li.classList.add('task');
  if (task.done) {
    li.classList.add('done');
  }

  const checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.classList.add('toggle');
  if (task.done) {
    checkbox.setAttribute('checked', '');
  }
  checkbox.addEventListener('click', () => toggleTask(task));

  const title = document.createElement('span');
  title.classList.add('title');
  title.textContent = task.title;

  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('delete');
  deleteBtn.textContent = '×';
  deleteBtn.addEventListener('click', () => deleteTask(task));

  li.append(checkbox, title, deleteBtn);
  return li;
}

function renderTasks() {
  list.innerHTML = '';
  tasks.map(createTaskItem).forEach(li => list.append(li));

  const doneCount = tasks.filter(task => task.done).length;
  counter.textContent = `${doneCount} of ${tasks.length} done`;

  if (tasks.length > 0) {
    emptyState.style.display = 'none';
  } else {
    emptyState.style.display = 'block';
  }
}

form.addEventListener('submit', addTask);

input.addEventListener('input', () => {
  errorMsg.textContent = '';
});

renderTasks();

input.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    input.value = '';
    errorMsg.textContent = '';
  }
});