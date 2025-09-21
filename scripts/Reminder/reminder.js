import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js'

const reminderList = JSON.parse(localStorage.getItem('reminderList')) || [];
export function openReminder(){
  if(!document.querySelector('.reminder-tab')){
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
              <button id="all" class="reminder-filter active">
              All (${renderReminder().allReminder})
              </button>
              <button id="active" class="reminder-filter">Active (4)</button>
              <button id="completed" class="reminder-filter">Completed (0)</button>
            </div>
          </div>

          <div class="reminder-list">

            <!--GENERATE YOUR REMINDER HERE-->
              ${reminderList.length > 0 ? renderReminder().reminderHTML : "You don't have any reminders yet — why not add one to get started?"}
            <!--GENERATE YOUR REMINDER HERE-->

          </div>
        </div>
      `);
      
    const el1 = getElm().create;  
    el1.tabReminder.classList.remove('close')
    el1.tabReminder.classList.add('open');
    el1.tabReminder.addEventListener('animationend', () => {
      el1.closeTab.addEventListener('click', () => {
        el1.tabReminder.classList.add('close')
        el1.tabReminder.classList.remove('open')
        el1.tabReminder.addEventListener('animationend', () => {
          el1.tabReminder.remove();
        }, {once: true})
      }, {once: true})
    })

    reminderList.length > 0 
    ? reminderControl()
    : null;

    toggleDateNTimeSet(el1.dateNtime, el1.dateSet, el1.timeSet);
    reminderListeners(
      el1.inputBar, el1.addReminder, el1.setDate, 
      el1.startTime, el1.endTime, el1.reminderFilter,
      el1.allFilter, el1.activeFilter, el1.completedFilter
    );
  } else {
    return;
  }
}

function getElm(){
  const create = {
    tabReminder       :      document.querySelector('.reminder-tab'),
    closeTab          :      document.querySelector('.toggle-tab'),
    dateNtime         :      document.querySelector('.set-time'),
    dateSet           :      document.querySelector('.reminder-date-set'),
    timeSet           :      document.querySelector('.reminder-time-set'),
    // reminder creation group selector
    inputBar          :      document.querySelector('.input-reminder'),
    addReminder       :      document.querySelector('.add-reminder'),
    setDate           :      document.getElementById('setDate'),
    startTime         :      document.getElementById('startTime'),
    endTime           :      document.getElementById('endTime'),
    // reminder filter group selector
    reminderFilter    :      document.querySelectorAll('.reminder-filter'),
    allFilter         :      document.getElementById('all'),
    activeFilter      :      document.getElementById('active'),
    completedFilter   :      document.getElementById('completed')
  }
  const control = {
    editReminder      :      document.querySelectorAll('.edit-reminder'),
    delReminder      :      document.querySelectorAll('.delete-reminder'),
  }

  return { create, control }
}

function toggleDateNTimeSet(dateNtime, dateSet, timeSet){
  dateNtime.addEventListener('click', toggleAnimation);
  function toggleAnimation(){
    dateSet.classList.toggle('openDateSet');
    timeSet.classList.toggle('openTimeSet');
  }
}

function reminderListeners(inputBar, addReminder, setDate, startTime, endTime, reminderFilter, allFilter){
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
      addYourReminder(inputBar, setDate, startTime, endTime, addReminder, allFilter);
    }
  })

  reminderFilter.forEach(filter => {
    filter.addEventListener('click', () => {
      switch(filter.id){
        case 'all':
          countAllReminder();
          break;
        case 'active':
          countActiveReminder();
          break;
        case 'completed':
          countCompletedReminder();
          break;
      }
    })
  })

}

function reminderControl(){
  const el2 = getElm().control;

  el2.delReminder.forEach(del => {
    del.addEventListener('click', e => {
      e.stopPropagation();
      const id = del.closest('.your-reminder');
      const reminderId = id.dataset.reminderId;
      const index = reminderList.findIndex(reminder => reminder.id === reminderId);
      reminderList.splice(index, 1);
      saveToStorage();
      reminderAdded();
    })
  })
}

function addYourReminder(inputBar, setDate, startTime, endTime, 
  addReminder, allFilter){
  const reminderTitle = inputBar.value;
  const dateSet = setDate.value;

  // generate id for each reminder
  function generateId(length = 5){
    return `${reminderTitle}-` + Math.random().toString(36).substr(2, length);
  };
  const id = generateId();

  // get time start AM or PM
  const timeStart = startTime.value; 
  const timeEnd = endTime.value; 
  const dateCreated = dayjs().format('MM/DD/YYYY, HH:mm');

  reminderList.push({
    id,
    completed : false,
    title     : reminderTitle,
    dateSet   : dateSet || '',
    timeStart : timeStart || '',
    timeEnd   : timeEnd || '',
    dateCreated
  })
  inputBar.value = '';
  addReminder.disabled = true;
  allFilter.innerHTML = `All (${renderReminder().allReminder})`;
  reminderAdded();
  saveToStorage();
}

function saveToStorage(){
  localStorage.setItem('reminderList', JSON.stringify(reminderList));
}

function reminderAdded(){
  const html = reminderList.length > 0 
  ? renderReminder().reminderHTML
  : "You don't have any reminders yet — why not add one to get started?";
  document.querySelector('.reminder-list').innerHTML = html || "You don't have any reminders yet — why not add one to get started?";

  reminderControl();
}

function renderReminder(){
  const reminderHTML = reminderList.map(reminder => `
    <div data-reminder-id="${reminder.id}" class="your-reminder">
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

  const allReminder = `${countAllReminder() > 0 ? countAllReminder() : 0}`;
    
  return { reminderHTML, allReminder };
}

function countAllReminder(){
  const all = reminderList.reduce((acc, reminder) => {
    return acc + (reminder.completed === false ? 1 : 0);
  }, 0)
return all
}

function countActiveReminder(){
  console.log('this is active');
}

function countCompletedReminder(){
  console.log('this is complete');
}
