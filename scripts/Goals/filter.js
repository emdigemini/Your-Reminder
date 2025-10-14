import { Goal, yourGoals, getElm, renderGoal, updateProgressBar, sortItem, addGoalListListener } from "./goals.js";

/*===============FILTER FUNCTION===============*/
export let filterState = { status: 'allGoal', category: '' }

export function updateGoalCounts(){
  const count = getElm();
  const group = [count.btn.allGoal, count.btn.activeGoal, count.btn.completedGoal];

  count.btn.allGoal.textContent = `🎯All (${yourGoals.length})`;
  count.btn.activeGoal.textContent = `⚡Active (${yourGoals.filter(g => !g.completed).length})`;
  count.btn.completedGoal.textContent = `✨Completed (${yourGoals.filter(g => g.completed).length})`;
}

export function updateCategoryCounts(filtered){
  const count = getElm();
  const group = [count.btn.health, count.btn.career, count.btn.personal, count.btn.financial];

  if(filtered){
    group.forEach(cat => {
      cat.textContent = `${cat.value} (${filtered.filter(g => g.category === cat.value).length})`;
    });
    return;
  }

  group.forEach(cat => {
    cat.textContent = `${cat.value} (${yourGoals.filter(g => g.category === cat.value).length})`;
  })
}

export function countGoalCompleted(){
  const count = document.querySelector('.completed_count');
  count.innerHTML = yourGoals.filter(g => g.completed).length;
};

export function filterGoal(){
  const filterBtn = getElm();
  const groupCat = [filterBtn.btn.health, filterBtn.btn.career, filterBtn.btn.personal, filterBtn.btn.financial];
  const groupFilter = [filterBtn.btn.allGoal, filterBtn.btn.activeGoal, filterBtn.btn.completedGoal];

  groupFilter.forEach(f => {
    f.addEventListener('click', function(){
      filterState.status = this.id;
      groupFilter.forEach(e => e.classList.remove('active'));
      this.classList.add('active');

      if(this.id === 'allGoal'){
        groupCat.forEach(e => e.classList.remove('active'));
        filterState.category = '';
        renderGoal();
        return;
      }
      applyFilters();
    })
  })
}

export function filterCategory(){
  const go = getElm();
  const group = [go.btn.health, go.btn.career, go.btn.personal, go.btn.financial];

  group.forEach(cat => {
    cat.addEventListener('click', function(){
      filterState.category = this.value;
      group.forEach(e => e.classList.remove('active'));
      this.classList.add('active');
      applyFilters();
    })
  })
}

export function applyFilters(){
  let filtered = [...yourGoals];
  
  // Filter by status
  if(filterState.status === 'activeGoal') {
    filtered = filtered.filter(g => !g.completed);
  } else if (filterState.status === 'completedGoal') {
    filtered = filtered.filter(g => g.completed);
  }
  updateGoalCounts();
  updateCategoryCounts(filtered);
  // Filter by category
  if(filterState.category) {
    filtered = filtered.filter(g => g.category === filterState.category);
  }
  
  sortItem(filtered);
  Goal.renderFilteredList(filtered);
  updateProgressBar(filtered);
  addGoalListListener();
} 

/*===============END OF FILTER FUNCTION===============*/