let yourTasks = JSON.parse(localStorage.getItem('yourTasks')) || [];
let avgTaskCompleted = [];
let currentProgress = 0;

function saveToStorage(){
  localStorage.setItem('yourTasks', JSON.stringify(yourTasks));
}

export function openTaskApp(){
  if(!document.querySelector('.tasks-tab')){
  document.body.insertAdjacentHTML('afterbegin', `
    <div class="tasks-tab">
    <i class="toggle-btn bi bi-caret-down"></i>
    <div class="task-header">
      <i class="bi bi-list-check"></i>
      <div class="title">
        <h2>Your Tasks</h2>
        <p>Your Daily Planner</p>
      </div>

    </div>
    <div class="task-select-date">
      <div class="cal-header">
        <div class="cal-icon">
          <i class="fas fa-calendar-check"></i>
        </div>
        <div class="cal-text">
          <div class="select-date-text">
            <p>Select Date</p>
            <p id="monthDisplay">October 2025</p>
          </div>
          <div class="today">
            <p>Today</p>
          </div>
        </div>
      </div>

      <div class="choose-date">
        <button id="backDate"><i class="fa fa-caret-left" aria-hidden="true"></i></button>
        <div class="calendar">
          <div class="days">
            <p class="countTask"></p>
            <p class="day">Sun</p>
            <p class="todate">1</p>
          </div>
          <div class="days">
            <p class="countTask"></p>
            <p class="day">Mon</p>
            <p class="todate">2</p>
          </div>
          <div class="days">
            <p class="countTask"></p>
            <p class="day">Tue</p>
            <p class="todate">3</p>
          </div>
          <div class="days">
            <p class="countTask"></p>
            <p class="day">Wed</p>
            <p class="todate">4</p>
          </div>
          <div class="days">
            <p class="countTask"></p>
            <p class="day">Thu</p>
            <p class="todate">5</p>
          </div>
          <div class="days">
            <p class="countTask"></p>
            <p class="day">Fri</p>
            <p class="todate">6</p>
          </div>
          <div class="days">
            <p class="countTask"></p>
            <p class="day">Sat</p>
            <p class="todate">7</p>
          </div>
        </div>
        <button id="nextDate"><i class="fa fa-caret-right" aria-hidden="true"></i></button>
      </div>
      
      <div class="selected-date">
        <p>Selected Date</p>
        <p id="selectedDate">Monday, October 2, 2025</p>
      </div>

    </div>

    <div class="task-progress">
      
      <div class="track-task-progress">
        
        <div class="task-progress-header">
          <p>Task Progress</p>
          <p class="progress-date">Today</p>
        </div>

        <div class="task-progress-status">
          <div>
            <i class="bi bi-bar-chart-line"></i>  
            <p class="progress-percent">0%</p>
          </div>
          <p>Complete</p>
        </div>
          
        </div>
      <div class="task-progress-bar">
        <!--PROGRESS LINE HERE-->
        <div class="metric-bar"></div>
      </div>
      <div class="task-overview">
        <div class="card-overview total">
          <i class="bi bi-bullseye"></i>
          <div class="task-total">
            <p id="totalCount">0</p>
            <p>Total</p>
          </div>
        </div>
        <div class="card-overview completed">
          <i class="bi bi-clipboard2-check-fill"></i>
          <div class="task-completed">
            <p id="completedCount">0</p>
            <p>Completed</p>
          </div>
        </div>
        <div class="card-overview pending">
          <i class="bi bi-clock-history"></i>
          <div class="task-pending">
            <p id="pendingCount">0</p>
            <p>Pending</p>
          </div>
        </div>
      </div>
    </div>

    <div class="add-task">

      <button id="addTask">
        <i class="fa fa-plus" aria-hidden="true"></i> 
        Add New Task</button>

        <div class="new-task">

          <div class="new-task-header">
            <div class="plus-icon">
              <i class="fas fa-plus"></i>
            </div>
            <div class="new-task-selected-date">
              <p>New Task</p>
              <div>
                <i class="fa fa-calendar" aria-hidden="true"></i>
                <p>Monday, Oct 13, 2025</p>  
              </div>
            </div>
          </div>
          <div class="new-task-title">
            <label for="titleInput">
              <i class="bi bi-fonts"></i>
              Task Title
            </label>
            <input id="titleInput" type="text" placeholder="What needs to be done?">
          </div>
          <div class="add-prior">
            <label>
              <i class="bi bi-flag"></i>
              Priority
            </label>
            <div class="prior-select">
              <div class="selected">
                <span class="dott low"></span> Low Priority
              </div>
              <ul class="options">
                <li data-value="low"><span class="dott low"></span> Low Priority</li>
                <li data-value="medium"><span class="dott medium"></span> Medium Priority</li>
                <li data-value="high"><span class="dott high"></span> High Priority</li>
              </ul>
            </div>
          </div>
          <div class="buttons">
            <button id="addTaskBtn">
              <i class="fa fa-plus" aria-hidden="true"></i> 
              Add Task
            </button>
            <button id="cancelBtn">
              Cancel
            </button>
          </div>
        </div>
    </div>
    <button class="clearTask">
      <i class="bi bi-trash"></i>
      Clear 1 Completed Task
    </button>
    <div class="task-list">
      
      <!--GENERATE TASK HERE-->
      
    </div>
  </div>

  `);
  };

  closeTab();
  navigateDate();
  loadCalendar();
  toggleAddTaskBox();
  addNewTask();
}

function closeTab(){
  const taskTab = document.querySelector('.tasks-tab');
  taskTab.addEventListener('animationend', () => {
    document.querySelector('.toggle-btn').addEventListener('click', () => {
      taskTab.classList.add('close');
      taskTab.addEventListener('animationend', () => {
        taskTab.remove();
      }, {once: true})
    }, {once: true})
  })
}

/*============NAVIGATE CALENDAR============*/
let nav = 0;
let activeDate = new Date();
let dt = new Date();
let navDate, currentDay, weekStart, tempDate;
let selectedDate = '';


function navigateDate(){
  const nextBtn = document.getElementById('nextDate');
  const backBtn = document.getElementById('backDate');
  const todayBtn = document.querySelector('.today');


  nextBtn.addEventListener('click', () => {
    nav++;
    loadCalendar();
  });

  backBtn.addEventListener('click', () => {
    nav--;
    loadCalendar();
  });

  todayBtn.addEventListener('click', () => {
    nav = 0;
    loadCalendar();
  })
}

function loadCalendar(){
  const calendar = document.querySelector('.calendar');
  const days = calendar.querySelectorAll('.days');
  const countTask = calendar.querySelectorAll('.countTask');
  const todate = calendar.querySelectorAll('.todate');

  dt = new Date();
  currentDay = dt.getDay();

  navDate = new Date();
  navDate.setDate(navDate.getDate() + nav * 7);

  weekStart = new Date(navDate);
  weekStart.setDate(navDate.getDate() - navDate.getDay());

  tempDate = new Date(weekStart);
  tempDate.setDate(weekStart.getDate() + currentDay);

  todate.forEach((el, i) => {
    const dayNum = weekStart.getDate();
    const dayDate = weekStart.toLocaleDateString();
    el.innerHTML = dayNum;
    days[i].dataset.dateId = dayDate;
    weekStart.setDate(weekStart.getDate() + 1);
    });

  activeDate = new Date(navDate);

  days.forEach(el => el.classList.remove('select'));

  calendar.removeEventListener('click', calendarClickListener);
  calendar.addEventListener('click', calendarClickListener);

  if(dt.toDateString() === tempDate.toDateString()){
    days[currentDay].classList.add('select');
    countTask[currentDay].classList.add('select');
    updateSelectedDate();
  }

  if(!days[currentDay].classList.contains('select') 
    && dt.toDateString() === tempDate.toDateString()
  ){
    days[currentDay].classList.add('active');
  } else {
    days[currentDay].classList.remove('active');
  }
    selectedDate = activeDate.toLocaleDateString();

  document.getElementById('monthDisplay').innerText = 
  `${navDate.toLocaleDateString('en-us', {month: 'long', year: 'numeric'})}`;
  renderYourTask();
}

function calendarClickListener(e){
  if(e.target.closest('.days')){
    const date = Array.from(this.querySelectorAll('.days'));
    const countTask = Array.from(this.querySelectorAll('.countTask'));
    const index = date.indexOf(e.target);
    
    if(e.target.classList.contains('select')){
      return;
    }

    date[activeDate.getDay()].classList.remove('select');
    countTask[activeDate.getDay()].classList.remove('select');

    activeDate.setDate(navDate.getDate() - currentDay + index);
    e.target.classList.add('select');
    countTask[activeDate.getDay()].classList.add('select');

    if(!date[currentDay].classList.contains('select') 
      && dt.toDateString() === tempDate.toDateString()
    ){
      date[currentDay].classList.add('active');
    } else {
      date[currentDay].classList.remove('active');
    }
    selectedDate = activeDate.toLocaleDateString();
    
    updateSelectedDate();
    renderYourTask();
  }
}

function updateSelectedDate(){
  const progressDate = document.querySelector('.progress-date');
  const newTaskDate = document.querySelector('.new-task-date');

  let date1 = new Date(activeDate);
  let date2 = new Date(dt);

  date1.setHours(0, 0, 0, 0);
  date2.setHours(0, 0, 0, 0);

  let diffDays = (date1 - date2) / (1000 * 60 * 60 * 24);

  if(diffDays === 0){
    progressDate.innerText = 'Today';
    newTaskDate.innerText = 'Today';
  } else if(diffDays === 1){
    progressDate.innerText = 'Tomorrow';
    newTaskDate.innerText = 'Tomorrow';
  } else if(diffDays === -1){
    progressDate.innerText = 'Yesterday';
    newTaskDate.innerText = 'Yesterday';
  } else {
    progressDate.innerText = activeDate.toDateString();
    newTaskDate.innerText = activeDate.toDateString();
  }

  document.getElementById('selectedDate').innerText = `${activeDate.toDateString()}`;

  
}
closeTab();
navigateDate();
loadCalendar();
toggleAddTaskBox();
addNewTask();

/*============ADD NEW TASK============*/
function toggleAddTaskBox(){
  const addTask = document.getElementById('addTask');
  const createNewTask = document.querySelector('.new-task');
  const cancelBtn = document.getElementById('cancelBtn');

  addTask.addEventListener('click', () => {
    addTask.classList.add('inactive');
    createNewTask.classList.add('active')
  })

  cancelBtn.addEventListener('click', () => {
    addTask.classList.remove('inactive');
    createNewTask.classList.remove('active')
  })

  const selectPrior = document.querySelector('.prior-select');
  const selected = selectPrior.querySelector('.selected');
  const options = selectPrior.querySelectorAll('.options li');

  selected.addEventListener('click', () => {
    selectPrior.classList.toggle('active');
  });

  options.forEach(option => {
    option.addEventListener('click', () => {
       selected.innerHTML = option.innerHTML
       selectedPriority = selected.textContent;
      selectPrior.classList.remove('active');
    });
  });

  window.addEventListener('click', (e) => {
    if (!selectPrior.contains(e.target)) {
      selectPrior.classList.remove('active');
    }
  });
}

let selectedPriority = 'Low Priority';

function addNewTask(){
  document.getElementById('addTaskBtn').addEventListener('click', () => {
    if(inputValidation())
    return;

    const titleInput = document.getElementById('titleInput');
    const title = titleInput.value;
    const id = crypto.randomUUID();
    
    yourTasks.push({
      id,
      title, 
      selectedPriority,
      selectedDate,
      completed: false
    });
    console.log(yourTasks);
    titleInput.value = '';
    renderYourTask();
    saveToStorage();
  });
}

function inputValidation(){
  const titleInput = document.getElementById('titleInput');
  if(titleInput.value === ''){
    titleInput.classList.add('invalid');
    titleInput.addEventListener('animationend', () => {
    titleInput.classList.remove('invalid');
    });
    titleInput.focus();
    return true;  
  }
}

  /*================
======RENDER=TASKS======
  ================*/
function renderYourTask(){
  const taskList = document.querySelector('.task-list');

  sortTask();

  const selectedTask = yourTasks.filter(t => t.selectedDate === selectedDate);
  const days = Array.from(document.querySelectorAll('.days'));
  const counts = document.querySelectorAll('.countTask');
  let countTask = []
  days.forEach((d, i) => {
    const tasksCount = yourTasks.filter(t => t.selectedDate === d.dataset.dateId);
    countTask.push({tasksCount});
    counts[i].innerText = tasksCount.length || '';
  });

  const renderTask = selectedTask.map(t => `
      <div class="task-container 
        ${t.completed 
        ? 'completed' : ''}" 
        data-task-id="${t.id}">
        <div class="your-task-header">
          <div class="your-priority ${priorityColor(t)}">
            ${t.selectedPriority}
          </div>
          <div class="task-btn-group">
            <i class="editYourTask bi bi-pencil-square"></i>
            <i class="saveIt inactive bi bi-check2"></i>
            <i class="trashYourTask bi bi-trash-fill"></i>
          </div>
        </div>
        <div class="content">
            <div class="checkbox-wrap">
              <input type="checkbox" id="circleChk" class="circle-checkbox" 
              ${t.completed 
                ? 'checked'
                : ''
              }/>
            </div>
            <div class="task-title">
              <p class="current-title">${t.title}</p>
              <input class="change-title hide" type="text" placeholder="Wanna change task?" 
              value="${t.title}">
            </div>
        </div>
      </div>
    `).join('');

  if(selectedTask.length > 0){
    taskList.innerHTML = renderTask;
  } else if(dt > activeDate){
    taskList.innerHTML = emptyTask().lateDate;
  } else {
    taskList.innerHTML = dt.toDateString() === activeDate.toDateString()
    ? emptyTask().today
    : emptyTask().anotherDate;
  }

  enableClearTasks(selectedTask);
  countTotalTask(selectedTask);
  taskProgress(countTask);
  controlHandler();
}

function countTotalTask(selectedTask){
  const notCompleted = selectedTask.filter(t => !t.completed);
  const completedTask = selectedTask.filter(t => t.completed);

  const total = document.getElementById('totalCount');
  const pending = document.getElementById('pendingCount');
  const completed = document.getElementById('completedCount');

  total.innerText = selectedTask.length;
  pending.innerText = notCompleted.length;
  completed.innerText = completedTask.length;
}

/*===================
=TASKS===FUNCTION 
===================*/
function enableClearTasks(selectedTask){
  const clearTaskBtn = document.querySelector('.clearTask');
  const ifAllCompleted = selectedTask.filter(t => t.completed);

  clearTaskBtn.classList.toggle('active', ifAllCompleted.length > 0);
  clearTaskBtn.removeEventListener('click', clearTaskHandler);

  if(ifAllCompleted){
    clearTaskBtn.addEventListener('click', clearTaskHandler);
  }

  function clearTaskHandler(){
    clearTask(selectedTask, clearTaskBtn);
  }
}

function clearTask(selectedTask, clearTaskBtn){
  const clearCompleted = selectedTask.filter(t => t.completed);
  yourTasks = yourTasks.filter(task => 
    !clearCompleted.some(t => t.id === task.id)
  );
  clearTaskBtn.removeEventListener('click', enableClearTasks);

  saveToStorage();
  renderYourTask();
}

/*==========================================
====HANDLER TO PREVENT MULTIPLE LISTENER====
==========================================*/
function controlHandler(){
  const container = document.querySelector('.task-list');

  container.removeEventListener('click', taskBox);
  container.addEventListener('click', taskBox);
}

function taskBox(e){
  if(e.target.matches('.trashYourTask')){
    const taskBox = e.target.closest('.task-container');
    const taskId = taskBox.dataset.taskId;
    const index = yourTasks.findIndex(t => t.id === taskId);
    yourTasks.splice(index, 1);
    saveToStorage();
    renderYourTask();
  }

  if(e.target.matches('.editYourTask')){
    const taskBox = e.target.closest('.task-container');
    e.target.classList.add('hide');
    const currentTitle = taskBox.querySelector('.current-title');
    const newTitle = taskBox.querySelector('.change-title');
    const saveBtn = taskBox.querySelector('.saveIt');

    currentTitle.classList.add('hide');
    newTitle.classList.remove('hide');
    saveBtn.classList.remove('inactive');
  }

  if(e.target.matches('.saveIt')){
    const taskBox = e.target.closest('.task-container');
    const taskId = taskBox.dataset.taskId;
    const index = yourTasks.findIndex(t => t.id === taskId);

    e.target.classList.add('inactive');
    const currentTitle = taskBox.querySelector('.current-title');
    const newTitle = taskBox.querySelector('.change-title');
    const editBtn = taskBox.querySelector('.editYourTask');

    currentTitle.classList.remove('hide');
    newTitle.classList.add('hide');
    editBtn.classList.remove('hide');

    const changeTitle = newTitle.value;
    yourTasks[index].title = changeTitle;
    saveToStorage();
    renderYourTask();
  }

  if(e.target.matches('.circle-checkbox')){
    const taskBox = e.target.closest('.task-container');
    const taskId = taskBox.dataset.taskId;
    const index = yourTasks.findIndex(t => t.id === taskId);

    if(e.target.checked){
      yourTasks[index].completed = true;
      saveToStorage();
      renderYourTask();
    } else {
      yourTasks[index].completed = false;
      saveToStorage();
      renderYourTask();
    }
  }
}

function priorityColor(t){
  if(t.selectedPriority.includes('Low')){
    return 'low';
  } else if(t.selectedPriority.includes('Med')){
    return 'med'
  } else {
    return 'high'
  }
}

/*==========EMPTY STATE==========*/
function emptyTask(){
  const today = `
    <div class="empty-task">
      <div class="check-square">
        <i class="bi bi-check2-square"></i>
      </div>
      <p>Ready to be productive today?</p>
      <p>Add your first task above and start organizing your day effectively.</p>
    </div>
  `;
  const anotherDate = `
    <div class="empty-task">
      <div class="check-square">
        <i class="bi bi-check2-square"></i>
      </div>
      <p>No tasks planned for 
      ${activeDate.toLocaleDateString('en-us', {
        month: 'long',
        day: 'numeric'
      })}</p>
      <p>Add tasks for this date to stay organized and productive.</p>
    </div>
  `;
  const lateDate = `
   <div class="empty-task">
    <div class="check-square">
      <i class="bi bi-check2-square"></i>
    </div>
    <p>${activeDate.toLocaleDateString('en-us', { month: 'long', day: 'numeric' })} is gone.</p>
    <p>You can't plan what's already over. Move on 😌.</p>
  </div>

  `

  return {today, anotherDate, lateDate};
}
                /*==============*/
/*===============SORT EVERY TASK===============*/
/*===============================================*/
function getPriorityValue(priority) {
  if (priority.includes('High')) return 1;
  if (priority.includes('Medium')) return 2;
  return 3; // Low Priority
}

function sortTask(){
  yourTasks.sort((a, b) => {
    if(a.completed - b.completed)
      return a.completed - b.completed;

    const priorityA = getPriorityValue(a.selectedPriority);
    const priorityB = getPriorityValue(b.selectedPriority);
      return priorityA - priorityB;
  });
}
                /*===================*/
/*============CALCULATE TASK PROGRESS============*/
function taskProgress(countTask){
  const average = document.querySelector('.progress-percent');
  const days = Array.from(document.querySelectorAll('.days'));
  const counts = document.querySelectorAll('.countTask');
  const bar = document.querySelector('.metric-bar'); 
  const root = document.documentElement;
  bar.style.animation = 'none';
  bar.offsetHeight;
  bar.style.animation = 'anim .3s ease forwards'; 

  // root.style.setProperty('--current-progress', `${currentProgress}%`);

  countTask.forEach(tasks => {
    if(tasks.tasksCount.length > 0){
      avgTaskCompleted.push(...tasks.tasksCount);
      avgTaskCompleted = avgTaskCompleted.filter(
        (t, index, self) => index === self.findIndex(o => o.id === t.id)
      );
    }
  });
  console.log('first list', countTask);

  let grouped = avgTaskCompleted.reduce((acc, task) => {
    const date = task.selectedDate;
    if (!acc[date]) acc[date] = []; 
    acc[date].push(task); 
    return acc
  }, []);
  console.log('second list', grouped);

  days.forEach((d, i) => {
    const count = !grouped[d.dataset.dateId] ? 0 : grouped[d.dataset.dateId];

    if(count.length > 0){
      const countCompleted = count.filter(c => c.completed);
      const avgProgress = (countCompleted.length / count.length) * 100 || 0;

      // if this date is the active one, update the global progress display
      if (d.dataset.dateId === activeDate.toLocaleDateString()) {
        average.textContent = `${Number(avgProgress.toFixed(2))}%`;
        root.style.setProperty('--progress-bar', `${avgProgress}%`);
      }
      
      if (avgProgress === 100) {
        counts[i].classList.add('checkMark');
        counts[i].innerHTML = '<i class="checkDate bi bi-check"></i>';
      } else {
        counts[i].classList.remove('checkMark');
      }
    } else if(d.dataset.dateId === activeDate.toLocaleDateString() && count === 0){
      average.textContent = `0%`;
      root.style.setProperty('--progress-bar', `0%`);
      counts[i].classList.remove('checkMark');
    } else {
      counts[i].classList.remove('checkMark');
    }
  })

}