export function toggleContact(){
  if(!document.querySelector('.contact')){
    document.body.insertAdjacentHTML('beforeend', `
      <div class="contact">
      <div class="close-btn">
        <p>Close</p>
        <i class="close-contact fas fa-chevron-down"></i>
      </div>
      <div class="contact-header">
        <div class="mail-icon"><i class="bi bi-envelope-paper-fill"></i></div>
        <p>Contact Me</p>
        <p>Have questions or feedback? I'd love to hear from you. Send a message and I'll respond as soon as possible.</p>
      </div>
      <div class="contact-box">
        <div class="box-input">
          <label for="name">
            <i class="bi bi-person"></i>
            Your Name
          </label>
          <input id="name" type="text" placeholder="John Cena">
        </div>
        <div class="box-input">
          <label for="email">
            <i class="bi bi-envelope"></i>
            Email Address
          </label>
          <input id="email" type="email" placeholder="johnsee@example.com">
        </div>
        <div class="box-input">
          <label for="subject">
            <i class="bi bi-chat-right"></i>
            Subject
          </label>
          <input id="subject" type="text" placeholder="What is this about?">
        </div>
        <div class="box-input">
          <label for="message">
            <i class="bi bi-chat-right"></i>
            Message
          </label>
          <input id="message" type="text" placeholder="Leave your message here...">
        </div>
        <button id="sendMsg"><i class="bi bi-send"></i> Send Message</button>
      </div>
      <div class="other-card">
        <p>Other Ways to Reach Me</p>
        <div class="acc-card" id="igAcc">
          <i class="bi bi-instagram"></i>
          <div class="card-acc">
            <p>Instagram</p>
            <p>@emdi.gem</p>
          </div>
        </div>
        <div class="acc-card">
          <i class="bi bi-chat-right-dots"></i>
          <div class="card-acc">
            <p>Response Time</p>
            <p>Usually within 24 hours</p>
          </div>
        </div>
      </div>
    </div>
    `);
    closeContact();
    sendMessage();
    goToIg();
  }
}

function closeContact(){
  const contactTab = document.querySelector('.contact');
  document.querySelector('.close-btn').addEventListener('click', () => {
    contactTab.classList.add('close');
    contactTab.addEventListener('animationend', () => {
      contactTab.remove();
    })
  })
}

function sendMessage(){
  document.getElementById('sendMsg').addEventListener('click', () => {
    if(inputValidation()){
      alert('Please complete all required fields before submitting.')
      return
    }
    let parms = {
      client_name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      subject:  document.getElementById('subject').value,
      message: document.getElementById('message').value
    }

    emailjs.send('service_jff7blh', 'template_ts32kjk', parms).then(alert('Got it! Thanks for getting in touch 😊'));
    clearInput();
  })
}

function inputValidation(){
  const client_name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const subject =  document.getElementById('subject').value;
  const message = document.getElementById('message').value;
  if(client_name === '' || email === ''
    || subject === '' || message === ''
  ){
    return true;
  }
}

function clearInput(){
  document.getElementById('name').value = '';
  document.getElementById('email').value = '';
  document.getElementById('subject').value = '';
  document.getElementById('message').value = '';
}

function goToIg(){
  document.getElementById('igAcc').addEventListener('click', () => {
    window.open('https://instagram.com/emdi.gem', '_blank');
  });
}