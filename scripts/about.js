export function toggleAbout(){
  if(!document.querySelector('.about')){
  document.body.insertAdjacentHTML('beforeend', `
      <div class="about">
      <div class="close-about">
        <p>Close</p>
        <i class="fas fa-chevron-down"></i>
      </div>
      <div class="about-header">
        <div class="header-icon">
          <i class="bi bi-bounding-box"></i>
        </div>
        <h1 class="app-name">Your App</h1>
        <p>Your elegant solution for daily management and productivity.</p>
        <p class="version">
          Version 1.0.0
        </p>
      </div>
      <div class="our-mission">
        <p>
          <i class="bi bi-heart"></i> Our Mission
        </p>
        <p>
          We believe that task management should be simple, beautiful, and enjoyable. TaskFlow was created to help people organize their daily activities without the complexity and clutter of traditional task apps. Our focus is on providing a clean, intuitive interface that makes productivity feel effortless.
        </p>
      </div>
      <div class="key-features">
        <p id="keyFeatures">Key Features</p>
        <div class="card-features">
          <div class="icons"><i class="bi bi-bell"></i></div>
          <div class="features-content">
            <p>Your Reminder</p>
            <p>Set reminders for important dates or deadlines.</p>
          </div>
        </div>
        <div class="card-features">
          <div class="icons"><i class="bi bi-journal"></i></div>
          <div class="features-content">
            <p>Your Notes</p>
            <p>Take quick notes, store review materials, or even write your personal diary.</p>
          </div>
        </div>
        <div class="card-features">
          <div class="icons"><i class="bi bi-bullseye"></i></div>
          <div class="features-content">
            <p>Your Goals</p>
            <p>Track your short-term and long-term goals.</p>
          </div>
        </div>
        <div class="card-features">
          <div class="icons"><i class="bi bi-list-check"></i></div>
          <div class="features-content">
            <p>Your Tasks</p>
            <p>Plan your day effectively by adding tasks for specific dates.</p>
          </div>
        </div>
        <div class="card-features">
          <div class="icons-fast"><i class="bi bi-lightning-charge"></i></div>
          <div class="features-content">
            <p>Fast & Responsive</p>
            <p>Lightning-fast performance optimized for mobile.</p>
          </div>
        </div>
        <div class="card-features">
          <div class="icons-privacy"><i class="bi bi-shield-check"></i></div>
          <div class="features-content">
            <p>Privacy First</p>
            <p>Your data stays on your device, completely private.</p>
          </div>
        </div>

      </div>
      <div class="our-values">
        <p class="ourValues">Our Values</p>
        <div class="card-values">
          <div class="icons2-user"><i class="bi bi-heart"></i></div>
          <div class="values-content">
            <p>User Centered</p>
            <p>Every feature is designed with you in mind.</p>
          </div>
        </div>
        <div class="card-values">
          <div class="icons2"><i class="bi bi-people"></i></div>
          <div class="values-content">
            <p>Community Driven</p>
            <p>Built with feedback from users like you.</p>
          </div>
        </div>
        <div class="card-values">
          <div class="icons2"><i class="bi bi-bar-chart"></i></div>
          <div class="values-content">
            <p>Continuous Improvement</p>
            <p>Regular updates and new features.</p>
          </div>
        </div>

      </div>
      <div class="why-us">
        <p class="whyUs">What Makes Us Different</p>
        <ul>
          <li>
            <i class="bi bi-check-circle"></i>
            <p>
              No Account Required:
              <span>
                Start using TaskFlow immediately without signup or registration.
              </span>
            </p>
          </li>
          <li>
            <i class="bi bi-check-circle"></i>
            <p>
              Offline First: 
              <span>
                All your tasks are stored locally on your device for instant access.
              </span>
            </p>
          </li>
          <li>
            <i class="bi bi-check-circle"></i>
            <p>
              Mobile Optimized:
              <span>
                Designed specifically for touch interactions and mobile productivity.
              </span>
            </p>
          </li>
          <li>
            <i class="bi bi-check-circle"></i>
            <p>
              Beautiful UI:
              <span>
                A thoughtfully crafted interface with smooth animations and premium aesthetics.
              </span>
            </p>
          </li>
        </ul>

      </div>
      <div class="credit-section">
        <div class="section-card">
          <div class="section-icon"><i class="bi bi-person"></i></div>
          <p>Built with Passion</p>
          <p>
            Crafted by a passionate solo developer who believes in building tools that inspire productivity and simplify daily routines. Your feedback drives every improvement and update. 
          </p>
        </div>
        <div class="section-card">
          <div class="section-icon-stars"><i class="bi bi-stars"></i></div>
          <p>Thank You for Using <span class="app-name-2">YOUR APP</span></p>
          <p>
            I hope YOUR APP helps you stay organized and productive every day. Have suggestions? I'd love to hear from you!
          </p>
        </div>
      </div>
    </div>
    `);
    closeTab();
  }
}

function closeTab(){
    const aboutTab = document.querySelector('.about');
    const closeBtn = document.querySelector('.close-about');
  closeBtn.addEventListener('click', () => {
    aboutTab.classList.add('close');
    aboutTab.addEventListener('animationend', () => {
      aboutTab.remove();
    })
  })
}

