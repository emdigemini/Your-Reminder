import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js'
import { quotes } from '../quotes generator/quotes.js';

// generate random quotes
const randomNum = Math.floor(Math.random() * quotes.length);
document.querySelector('.quotes').innerHTML = quotes[randomNum]

const dateName = document.querySelector('.date-name');
const todayQuotes = document.querySelectorAll('.quote-line');

const id = ['one', 'two', 'three', 'four']
let i = 0;
let k = 0;

// quotes animation logic
function quotesAnimation(){

  setTimeout(() => {
    dateName.classList.add('anim');
  }, 2500)

  const stopAnim = setInterval(() => {

    todayQuotes[i].classList.add(`${id[i]}In`);

    setTimeout(()=>{
      todayQuotes[k].classList.add(`${id[k]}Out`);
      k++
      if(k === todayQuotes.length) dateName.classList.add('stopAnim');
    },2500)
    
    i++
    if(i === todayQuotes.length) clearInterval(stopAnim);

  }, 2500);

}


// generate time and date
function dateAndTime(){
  const date = dayjs().format('MMM D, YYYY');
  document.querySelector('.date-name').innerHTML = `
    <p>${date}</p>
  `

  const hr = dayjs().format('HH');
  const mm = dayjs().format('mm');
  const ss = dayjs().format('ss');
  document.querySelector('.time').innerHTML = `
    <div id="hr">${hr}</div>
    <div>:</div>
    <div id="mn">${mm}</div>
    <div>:</div>
    <div id="ss">${ss}</div>
  `
}
setInterval(dateAndTime, 1000)


quotesAnimation();
dateAndTime();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registered:', reg.scope))
      .catch(err => console.log('SW failed:', err));
  });
}


