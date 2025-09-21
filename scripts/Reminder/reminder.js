import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js'

const reminderList = [];

export function openReminder(){
  document.body.insertAdjacentHTML('beforebegin', `
      <div class="reminder-tab">
        <div class="toggle-tab">
          <i class="bi bi-caret-down"></i>
        </div>
        <div class="reminder-header">
          <h2>Your Reminder</h2>

          <div class="reminder-actions">
            <div class="reminder-input-group">
              <input class="input-reminder" type="text" placeholder="Add a new reminder...">
              <button class="set-time">
                <i class="bi bi-clock"></i>
              </button>
              <button disabled class="add-reminder">
                <i class="bi bi-upload"></i>
              </button>
            </div>

            <div class="reminder-date-set">
              <label for="date">Date (Optional)</label>
              <input type="date" id="setDate">
            </div>

            <div class="reminder-time-set">
              <label for="startTime">Start Time</label>
              <input type="time" id="startTime">
              <label for="endTime">End Time</label>
              <input type="time" id="endTime">
            </div>
          </div>

        </div>

        <div class="reminder-control-box">
          <div class="reminder-controls-button">
            <button id="reminder-filter" class="active">All (4)</button>
            <button id="reminder-filter">Active (4)</button>
            <button id="reminder-filter">Completed (0)</button>
          </div>
        </div>

        <div class="reminder-list">

          <!--GENERATE YOUR REMINDER HERE-->
            ${reminderList.length > 0 ? renderReminder() : "You don't have any reminders yet — why not add one to get started?"}
          <!--GENERATE YOUR REMINDER HERE-->

        </div>
      </div>
    `);
    
  const reminderEl = getElm();
  
  reminderEl.tabReminder.classList.remove('close')
  reminderEl.tabReminder.classList.add('open');
  reminderEl.tabReminder.addEventListener('animationend', () => {
    reminderEl.closeTab.addEventListener('click', () => {
      reminderEl.tabReminder.classList.add('close')
      reminderEl.tabReminder.classList.remove('open')
    })
  })

  toggleDateNTimeSet(reminderEl.dateNtime, reminderEl.dateSet, reminderEl.timeSet);
  reminderListeners(reminderEl.inputBar, reminderEl.addReminder, reminderEl.setDate, reminderEl.startTime, reminderEl.endTime);
}

function getElm(){
  return {
    tabReminder :   document.querySelector('.reminder-tab'),
    closeTab    :   document.querySelector('.toggle-tab'),
    dateNtime   :   document.querySelector('.set-time'),
    dateSet     :   document.querySelector('.reminder-date-set'),
    timeSet     :   document.querySelector('.reminder-time-set'),
    // reminder actions group selector
    inputBar    :   document.querySelector('.input-reminder'),
    addReminder :   document.querySelector('.add-reminder'),
    setDate     :   document.getElementById('setDate'),
    startTime   :   document.getElementById('startTime'),
    endTime     :   document.getElementById('endTime'),
  }
}

function toggleDateNTimeSet(dateNtime, dateSet, timeSet){
  dateNtime.addEventListener('click', toggleAnimation);
  function toggleAnimation(){
    dateSet.classList.toggle('openDateSet');
    timeSet.classList.toggle('openTimeSet');
  }
}

function reminderListeners(inputBar, addReminder, setDate, startTime, endTime){
  inputBar.addEventListener('input', () => {
    const inputVal = inputBar.value.trim().length;
    if(inputVal > 0){
      addReminder.disabled = false;
    } else {
      addReminder.disabled = true;
    }
  })

  addReminder.addEventListener('click', () => {
    if(!addReminder.disabled){
      addYourReminder(inputBar, setDate, startTime, endTime);
    }
  })

}

function addYourReminder(inputBar){
  const reminderTitle = inputBar.value;
  const dateSet = setDate.value;

  // get time start AM or PM
  const timeStart = startTime.value; 
  const timeEnd = endTime.value; 
  const dateCreated = dayjs().format('MM/DD/YYYY, HH:mm');

  reminderList.push({
    completed : false,
    title     : reminderTitle,
    dateSet   : dateSet || '',
    timeStart : timeStart || '',
    timeEnd   : timeEnd || '',
    dateCreated
  })
  reminderAdded();
}

function reminderAdded(){
  document.querySelector('.reminder-list').innerHTML = renderReminder() || "You don't have any reminders yet — why not add one to get started?";
}

function renderReminder(){
  const reminderHTML = reminderList.map(reminder => `
    <div class="your-reminder">
      <div class="reminder-body">
        <div class="checkbox">
          <input type="checkbox">
        </div>
        <div class="reminder-box">
          <div class="reminder-title">${reminder.title}</div>
          <div class="reminder-schedule">
            ${reminder.dateSet.length > 0 
              ? `<i class="bi bi-calendar-event"></i> ${reminder.dateSet},` 
              : ''
            }
            
             ${reminder.timeStart} - ${reminder.timeEnd}
          </div>
          <div class="reminder-created">Created ${reminder.dateCreated}</div>
        </div>
      </div>

      <div class="reminder-tools">
        <div class="edit-reminder">
          <i class="bi bi-pencil-square"></i>
        </div>
        <div class="delete-reminder">
          <i class="bi bi-trash"></i>
        </div>
      </div>
    </div>
  `).join('');

  return reminderHTML;
}

