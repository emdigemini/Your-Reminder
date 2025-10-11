export function loadDate(){
  const dt = new Date();
  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();
  const hr = dt.getHours().toString().padStart(2, '0');
  const mm = dt.getMinutes().toString().padStart(2, '0');
  const ss = dt.getSeconds().toString().padStart(2, '0');

  const todayDate = new Date(year, month, day);
  const dateString = todayDate.toLocaleDateString('en-us', {
    weekday: 'short',
    month: 'short',
    year: 'numeric',
    day: '2-digit'
  })
  
  return {dateString, hr, mm, ss};
}