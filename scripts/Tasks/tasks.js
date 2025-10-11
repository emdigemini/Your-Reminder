

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
            <p>October 2025</p>
          </div>
          <div class="today-text">
            <p>Today</p>
          </div>
        </div>
      </div>

      <div class="choose-date">
        <i class="fa fa-caret-left" aria-hidden="true"></i>
        <div class="calendar">
          <div class="days">
            <p class="day">Sun</p>
            <p class="todate">1</p>
          </div>
          <div class="days active">
            <p class="day">Mon</p>
            <p class="todate">2</p>
          </div>
          <div class="days">
            <p class="day">Tue</p>
            <p class="todate">3</p>
          </div>
          <div class="days">
            <p class="day">Wed</p>
            <p class="todate">4</p>
          </div>
          <div class="days">
            <p class="day">Thu</p>
            <p class="todate">5</p>
          </div>
          <div class="days">
            <p class="day">Fri</p>
            <p class="todate">6</p>
          </div>
          <div class="days">
            <p class="day">Sat</p>
            <p class="todate">7</p>
          </div>
        </div>
        <i class="fa fa-caret-right" aria-hidden="true"></i>
      </div>
      
      <div class="selected-date">
        <p>Selected Date</p>
        <p>Monday, October 2, 2025</p>
      </div>

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

let nav = 0;
let anotherYear;

document.getElementById('nextDate').addEventListener('click', () => {
  nav++;
  load();
});

document.getElementById('backDate').addEventListener('click', () => {
  nav--;
  load();
});

document.querySelector('.today').addEventListener('click', () => {
  nav = 0;
  load();
})

function load(){
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const short_weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const dt = new Date();
  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();

  let newMonth = month + nav;
  let newYear = year;
  if(nav !== 0){
    dt.setMonth(month + nav);
  }

  if (newMonth > 11) {
    newMonth = 0;
    newYear++;
    anotherYear = newYear;
  } else if (newMonth < 0) {
    newMonth = 11;
    newYear--;
  }

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  document.getElementById('monthDisplay').innerText = 
  `${dt.toLocaleDateString('en-us', {month: 'long'})} ${newYear}`;
  
  const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
    weekday: 'long',
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  });

  const getIndexOfWeekdays = dateString.split(',')[0];
  const paddingDays = short_weekdays.indexOf(getIndexOfWeekdays);

  for(let i = 1; i <= paddingDays + daysInMonth; i++){
    const daySquare = document.createElement('div');
    daySquare.classList.add('day');
    
    if(i > paddingDays){
      daySquare.innerText = i - paddingDays;
      daySquare.addEventListener('click', () => console.log('click'));
    } else {
      daySquare.classList.add('padding');
    }

  }
}

load();
