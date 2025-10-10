

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
      
    </div>
    <div class="task-progress">

    </div>
    <div class="add-task">

    </div>
    <div class="task-list">
      <div class="task-container">

      </div>
    </div>
  </div>
  `);
  };
  closeTab();
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
