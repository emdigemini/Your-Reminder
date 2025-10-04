const yourGoals = JSON.parse(localStorage.getItem('yourGoals')) || [];

// localStorage.clear()

export function openGoalApp(){
  if(!document.querySelector('.goals')){
    document.body.insertAdjacentHTML('afterbegin', `

      <div class="working-sign-overlay">
        <div class="working-sign">
          <p>This app is still in development.</p>
          <button class="close" type="button">Continue</button>
        </div>
      </div>
      
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
                <span>0%</span>
                <p>Avg Progress</p>
              </div>
            </div>
            <div class="completed-goal">
              <i class="bi bi-award-fill"></i>
              <div class="count">
                <span>0</span>
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
              Transform your dreams into achievable milestones. Set clear targets and track your progress toward what matters most.
            </p>
            <div class="input-box">
              <input type="text" id="setGoal" placeholder="What do you want to achieve?" autocomplete="off">
              <div class="input-box-2">
                <div class="category-box">
                  <label for="category">Category</label>
                  <select name="category" id="category">
                    <option value="" hidden>Pick your goal area</option>
                    <option value="personal">Personal Growth</option>
                    <option value="health">Health & Fitness</option>
                    <option value="career">Career & Skills</option>
                    <option value="financial">Financial Goals</option>
                  </select>
                </div>
                <div class="target-track">
                  <label for="target">Target</label>
                  <input type="number" id="target" placeholder="100" autocomplete="off">
                </div>
              </div>
              <div class="btn-group">
                <i class="bi bi-calendar2"></i>
                <button id="createGoal" class="disabled">+ Create Goal</button>
              </div>
            </div>
          </div>
          <!--END OF INPUT BOX-->
          
          <!--CONTROL BOX-->
          <div class="goal-btn-box">
            <div class="goal-controls-button">
              <button id="allGoal" class="goal-filter active">  
                                        All (0)
              </button>
              <button id="activeGoal" class="goal-filter">
                Active (0)
              </button>
              <button id="completedGoal" class="goal-filter">
                Completed (0)
              </button>
            </div>
            <div class="goal-categories">
              <p>Categories</p>
              <div class="first-line">
                <button id="health">Health (0)</button>
                <button id="career">Career (0)</button>
              </div>
              <div class="second-line">
                <button id="personal">Personal (0)</button>
                <button id="financial">Financial (0)</button>
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
  } else {return};
}

function allFunction(){
  //animation to show this app still on development
  workSignAnim();

  //closes the tab and cleans up all related DOM elements and data
  closeTab();

  //add event listeners to all inputs for setting goals
  inputListener();

  //render all goals into the list container
  renderGoal();

  //save goals to localStorage
  addGoal();

  //filters goals by status: all, active or completed
  filterGoal();

  //filter goals by category: health, career, personal or financial
  filterCategory();
  
  //handles editing and deleting of a specific goal
  controlGoal();
}

function workSignAnim(){
  const overlay = document.querySelector('.working-sign-overlay');
  const sign = document.querySelector('.working-sign');
  const close = document.querySelector('.close');
  overlay.classList.add('anim');
  sign.classList.add('anim');
  close.addEventListener('click', () => {
    overlay.classList.remove('anim');
    overlay.classList.add('close');
    sign.classList.remove('anim');
    sign.classList.add('close');
    sign.addEventListener('animationend', () => {
      overlay.remove();
      sign.remove();
    }, {once: true})
  })
}

function getElm(){
  const input = {
    setGoal       :     document.getElementById('setGoal'),
    category      :     document.getElementById('category'),
    target        :     document.getElementById('target'),
  };
  const btn = {
    createGoal    :     document.getElementById('createGoal'),
    delGoal       :     document.querySelectorAll('.delete-goal'),
    allGoal       :     document.getElementById('allGoal'),
    activeGoal    :     document.getElementById('activeGoal'),
    completedGoal :     document.getElementById('completedGoal'),
    health        :     document.getElementById('health'),
    career        :     document.getElementById('career'),
    personal      :     document.getElementById('personal'),
    financial     :     document.getElementById('financial'),
  }
  return {input, btn};
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

function inputListener(){
  const set = getElm();

  Object.values(set.input).forEach(input => {
    input.addEventListener('input', checkInputs);
  });

  checkInputs();
}

function checkInputs(){
  const set = getElm();
  const title    = set.input.setGoal.value;
  const category = set.input.category.value;
  const target   = set.input.target.value;
  const createGoal = set.btn.createGoal;
  if(title === '' || category === '' || target === ''){
    createGoal.classList.add('disabled');
    return true;
  }
  else {
    createGoal.classList.remove('disabled');
  }
}

function addGoal(){
  const set = getElm();
  const createGoal = set.btn.createGoal;

  createGoal.addEventListener('click', () => {
    if(checkInputs()) return;

    const title    = set.input.setGoal.value;
    const category = set.input.category.value;
    const target   = Number(set.input.target.value);
    const id = crypto.randomUUID();


    const goal = new Goal(id, title, category, target, 0, false);
    yourGoals.push(goal);
    renderGoal();
    saveToStorage();
    console.log(yourGoals);
    for(let k in set.input){
      set.input[k].value ='';
    };
  })
  checkInputs();
}

function saveToStorage(){
  localStorage.setItem('yourGoals', JSON.stringify(yourGoals));
}

function filterGoal(){
  const filterBtn = getElm();
  const group = [filterBtn.btn.health, filterBtn.btn.career, filterBtn.btn.personal, filterBtn.btn.financial];

  filterBtn.btn.allGoal.addEventListener('click', function(){
    group.forEach(e => e.classList.remove('active'));
    filterBtn.btn.activeGoal.classList.remove('active');
    filterBtn.btn.completedGoal.classList.remove('active');
    this.classList.add('active');
    renderGoal();
  })

  filterBtn.btn.activeGoal.addEventListener('click', function(){
    filterBtn.btn.completedGoal.classList.remove('active');
    filterBtn.btn.allGoal.classList.remove('active');
    this.classList.add('active');
    const activeList = yourGoals.filter(goal => !goal.completed);
    Goal.renderFilter(activeList, 'active');
  })

  filterBtn.btn.completedGoal.addEventListener('click', function(){
    filterBtn.btn.activeGoal.classList.remove('active');
    filterBtn.btn.allGoal.classList.remove('active');
    this.classList.add('active');
    const completedList = yourGoals.filter(goal => goal.completed);
    Goal.renderFilter(completedList, 'completed');
  })

}

function filterCategory(){
  const go = getElm();
  const group = [go.btn.health, go.btn.career, go.btn.personal, go.btn.financial];

  go.btn.health.addEventListener('click', function(){
    group.forEach(e => e.classList.remove('active'));
    this.classList.add('active');
    const domainType = yourGoals.filter(g => g.category === this.id);
    Goal.renderCategory(domainType);
  })

   go.btn.career.addEventListener('click', function(){
    group.forEach(e => e.classList.remove('active'));
    this.classList.add('active');
    const domainType = yourGoals.filter(g => g.category === this.id);
    Goal.renderCategory(domainType);
  })

   go.btn.personal.addEventListener('click', function(){
    group.forEach(e => e.classList.remove('active'));
    this.classList.add('active');
    const domainType = yourGoals.filter(g => g.category === this.id);
    Goal.renderCategory(domainType);
  })

   go.btn.financial.addEventListener('click', function(){
    group.forEach(e => e.classList.remove('active'));
    this.classList.add('active');
    const domainType = yourGoals.filter(g => g.category === this.id);
    Goal.renderCategory(domainType);
  })

}

function updateCategoryCounts(){
  const count = getElm();
  
  count.btn.health.textContent = `Health (${yourGoals.filter(g => g.category === count.btn.health.id).length})`;
  count.btn.career.textContent = `Career (${yourGoals.filter(g => g.category === count.btn.career.id).length})`;
  count.btn.personal.textContent = `Personal (${yourGoals.filter(g => g.category === count.btn.personal.id).length})`;
  count.btn.financial.textContent = `Financial (${yourGoals.filter(g => g.category === count.btn.financial.id).length})`;

}

function updateGoalCounts(){
  const count = getElm();

  count.btn.allGoal.textContent = `All (${yourGoals.length})`;
  count.btn.activeGoal.textContent = `Active (${yourGoals.filter(g => !g.completed).length})`;
  count.btn.completedGoal.textContent = `Completed (${yourGoals.filter(g => g.completed).length})`
  
}

function renderGoal(){
  const goalList = document.querySelector('.your-goal-list');
  goalList.innerHTML = '';
  
  updateGoalCounts();
  updateCategoryCounts();
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

  yourGoals.forEach(g => {
    const render = new Goal(g.id, g.title, g.category, g.target, g.progress, g.completed);
    render.appendGoal();
  });

}

function controlGoal(){
  const goalList = document.querySelector('.your-goal-list');

  goalList.addEventListener('click', (e) => {
    //DELETE LISTENER
    if(e.target.classList.contains('delete-goal')){
      const container = e.target.closest('.your-goal-container');
      const goalId    = container.dataset.goalId;
      const delId     = yourGoals.findIndex(g => g.id === goalId);

      yourGoals.splice(delId, 1);
      saveToStorage();
      renderGoal();
    }
  })
}

class Goal{
  constructor(id, title, category, target, progress, completed){
    this.id         =   id;
    this.title      =   title;
    this.category   =   category;
    this.target     =   target;
    this.progress   =   progress;
    this.completed  =   completed;
  }

  render(){
    const container = document.createElement('div');
    container.classList.add('your-goal-container');
    if(this.completed){
      container.classList.add('goal-completed')
    }
    container.dataset.goalId = this.id;
    container.innerHTML = `
      <div class="goal-category">
        ${this.category}
      </div>
      <div class="goal-title">
        <h2>${this.title}</h2>
        <div class="btn-goal">
          <i class="bi bi-pencil"></i>
          <i class="delete-goal bi bi-trash"></i>
        </div>
      </div>
      <div class="goal-deadline">
        <i class="bi bi-calendar2-check"></i>
        06/05/2026
      </div>
      <div class="track-progress">
        <p>Progress</p>
        <div class="points">
          <p class="percentage">${this.progress}%</p>
          <p class="points">(0/${this.target})</p>
        </div>
        <div class="progress-bar"></div>
      </div>
      <div class="add-points">
        <input class="input-points" type="number" placeholder="0">
        <button id="addPoints"><i class="bi bi-plus-circle-dotted"></i></button>
      </div>
    `;

    return container;
  };

  appendGoal(){
    const goalList = document.querySelector('.your-goal-list');
    goalList.appendChild(this.render());
  }

  static renderFilter(filtered, type){
    const goalList = document.querySelector('.your-goal-list');
    goalList.innerHTML = '';

    if(filtered.length === 0){
      goalList.innerHTML = `
        <div class="empty-state">
          <i class="bi bi-clipboard-check"></i>
          <p class="title">No ${type} goals</p>
          <p class="desc">Try adding or completing a goal first.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(g => {
      const goal = new Goal(g.id, g.title, g.category, g.target, g.progress, g.completed);
      goal.appendGoal();
    });
  }

  static renderCategory(domain){
    const goalList = document.querySelector('.your-goal-list');
    goalList.innerHTML = '';
    console.log(domain);
    if(domain.length === 0){
      goalList.innerHTML = `
        <div class="empty-state">
          <i class="bi bi-clipboard-check"></i>
          <p class="title">Oops! Looks like this category is empty.</p>
          <p class="desc">Time to fill it with awesome goals!</p>
        </div>
      `;
      return;
    }

    domain.forEach(g => {
      const goal = new Goal(g.id, g.title, g.category, g.target, g.progress, g.completed);
      goal.appendGoal();
    });
  }
}