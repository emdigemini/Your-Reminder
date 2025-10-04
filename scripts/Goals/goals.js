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
                    <option value="personal growth">Personal Growth</option>
                    <option value="health">Health & Fitness</option>
                    <option value="career">Career & Skills</option>
                    <option value="financial goals">Financial Goals</option>
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
          <div class="goal-control-box">
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
    workSignAnim();
    closeTab();
    inputListener();
    renderGoal();
    addGoal();
    yourGoals.length > 0 
    ? controlGoal()
    : null;
  } else {return};
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
    setGoal     :     document.getElementById('setGoal'),
    category    :     document.getElementById('category'),
    target      :     document.getElementById('target'),
  };
  const control = {
    createGoal  :     document.getElementById('createGoal'),
    delGoal     :     document.querySelectorAll('.delete-goal'),
  }
  return {input, control};
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
  const createGoal = set.control.createGoal;
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
  const createGoal = set.control.createGoal;

  createGoal.addEventListener('click', () => {
    if(checkInputs()) return;

    const title    = set.input.setGoal.value;
    const category = set.input.category.value;
    const target   = Number(set.input.target.value);

    const goal = new Goal(title, category, target, 0, false);
    yourGoals.push(goal);
    goal.appendGoal();
    saveToStorage();
    controlGoal();
    for(let k in set.input){
      set.input[k].value ='';
    };
  })
  checkInputs();
}

function saveToStorage(){
  localStorage.setItem('yourGoals', JSON.stringify(yourGoals));
}

function renderGoal(){
  const goalList = document.querySelector('.your-goal-list');
  goalList.innerHTML = '';
  yourGoals.forEach(goal => {
    const render = new Goal(goal.title, goal.category, goal.target, goal.progress, goal.completed);
    render.appendGoal();
  })
  controlGoal();
}

function controlGoal(){
  const ctrl = getElm();
  ctrl.control.delGoal.forEach((del, i) => {
    del.addEventListener('click', () => {
      yourGoals.splice(i, 1);
      saveToStorage();
      renderGoal();
    })
  })
}

class Goal{
  constructor(title, category, target, progress, completed){
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
    container.innerHTML = `
      <div class="goal-category">
        ${this.category}
      </div>
      <div class="goal-title">
        <h2>${this.title}</h2>
        <div class="control-goal">
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

}