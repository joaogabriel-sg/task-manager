const btnAddBoard = document.querySelector('.btn-add-board');
const boardsContainer = document.querySelector('.boards-container');

function updateTaskManagerOnLocalStorage() {
  const boards = [...document.querySelectorAll('.board')];
  const taskManager = boards.map((board) => {
    const boardName = board.querySelector('.board-title').textContent;
    
    const boardTasks = [...board.querySelectorAll('.task')];
    const boardTasksArray = boardTasks.map((task) => {
      return { 
        id: task.id.substring(5),
        task: task.querySelector('h2').textContent,
      };
    });
    
    return {
      board: boardName,
      tasks: boardTasksArray,
    };
  });
  
  localStorage.setItem('task-manager', JSON.stringify(taskManager));
}

function handleDragStart(e) {
  const element = e.target.id;
  e.dataTransfer.setData('text', element);
  e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
}

function handleDrop(e) {
  e.preventDefault();
  const dataId = e.dataTransfer.getData('text');
  const boardTasks = e.currentTarget.querySelector('.board-tasks');
  boardTasks.appendChild(document.getElementById(dataId));
  updateTaskManagerOnLocalStorage();
}

function updateBoardHeading(e) {
  const currentHeading = e.target;
  currentHeading.setAttribute('contenteditable', false);
  updateTaskManagerOnLocalStorage();
}

function ableToChangeBoardHeading(e) {
  const currentHeading = e.target;
  currentHeading.setAttribute('contenteditable', true);
}

function addBoardTitleEvent() {
  const boardTitles = document.querySelectorAll('.board-title');
  if (boardTitles.length !== 0) {
    boardTitles.forEach((boardTitle) => {
      boardTitle.addEventListener('click', ableToChangeBoardHeading);
      boardTitle.addEventListener('blur', updateBoardHeading);
    })
  }
}

function editTask(e) {
  const btnEdit = e.target;
  const task = btnEdit.parentNode;
  const taskName = task.querySelector('h2');
  
  if (btnEdit.classList.contains('fa-edit')) {
    btnEdit.classList.remove('fa-edit');
    btnEdit.classList.add('fa-check');
    taskName.setAttribute('contenteditable', true);
  } else {
    btnEdit.classList.remove('fa-check');
    btnEdit.classList.add('fa-edit');
    taskName.setAttribute('contenteditable', false);
    updateTaskManagerOnLocalStorage();
  }
}

function addBtnEditTaskEventClick() {
  const btnsEditTask = document.querySelectorAll('.btn-edit-task');
  btnsEditTask.forEach((btnEditTask) => {
    btnEditTask.addEventListener('click', editTask);
  });
}

function getId() {
  const tasks = document.querySelectorAll('.task');
  if (tasks.length !== 0) {
    let lastId = Number(tasks[tasks.length - 1].id.substring(5));
    return ++lastId;
  }
  return 1;
}

function createTaskTemplate() {
  return `
    <div class="task" draggable="true" ondragstart="handleDragStart(event)" id="task-${getId()}">
      <h2>Nova Tarefa</h2>
      <i class="btn-edit-task fas fa-edit"></i>
    </div>
  `;
}

function addNewTask(e) {
  const currentBoard = e.target.parentNode;
  const boardTasks = currentBoard.querySelector('.board-tasks');
  const taskTemplate = createTaskTemplate();
  boardTasks.innerHTML += taskTemplate;
  addBtnEditTaskEventClick();
  updateTaskManagerOnLocalStorage();
}

function addBtnAddTaskEventClick() {
  const btnsAddTask = document.querySelectorAll('.btn-add-task');
  btnsAddTask.forEach((btnAddTask) => {
    btnAddTask.addEventListener('click', addNewTask);
  });
}

function deleteBoard(e) {
  const board = e.target.parentNode.parentNode;
  board.remove();
  updateTaskManagerOnLocalStorage();
}

function addBtnDeleteBoardEventClick() {
  const btnsDeleteBoard = document.querySelectorAll('.board-delete');
  btnsDeleteBoard.forEach((btnDeleteBoard) => {
    btnDeleteBoard.addEventListener('click', deleteBoard);
  });
}

function createBoardTemplate(boardName) {
  const boardTitle = boardName ? boardName : 'Novo Quadro';
  return `
    <div class="board" ondragover="handleDragOver(event)" ondrop="handleDrop(event)">
      <header class="board-header">
        <h1 class="board-title" contenteditable>${boardTitle}</h1>
        <i class="board-delete fas fa-trash-alt"></i>
      </header>
      <div class="board-tasks"></div>
      <div class="btn-add-task">Adicionar Tarefa</div>
    </div>
  `;
}

function addNewBoard() {
  const boardTemplate = createBoardTemplate();
  boardsContainer.innerHTML += boardTemplate;
  addBtnDeleteBoardEventClick();
  addBtnAddTaskEventClick();
  addBoardTitleEvent();
  updateTaskManagerOnLocalStorage();
}

function generateTaskManagerTemplate(acc, { board, tasks }) {
  const tasksTemplate = tasks.reduce((tasksAcc, { id, task }) => {
    return tasksAcc += `
      <div class="task" draggable="true" ondragstart="handleDragStart(event)" id="task-${id}">
        <h2>${task}</h2>
        <i class="btn-edit-task fas fa-edit"></i>
      </div>
    `;
  }, '');
  
  const boardTemplate = `
    <div class="board" ondragover="handleDragOver(event)" ondrop="handleDrop(event)">
      <header class="board-header">
        <h1 class="board-title">${board}</h1>
        <i class="board-delete fas fa-trash-alt"></i>
      </header>
      <div class="board-tasks">${tasksTemplate}</div>
      <div class="btn-add-task">Adicionar Tarefa</div>
    </div>
  `;

  return acc += boardTemplate;
}

function renderTaksManagerFromLocalStorage() {
  const taskManager = JSON.parse(localStorage.getItem('task-manager')) || [];
  if (taskManager.length !== 0) {
    boardsContainer.innerHTML = '';
    const taskManagerTemplate = taskManager.reduce(generateTaskManagerTemplate, '');
    boardsContainer.innerHTML = taskManagerTemplate;
  }
}

function init() {
  renderTaksManagerFromLocalStorage();
  addBtnDeleteBoardEventClick();
  addBtnAddTaskEventClick();
  addBtnEditTaskEventClick();
  addBoardTitleEvent();
}

init();

btnAddBoard.addEventListener('click', addNewBoard);
