import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js'

const reminderList = JSON.parse(localStorage.getItem('reminderList')) || [];

export function openReminder(){
  if(!document.querySelector('.reminder-tab')){
    document.body.insertAdjacentHTML('afterbegin', `
        <div class="reminder-tab">
          <div class="toggle-tab">
            <h2>Your Reminder</h2>
            <i class="toggle-btn bi bi-caret-down"></i>
          </div>
          <div class="reminder-header">

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
              <button id="active" class="reminder-filter">
                Active (${renderReminder().activeReminder})
              </button>
              <button id="completed" class="reminder-filter">
                Completed (${renderReminder().completedReminder})
              </button>
            </div>
          </div>

          <div class="reminder-list">

            <!--GENERATE YOUR REMINDER HERE-->
              ${reminderList.length > 0 ? renderReminder().reminderHTML : emptyState().noReminder}
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
    ? allReminderTool()
    : null;

    toggleDateNTimeSet(el1.dateNtime, el1.dateSet, el1.timeSet);
    reminderListeners(
      el1.inputBar, el1.addReminder, el1.setDate, 
      el1.startTime, el1.endTime, el1.reminderFilter,
      el1.allFilter, el1.activeFilter, el1.completedFilter
    );
  } else if(document.querySelector('.reminder-tab')){
    document.getElementById('all').innerHTML = `All (${renderReminder().allReminder})`;
    document.getElementById('active').innerHTML = `Active (${renderReminder().activeReminder})`;
    document.getElementById('completed').innerHTML = `Completed (${renderReminder().completedReminder})`;
  } else {
    return;
  }
}

function getElm(){
  const create = {
    tabReminder       :      document.querySelector('.reminder-tab'),
    closeTab          :      document.querySelector('.toggle-btn'),
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
    currentTitle      :      document.querySelectorAll('.reminder-title'),
    checkbox          :      document.querySelectorAll('.checkbox'),
    delReminder       :      document.querySelectorAll('.delete-reminder'),
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

function reminderListeners(inputBar, addReminder, setDate, startTime, endTime, 
  reminderFilter, allFilter, activeFilter, completedFilter){
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
      addYourReminder(inputBar, setDate, startTime, endTime, addReminder, 
        allFilter, activeFilter, completedFilter);
    }
  })

  reminderFilter.forEach(filter => {
    filter.addEventListener('click', () => {
      filterBtn(filter, reminderFilter);
    })
  })

}

function allReminderTool(){
  const el2 = getElm().control;

  el2.checkbox.forEach(cb => {
    cb.addEventListener('change', e => {
      const container = cb.closest('.your-reminder');
      const reminderId = container.dataset.reminderId;
      if(e.target.checked){
        const reminder = reminderList.find(r => r.id === reminderId);
        reminder.completed = true;
        updateReminder()
        reminderAdded();
      } else {
        const reminder = reminderList.find(r => r.id === reminderId);
        reminder.completed = false;
        updateReminder()
        reminderAdded();
      }
    })
  })

  el2.delReminder.forEach(del => {
    del.addEventListener('click', e => {
      e.stopPropagation();
      const container = del.closest('.your-reminder');
      const reminderId = container.dataset.reminderId;
      const index = reminderList.findIndex(r => r.id === reminderId);
      reminderList.splice(index, 1);
      updateReminder()
      reminderAdded();
    })
  })
}

function activeReminderTool(){
  const el2 = getElm().control;

  el2.checkbox.forEach(cb => {
    cb.addEventListener('change', e => {
      const container = cb.closest('.your-reminder');
      const reminderId = container.dataset.reminderId;
      if(e.target.checked){
        const reminder = reminderList.find(r => r.id === reminderId);
        reminder.completed = true;
        updateReminder();
        countActiveReminder();
      } else {
        const reminder = reminderList.find(r => r.id === reminderId);
        reminder.completed = false;
        console.log('unchecked');
        updateReminder();
        countActiveReminder();
      }
    })
  })

  el2.delReminder.forEach(del => {
    del.addEventListener('click', e => {
      e.stopPropagation();
      const container = del.closest('.your-reminder');
      const reminderId = container.dataset.reminderId;
      const index = reminderList.findIndex(r => r.id === reminderId);
      reminderList.splice(index, 1);
      updateReminder();
      countActiveReminder();
    })
  })
}

function completedReminderTool(){
  const el2 = getElm().control;

  el2.checkbox.forEach(cb => {
    cb.addEventListener('change', e => {
      const container = cb.closest('.your-reminder');
      const reminderId = container.dataset.reminderId;
      if(e.target.checked){
        const reminder = reminderList.find(r => r.id === reminderId);
        reminder.completed = true;
        updateReminder();
        countCompletedReminder();
      } else {
        const reminder = reminderList.find(r => r.id === reminderId);
        reminder.completed = false;
        console.log('unchecked');
        updateReminder();
        countCompletedReminder();
      }
    })
  })

  el2.delReminder.forEach(del => {
    del.addEventListener('click', e => {
      e.stopPropagation();
      const container = del.closest('.your-reminder');
      const reminderId = container.dataset.reminderId;
      const index = reminderList.findIndex(r => r.id === reminderId);
      reminderList.splice(index, 1);
      updateReminder()
      countCompletedReminder();
    })
  })
}

function updateReminder(){
  reminderList.sort((a, b) => b.timeCreated - a.timeCreated);
  reminderList.sort((a, b) => a.completed - b.completed);
  saveToStorage();
  openReminder();
}

function addYourReminder(inputBar, setDate, startTime, endTime, 
  addReminder, allFilter, activeFilter, completedFilter){
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
  const dateCreated = dayjs().format('MM/DD/YYYY HH:mm');

  reminderList.unshift({
    id,
    completed : false,
    title     : reminderTitle,
    dateSet   : dateSet || '',
    timeStart : timeStart || '',
    timeEnd   : timeEnd || '',
    timeCreated: Date.now(),
    dateCreated,
  })
  inputBar.value = '';
  addReminder.disabled = true;
  allFilter.innerHTML = `All (${renderReminder().allReminder})`;
  activeFilter.innerHTML = `Active (${renderReminder().activeReminder})`;
  completedFilter.innerHTML = `Completed (${renderReminder().completedReminder})`;
  reminderAdded();
  saveToStorage();
}

function saveToStorage(){
  localStorage.setItem('reminderList', JSON.stringify(reminderList));
}

function reminderAdded(){
  const html = reminderList.length > 0 
  ? renderReminder().reminderHTML
  : emptyState().noReminder;

  document.querySelector('.reminder-list').innerHTML = html;
  allReminderTool();
}

function renderReminder(){
  const reminderHTML = reminderList.map(reminder => `
    <div data-reminder-id="${reminder.id}" class="your-reminder 
    ${reminder.completed
      ? 'completed'
      : ''
    }">
      <div class="reminder-body">
        <div class="checkbox">
          <input type="checkbox" 
          ${reminder.completed
            ? 'checked'
            : ''
          }>
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
        <div class="delete-reminder">
          <i class="bi bi-trash"></i>
        </div>
      </div>
    </div>
  `).join('');

  const allReminder = `${countYourReminder().all > 0 ? countYourReminder().all : 0}`;
  const activeReminder = `${countYourReminder().active > 0 ? countYourReminder().active : 0}`;
  const completedReminder = `${countYourReminder().completed > 0 ? countYourReminder().completed : 0}`;
  return { reminderHTML, allReminder, activeReminder, completedReminder };
}

function countActiveReminder(){
  const getActiveReminder = reminderList.filter(reminder => !reminder.completed);
  const renderActiveReminder = getActiveReminder.map(reminder => `
    <div data-reminder-id="${reminder.id}" class="your-reminder 
    ${reminder.completed
      ? 'completed'
      : ''
    }">
      <div class="reminder-body">
        <div class="checkbox">
          <input type="checkbox"
          ${reminder.completed
            ? 'checked'
            : ''
          }>
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
        <div class="delete-reminder">
          <i class="bi bi-trash"></i>
        </div>
      </div>
    </div>
  `).join('');

  document.querySelector('.reminder-list').innerHTML = `${renderActiveReminder.length > 0 
    ? renderActiveReminder : emptyState().noActive}`;
  activeReminderTool();
}

function countCompletedReminder(){
  const getCompletedReminder = reminderList.filter(reminder => reminder.completed);
  const renderCompletedReminder = getCompletedReminder.map(reminder => `
    <div data-reminder-id="${reminder.id}" class="your-reminder 
    ${reminder.completed
      ? 'completed'
      : ''
    }">
      <div class="reminder-body">
        <div class="checkbox">
          <input type="checkbox"
          ${reminder.completed
            ? 'checked'
            : ''
          }>
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
        <div class="delete-reminder">
          <i class="bi bi-trash"></i>
        </div>
      </div>
    </div>
  `).join('');
  
  document.querySelector('.reminder-list').innerHTML  = `${renderCompletedReminder.length > 0 
    ? renderCompletedReminder : emptyState().noCompleted}`;

  completedReminderTool();
  return {getCompletedReminder};
}

function emptyState(){
  return {
    noReminder:
    `
      <div class='empty-state'>
        <h3>
          &#10024;
            Ready, Set, Remind!
          &#10024;
        </h3>
        <p>You don't have any reminders yet — why not add one to get started?</p>
      </div>
    `
    ,
    noActive:
    `
      <div class='empty-state'>
        <h3>
          &#10024;
            Nothing left to do!
          &#10024;
        </h3>
        <p>Nothing to do here! Enjoy the moment, you've been productive.</p>
      </div>
    `,
    noCompleted: 
    `
      <div class='empty-state'>
        <h3>
          &#10024;
            Nothing completed yet
          &#10024;
        </h3>
        <p>Zero completed reminders. Let's make some progress today!</p>
      </div>
    `,
  }
}

// function reminderEdit(newTitle, currentTitle, edit){
//   currentTitle.forEach(el => {
//     const container = el.closest('.your-reminder');
//     const getId = container.dataset.reminderId;
//     const newEl = document.createElement('input');
//     const save = document.createElement('i');
//     save.setAttribute('class', 'bi bi-check2-square');
//     if(getId === newTitle.id){
//       edit.classList.add('on-edit');
//       el.replaceWith(newEl);
//     }
//   })
// }


function filterBtn(filter, reminderFilter){
  reminderFilter.forEach(btn => btn.classList.remove('active'));
  filter.classList.add('active');
  switch(filter.id){
    case 'active':
      countActiveReminder();
      break;
    case 'completed':
      countCompletedReminder();
      break;
    default:
      reminderAdded();
  }
}

function countYourReminder(){
  const all = reminderList.length;
  const active = reminderList.reduce((acc, reminder) => {
    return acc + (reminder.completed === false ? 1 : 0);
  }, 0);
  const completed = reminderList.reduce((acc, reminder) => {
    return acc + (reminder.completed ? 1 : 0);
  }, 0);
  return { all, active, completed }
}