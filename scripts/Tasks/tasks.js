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
let activeDate = new Date();
let dt = new Date();
let navDate, currentDay, weekStart, tempDate;

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
  const todate = calendar.querySelectorAll('.todate');

  dt = new Date();
  currentDay = dt.getDay();

  navDate = new Date();
  navDate.setDate(navDate.getDate() + nav * 7);

  weekStart = new Date(navDate);
  weekStart.setDate(navDate.getDate() - navDate.getDay());

  tempDate = new Date(weekStart);
  tempDate.setDate(weekStart.getDate() + currentDay);

  todate.forEach(el => {
    const dayNum = weekStart.getDate();
    el.innerHTML = dayNum;
    weekStart.setDate(weekStart.getDate() + 1);
  });

  activeDate = new Date(navDate);

  days.forEach(el => el.classList.remove('select'));

  calendar.removeEventListener('click', calendarClickListener);
  calendar.addEventListener('click', calendarClickListener);

  if(dt.toDateString() === tempDate.toDateString()){
    days[currentDay].classList.add('select');
    updateSelectedDate();
  }

  if(!days[currentDay].classList.contains('select') 
    && dt.toDateString() === tempDate.toDateString()
  ){
    days[currentDay].classList.add('active');
  } else {
    days[currentDay].classList.remove('active');
  }
}

function calendarClickListener(e){
  if(e.target.matches('.days')){
    const date = Array.from(this.querySelectorAll('.days'));
    const index = date.indexOf(e.target);

    date[activeDate.getDay()].classList.remove('select');
    activeDate.setDate(navDate.getDate() - currentDay + index);
    e.target.classList.add('select');

    if(!date[currentDay].classList.contains('select') 
      && dt.toDateString() === tempDate.toDateString()
    ){
      date[currentDay].classList.add('active');
    } else {
      date[currentDay].classList.remove('active');
    }
    
    updateSelectedDate();
  }
}

function updateSelectedDate(){
  document.getElementById('monthDisplay').innerText = 
  `${navDate.toLocaleDateString('en-us', {month: 'long', year: 'numeric'})}`;
  document.getElementById('selectedDate').innerText = `${activeDate.toLocaleDateString('en-us', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })}`;
}
navigateDate();
loadCalendar();
