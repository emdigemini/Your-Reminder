const yourGoals = [];

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
                  <span>0%</span>
                  <p>Avg Progress</p>
                </div>
              </div>
              <div class="completed">
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
                <input type="text" id="setGoal" placeholder="What do you want to achieve?">
                <div class="input-box-2">
                  <div class="category-box">
                    <label for="category">Category</label>
                    <select name="category" id="category">
                      <option value="" hidden>Pick your goal area</option>
                      <option value="personal growth">Personal Growth</option>
                      <option value="health & fitness">Health & Fitness</option>
                      <option value="career & skills">Career & Skills</option>
                      <option value="financial goals">Financial Goals</option>
                    </select>
                  </div>
                  <div class="target-track">
                    <label for="target">Target</label>
                    <input type="number" id="progress" placeholder="100">
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
                <button id="all" class="goal-filter active">
                  All (0)
                </button>
                <button id="active" class="goal-filter">
                  Active (0)
                </button>
                <button id="completed" class="goal-filter">
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
              <div class="your-goal-container">
                <div class="goal-category">
                  Health
                </div>
                <div class="goal-title">
                  <h2>Your Goal</h2>
                  <i class="bi bi-pencil"></i>
                </div>
                <div class="goal-deadline">
                  <i class="bi bi-calendar2-check"></i>
                  06/05/2026
                </div>
                <div class="track-progress">
                  <p>Progress</p>
                  <div class="points">
                    <p class="percentage">0%</p>
                    <p class="points">(0/100)</p>
                  </div>
                  <div class="progress-bar"></div>
                </div>
                <div class="add-points">
                  <input class="input-points" type="number" placeholder="0">
                  <button id="add"><i class="bi bi-plus-circle-dotted"></i></button>
                </div>
              </div>
            </div>

            <div class="your-goal-list">
              <div class="your-goal-container">
                <div class="goal-category">
                  Career
                </div>
                <div class="goal-title">
                  <h2>Your Goal #2</h2>
                  <i class="bi bi-pencil"></i>
                </div>
                <div class="goal-deadline">
                  <i class="bi bi-calendar2-check"></i>
                  06/05/2026
                </div>
                <div class="track-progress">
                  <p>Progress</p>
                  <div class="points">
                    <p class="percentage">0%</p>
                    <p class="points">(0/100)</p>
                  </div>
                  <div class="progress-bar"></div>
                </div>
                <div class="add-points">
                  <input class="input-points" type="number" placeholder="0">
                  <button id="add"><i class="bi bi-plus-circle-dotted"></i></button>
                </div>
              </div>
            </div>
            <!--END OF GOAL LIST-->

          </div>
        </div>
      `);

    closeTab();
    setYourGoal();
  } else {return};
}

function getEle(){
  const inputBox = {
    setGoal     :     document.getElementById('setGoal'),
    category    :     document.getElementById('category'),
    progress    :     document.getElementById('progress'),
  };
  const control = {
    createGoal  :     document.getElementById('createGoal'),

  }
  return {inputBox, control};
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

function setYourGoal(){
  const set = getEle();
  const createGoal    = set.control.createGoal;

  function checkInputs(){
    const inputGoal     = set.inputBox.setGoal.value;
    const inputCategory = set.inputBox.category.value;
    const inputProgress = set.inputBox.progress.value;
    if(!inputGoal || !inputCategory || !inputProgress){
      return;
    }
    else {
      createGoal.classList.remove('disabled');
      addGoal(inputGoal, inputCategory, inputProgress, createGoal);
    }
  }

  Object.values(set.inputBox).forEach(boxInput => {
    boxInput.addEventListener('input', checkInputs);
  })

  checkInputs();
}

function addGoal(inputGoal, inputCategory, inputProgress, createGoal){
  createGoal.addEventListener('click', () => {

  })
}