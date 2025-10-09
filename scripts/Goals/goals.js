import { filterState, filterGoal, filterCategory, applyFilters, updateGoalCounts, updateCategoryCounts } from "./filter.js";
import { ifUnitsMoney } from "./utils/goal.js";

export const yourGoals = JSON.parse(localStorage.getItem('yourGoals')) || [];
// localStorage.clear() 

export class Goal{
  constructor(id, title, category, target, progress, points, completed, unit, deadline){
    this.id = id;
    this.title = title;
    this.category = category;
    this.target = target;
    this.progress = progress;
    this.points = points;
    this.completed = completed;
    this.unit = unit;
    this.deadline = deadline;
  }

  render(){
    const container = document.createElement('div');
    container.classList.add('your-goal-container');
    container.dataset.goalId = this.id;
    container.innerHTML = `
      <div class="goal-category">${this.category}</div>
      <div class="goal-title">
        <h2>${this.title}</h2>
        <div class="btn-goal">
          <div id="edit-goal">
            <i class="bi bi-pencil"></i>
          </div>
          <div id="delete-goal">
            <i class="delete-goal bi bi-trash"></i>
          </div>
        </div>
      </div>
      <div class="goal-deadline">
        ${this.deadline 
          ? `<i class="bi bi-calendar2-check"> ${this.deadline}</i> ` 
          : ''}
      </div>
      <div class="track-progress">
        <p>Progress</p>
        <div class="progress">
          <p class="percentage">${this.progress}%</p>
          <p class="points">(${this.points}/${ifUnitsMoney(this.target, this.unit)})</p>
        </div>
        <div class="progress-bar">
          <div class="your_progress"></div>
        </div>
      </div>
      <div class="add-progress">
        <input class="input-points" type="number" placeholder="0">
        <button id="addPoints" class="add-points"><i class="add-points bi bi-plus-circle-dotted"></i></button>
      </div>
      ${this.completed ? '<div class="goal-completed"></div>' : ''}
    `;
    return container;
  }

  appendGoal(){
    const goalList = document.querySelector('.your-goal-list');
    goalList.appendChild(this.render());
  }

  static renderFilteredList(filtered){
    const goalList = document.querySelector('.your-goal-list');
    goalList.innerHTML = '';

    if(filterState.category && filtered.length === 0){
      goalList.innerHTML = emptyState();
      return;
    }

    if(filtered.length === 0){
      goalList.innerHTML = `
        <div class="empty-state">
          <i class="bi bi-clipboard-check"></i>
          <p class="title">No ${filterState.status === 'activeGoal' ? 'active' : 'completed'} goals</p>
          <p class="desc">Try adding or completing a goal first.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(g => {
      const goal = new Goal(g.id, g.title, g.category, g.target, g.progress, g.points, g.completed, g.unit, g.deadline);
      goal.appendGoal();
    });
  }

}

export function openGoalApp(){
  if(!document.querySelector('.goals')){
    document.body.insertAdjacentHTML('afterbegin', `
      <div class="goals">
        <div class="goals-tab">
          <div class="goals-logo-circle">
            <div class="pr-icon-circle">
              <div class="square-1"></div>
              <div class="square-2"></div>
              <div class="square-3"></div>
              <div class="square-4"></div>
            </div>
            <div class="title">
              <h2>Your Goals</h2>
              <p>Achieve greatness daily</p>
              <i class="toggle-btn bi bi-caret-down"></i>
            </div>
          </div>

          <div class="progress-card">
            <div class="avg-progress">
              <i class="bi bi-bar-chart-steps"></i>
              <div class="count">
                <span class="avg_progress">0%</span>
                <p>Avg Progress</p>
              </div>
            </div>
            <div class="completed-goal">
              <i class="bi bi-award-fill"></i>
              <div class="count">
                <span class="completed_count">0</span>
                <p>Completed</p>
              </div>
            </div>
          </div>

          <!--INPUT BOX-->
          <div class="set-goal">
            <div class="goals-logo-square">
              <div class="pr-icon-square">
                <div class="square-1"></div>
                <div class="square-2"></div>
                <div class="square-3"></div>
                <div class="square-4"></div>
                <div class="dot"></div>
              </div>
              <h2>Set Your Goal</h2>
            </div>

            <p>
            Transform your dreams into achievable milestones. 
            Set clear targets and track your progress toward what matters most.
            </p>

            <div class="input-box">
              <input type="text" id="setGoal" 
              placeholder="What do you want to achieve?" 
              autocomplete="off">
              <div class="input-box-2">
                <div class="category-box">
                  <label for="category">Category</label>
                  <select name="category" id="category">
                    <option value="" hidden>Pick your goal area</option>
                    <option value="✨Personal">✨Personal Growth</option>
                    <option value="🔋Health">🔋Health & Fitness</option>
                    <option value="💼Career">💼Career & Skills</option>
                    <option value="💰Financial">💰Financial Goals</option>
                  </select>
                </div>

                <div class="target-track">
                  <label for="target">Target</label>
                  <input type="number" id="target" 
                  placeholder="100" autocomplete="off">
                </div>
              </div>

              <div class="input-box-3">
                <div class="unit">
                  🔢
                  <label for="unit">Unit</label>
                  <input id="unit" type="text" placeholder="kg, hours, money...">
                </div>
                <div class="deadline">
                  📅
                  <label for="deadline">Deadline</label>
                  <input id="deadline" type="date">
                </div>
              </div>

              <div class="btn-group">
                <div class="toggle-input-box-3">
                  <i id="setDeadline" class="bi bi-calendar2"></i>
                  <i id="closeInputBox3" class="bi bi-x-lg"></i>
                </div>
                <button id="createGoal" class="disabled">+ Create Goal</button>
              </div>
            </div>
          </div>
          <!--END OF INPUT BOX-->

          <!--CONTROL BOX-->
          <div class="goal-control-box">
            <div class="goal-controls-button">
              <button id="allGoal" class="goal-filter active">🎯All (0)</button>
              <button id="activeGoal" class="goal-filter">⚡Active (0)</button>
              <button id="completedGoal" class="goal-filter">✨Completed (0)</button>
            </div>

            <div class="goal-categories">
              <p>Categories</p>
              <div class="first-line">
                <button id="health" value="🔋Health">Health</button>
                <button id="career" value="💼Career">Career</button>
              </div>
              <div class="second-line">
                <button id="personal" value="✨Personal"></button>
                <button id="financial" value="💰Financial"></button>
              </div>
            </div>
          </div>
          <!--END OF CONTROL BOX-->

          <!--GOAL LIST-->
          <div class="your-goal-list">
            <!--GENERATE GOAL LIST HERE-->
          </div>
          <!--END OF GOAL LIST-->
        </div>
      </div>
    `);
    allFunction();
  } else {
    return;
  }
}

export function getElm(){
  const input = {
    setGoal           :     document.getElementById('setGoal'),
    category          :     document.getElementById('category'),
    target            :     document.getElementById('target'),
    unit              :     document.getElementById('unit'),
    deadline          :     document.getElementById('deadline'),
  };

  const btn = {
    createGoal        :     document.getElementById('createGoal'),
    allGoal           :     document.getElementById('allGoal'),
    activeGoal        :     document.getElementById('activeGoal'),
    completedGoal     :     document.getElementById('completedGoal'),
    health            :     document.getElementById('health'),
    career            :     document.getElementById('career'),
    personal          :     document.getElementById('personal'),
    financial         :     document.getElementById('financial'),
  }

  const goal = {
    inputPoints       :     document.querySelectorAll('.input-points'),
    addPoints         :     document.querySelectorAll('.add-points'),
  }

  return {input, btn, goal};
}

function allFunction(){
  // render all goals into the list container
  renderGoal();

  // closes the tab and cleans up all related DOM elements and data
  closeTab();

  // add event listeners to all inputs for setting goals
  inputListener();

  // toggle visibility of the "Set Deadline" input
  toggleThird_inputBox();

  // save goals to localStorage
  addGoal();

  // filters goals by status: all, active or completed
  filterGoal();

  // filter goals by category: health, career, personal or financial
  filterCategory();

  // handles editing and deleting of a specific goal
  controlGoal();
}

function closeTab(){
  const yourTab = document.querySelector('.goals');
  document.querySelector('.toggle-btn').addEventListener('click', () => {
    yourTab.classList.add('close');
    yourTab.addEventListener('animationend', () => {
      yourTab.remove();
    }, {once: true})
  })
}

function toggleThird_inputBox(){
  const setDeadlineBox = document.querySelector('.input-box-3');
  const btn = document.getElementById('setDeadline');
  const close = document.getElementById('closeInputBox3');
  btn.addEventListener('click', function(){
    this.classList.add('active');
    close.classList.add('active');
    setDeadlineBox.classList.add('active');
  })
  close.addEventListener('click', function(){
    console.log('click');
    this.classList.remove('active');
    btn.classList.remove('active');
    setDeadlineBox.classList.remove('active');
  })
}

function inputListener(){
  const set = getElm();
  const goalList = document.querySelector('.your-goal-list');

  Object.values(set.input).forEach(k => {
    k.addEventListener('input', () => {
      checkInputs();
      if(k.id === 'unit'){
        k.value = k.value.replace(/[0-9]/g, '');
      }
    });
  });

  goalList.addEventListener('input', (e) => {
    if(e.target.classList.contains('input-points')){
      const container = e.target.closest('.your-goal-container');
      const goalId = container.dataset.goalId;
      const goalIndex = yourGoals.findIndex(g => g.id === goalId);
      const value = Number(e.target.value);
      yourGoals[goalIndex].tempPoints = value;
    }
  })
  
  checkInputs();
}


//listener for delete and edit
function controlGoal(){
  const goalList = document.querySelector('.your-goal-list');
  goalList.addEventListener('click', (e) => {
    // DELETE LISTENER
    if(e.target.classList.contains('delete-goal')){
      const container = e.target.closest('.your-goal-container');
      const goalId = container.dataset.goalId;
      const delId = yourGoals.findIndex(g => g.id === goalId);
      yourGoals.splice(delId, 1);
      saveToStorage();
      countGoalCompleted();
      getAvgProgress();
      applyFilters();
    }

    if(e.target.classList.contains('add-points')){
      const container = e.target.closest('.your-goal-container');
      const goalId = container.dataset.goalId;
      const goalIndex = yourGoals.findIndex(g => g.id === goalId);

      const goal = yourGoals[goalIndex];
      if(goal.tempPoints + goal.points > goal.target){
        console.log("Stop right there, overachiever! 🚫You've already maxed out your goal.");
        return; 
      }

      if(goal.tempPoints > 0) 
        goal.points += goal.tempPoints;
      
      container.querySelector('.input-points').value = '';
      goal.tempPoints = 0;
      goal.progress = Number(Math.min((goal.points / goal.target) * 100, 100).toFixed(2));

      if(goal.progress === 100){
        goal.completed = true;
      }

      saveToStorage();
      countGoalCompleted();
      getAvgProgress();
      applyFilters();
    }
  });
}

export function updateProgressBar(filtered){
  if(!filtered){
    yourGoals.forEach(g => {
      const container = document.querySelector(`.your-goal-container[data-goal-id="${g.id}"]`);
      const progressBar = container.querySelector('.your_progress');

      progressBar.style.width = `${g.progress}%`;

      const hue = (g.progress / 100) * 145;
      
      const nextHue = hue + 20;
      progressBar.style.background = `linear-gradient(90deg, hsl(${hue}, 100%, 50%), hsl(${nextHue}, 100%, 60%))`;
      progressBar.style.transition = "width 0.5s ease, background 0.5s ease";
      completedState(g);
    });
    return;
  }
  if(filtered.length === 0)
    return;
  filtered.forEach(g => {
    const container = document.querySelector(`.your-goal-container[data-goal-id="${g.id}"]`);
    const progressBar = container.querySelector('.your_progress');

    progressBar.style.width = `${g.progress}%`;
    progressBar.style.width = `${g.progress}%`;

    const hue = (g.progress / 100) * 145;
    
    const nextHue = hue + 20;
    progressBar.style.background = `linear-gradient(90deg, hsl(${hue}, 100%, 50%), hsl(${nextHue}, 100%, 60%))`;
    progressBar.style.transition = "width 0.5s ease, background 0.5s ease";
    completedState(g);
  });
}

let invalid = true;
function checkInputs(){
  const set = getElm();
  const title = set.input.setGoal.value;
  const category = set.input.category.value;
  const target = set.input.target.value;
  const createGoal = set.btn.createGoal;
  createGoal.classList.add('disabled');
  if(title === '' || category === '' || target === ''){
    invalid = true;
    return;
  } else {
    invalid = false;
    createGoal.classList.remove('disabled');
  }
}

function addGoal(){
  const set = getElm();
  const createGoal = set.btn.createGoal;

  createGoal.addEventListener('click', () => {
    if(invalid)return;
    const id = crypto.randomUUID();
    const title = set.input.setGoal.value;
    const category = set.input.category.value;
    const target = Number(set.input.target.value);
    const unit = set.input.unit.value;
    const deadline = new Date(set.input.deadline.value).toLocaleDateString('en-US');
;
    const goal = new Goal(id, title, category, target, 0, 0, false, unit, deadline);
    goal.timeCreated = Date.now();
    yourGoals.push(goal);
    renderGoal();
    saveToStorage();
    console.log(yourGoals);
    for(let k in set.input){
      set.input[k].value ='';
    };
    checkInputs();
  })
}

export function renderGoal(){
  const goalList = document.querySelector('.your-goal-list');
  goalList.innerHTML = '';

  updateGoalCounts();
  updateCategoryCounts();
  countGoalCompleted();
  getAvgProgress();
  if (yourGoals.length === 0) {
    goalList.innerHTML = `
      <div class="empty-state">
        <i class="bi bi-clipboard-check"></i>
        <p class="title">No goals yet</p>
        <p class="desc">Start by adding your first goal to track your progress!</p>
      </div>
    `;
    return;
  }
  sortItem();
  yourGoals.forEach(g => {
    const render = new Goal(g.id, g.title, g.category, g.target, g.progress, g.points, g.completed, g.unit, g.deadline);
    render.appendGoal();
  });
  updateProgressBar();
}

export function sortItem(filtered){
  // sort every time: incomplete first and newest first
  if(!filtered){
    yourGoals.sort((a, b) => {
      if(a.completed === b.completed) {
        return b.timeCreated - a.timeCreated; 
      }
      return a.completed - b.completed; 
    });
    saveToStorage();
    return;
  }
  filtered.sort((a, b) => {
    if(a.completed === b.completed) {
      return b.timeCreated - a.timeCreated; 
    }
    return a.completed - b.completed; 
  });
  saveToStorage();
}

function saveToStorage(){
  localStorage.setItem('yourGoals', JSON.stringify(yourGoals));
}

function completedState(g){
  if(g.completed){
    // let message = [
    //   "Achievement unlocked: “Actually finished something.” 🧠",
    //   "Bro just completed a goal 💀",
    //   "The prophecy has been fulfilled. 🔮",
    //   "Your ancestors are proud. 😌",
    // ];
    const container = document.querySelector(`.your-goal-container[data-goal-id="${g.id}"]`);
    const goalIsCompleted = container.querySelector('.goal-completed');
    goalIsCompleted.innerHTML = `
      <p>Bro just completed a goal 💀</p>
    `
  }
}

function emptyState(){
  return `
    <div class="empty-state">
      <i class="bi bi-clipboard-check"></i>
      <p class="title">Oops! Looks like this category is empty.</p>
      <p class="desc">Time to fill it with awesome goals!</p>
    </div>
  `;
}

function countGoalCompleted(){
  const count = document.querySelector('.completed_count');
  count.innerHTML = yourGoals.filter(g => g.completed).length;
};

function getAvgProgress() {
   const average = document.querySelector('.avg-progress .count span');

    if (yourGoals.length === 0) {
      average.textContent = "0%";
      return;
    }

    const totalProgress = yourGoals.reduce((sum, goal) => sum + goal.progress, 0);
    const avgProgress = totalProgress / yourGoals.length;

    average.textContent = `${Number(avgProgress.toFixed(2))}%`;
}