import { loadDate } from './clock.js';
import { quotes } from '../quotes generator/quotes.js';

// generate random quotes

export function randomQuotes(){
  const randomNum = Math.floor(Math.random() * quotes.length);
  return randomNum;
}

document.querySelector('.quotes').innerHTML = quotes[randomQuotes()];

const dateName = document.querySelector('.date-name');
const startup = document.querySelector('.startup');
const todayQuotes = document.querySelectorAll('.quote-line');
const startupQuotes = document.querySelectorAll('.startup-quote-line');

const id = ['one', 'two', 'three', 'four']
let i = 0;
let k = 0;

// quotes animation logic
export function quotesAnimation(){

  setTimeout(() => {
    dateName.classList.add('anim');
  }, 2500)

  const stopAnim = setInterval(() => {
    if(startupQuotes.length > 0){
      startupQuotes[i].classList.add(`${id[i]}In`);
    }
    todayQuotes[i].classList.add(`${id[i]}In`);

    setTimeout(()=>{
      if(startupQuotes.length > 0){
        startupQuotes[k].classList.add(`${id[k]}Out`);
      }
      todayQuotes[k].classList.add(`${id[k]}Out`);
      k++

      if(k === todayQuotes.length) {
        if(startup) {
          startupQuotes[3].addEventListener('animationend', () => {
            startup.remove();
          }, {once: true})
        }
        
        dateName.classList.add('stopAnim');
      }
    },2500)
    
    i++
    if(i === todayQuotes.length) clearInterval(stopAnim);
    

  }, 2500);

}


// generate time and date
function dateAndTime(){
  const dateData = loadDate();

  const date = dateData.dateString;
  const hr = dateData.hr;
  const mm = dateData.mm;
  const ss = dateData.ss;
  document.querySelector('.current-date').textContent = date;
  document.getElementById('hr').textContent = hr;
  document.getElementById('mn').textContent = mm;
  document.getElementById('ss').textContent = ss;
}

randomQuotes();
quotesAnimation();
dateAndTime();
setInterval(dateAndTime, 1000);
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registered:', reg.scope))
      .catch(err => console.log('SW failed:', err));
  });
}
