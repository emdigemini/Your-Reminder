

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

const nextBtn = document.getElementById('nextDate');
const backBtn = document.getElementById('backDate');
const todayBtn = document.querySelector('.today');
const todate = document.querySelectorAll('.todate');
const days = document.querySelectorAll('.days');

nextBtn.addEventListener('click', () => {
  nav++;
  load();
});

backBtn.addEventListener('click', () => {
  nav--;
  load();
});

todayBtn.addEventListener('click', () => {
  nav = 0;
  load();
})

function load(){
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const dt = new Date();
  const current = new Date();
  const day = current.getDate();
  const month = current.getMonth();
  const year = current.getFullYear();

  let newMonth = month + nav;
  let newYear = year;
  current.setDate(current.getDate() + nav);


  const weekStart = new Date(current);
  weekStart.setDate(current.getDate() - current.getDay());

  if (newMonth > 11) {
    newMonth = 0;
    newYear++;
    anotherYear = newYear;
  } else if (newMonth < 0) {
    newMonth = 11;
    newYear--;
  }

  let tempDate = new Date(weekStart);

  todate.forEach((el, i) => {
    const dayNum = tempDate.getDate();
    el.innerHTML = dayNum;
    tempDate.setDate(tempDate.getDate() + 1);
  });

  const activeDate = new Date(current);
  const currentWeekday = current.getDay();
  const activeDay = activeDate.getDay();

  days.forEach((el, i) => {
    el.classList.remove('select');

    el.addEventListener('click', () => {
      if(dt.getDate() === weekStart.getDate()){
        days[dt.getDay()].classList.add('active');
      } else {
        days[dt.getDay()].classList.remove('active');
      }
      days[activeDate.getDay()].classList.remove('select');
      activeDate.setDate(current.getDate() - currentWeekday + i);

      el.classList.add('select');
      updateSelectedDate();
    })
  })

  days[activeDay].classList.add('select');

  if(!days[dt.getDay()].classList.contains('select')){
    if(dt.getDate() === weekStart.getDate()){
      days[dt.getDay()].classList.add('active');
    }
  } else {
      days[dt.getDay()].classList.remove('active');
  }


  function updateSelectedDate(){
    document.getElementById('monthDisplay').innerText = 
    `${current.toLocaleDateString('en-us', {month: 'long'})} ${newYear}`;
    document.getElementById('selectedDate').innerText = `${activeDate.toLocaleDateString('en-us', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })}`;
  }

  updateSelectedDate();

}

load();
