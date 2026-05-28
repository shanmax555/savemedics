// DOM Content Loaded Initializer
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavbarScroll();
  initMobileMenu();
  initGlassCardHoverEffects();
  initMetricCounters();
  initLiveLedgerSimulator();
  initVerificationLogsSimulator();
});

// DARK / LIGHT THEME TOGGLE
function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  // Apply saved preference on load (default = dark)
  const saved = localStorage.getItem('sm-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('sm-theme', next);
  });
}

// NAVBAR SCROLL SENSING
function initNavbarScroll() {
  const navbar = document.getElementById('mainNavbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// MOBILE MENU TOGGLE
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking outside or on a link
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
      }
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }
}

// GLASS CARD INTERACTIVE HOVER MOUSE TRACKING
function initGlassCardHoverEffects() {
  const cards = document.querySelectorAll('.glass-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

// METRIC COUNTING ANIMATION WITH INTERSECTION OBSERVER
function initMetricCounters() {
  const metrics = [
    { id: 'supporterCount', target: 4850, suffix: '+', speed: 40 },
    { id: 'hospitalCount', target: 120, suffix: '', speed: 15 },
    { id: 'feeCount', target: 0, suffix: '%', speed: 1 },
    { id: 'reachCount', target: 24, suffix: '/7', speed: 1 }
  ];

  const observerOptions = {
    root: null,
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        metrics.forEach(metric => {
          const el = document.getElementById(metric.id);
          if (el && el.innerText === '0' || el.innerText === '24/7' || el.innerText === '0%') {
            animateNumber(el, metric.target, metric.suffix, metric.speed);
          }
        });
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const impactSection = document.getElementById('impact');
  if (impactSection) {
    observer.observe(impactSection);
  }
}

function animateNumber(element, target, suffix, speed) {
  if (target === 0) {
    element.innerText = '0' + suffix;
    return;
  }
  if (element.id === 'reachCount') {
    element.innerText = '24' + suffix;
    return;
  }
  
  let current = 0;
  const increment = Math.ceil(target / 100);
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.innerText = target.toLocaleString() + suffix;
      clearInterval(timer);
    } else {
      element.innerText = current.toLocaleString() + suffix;
    }
  }, speed);
}

// LIVE LEDGER SIMULATOR (DUMMY REAL-TIME TRANSACTIONS)
const dummyUsers = [
  'Aishwarya R.', 'Sameer D.', 'Nikhil P.', 'Karan S.', 'Shruti M.', 
  'Dr. Rohit K.', 'Neha G.', 'Rohan J.', 'Sneha V.', 'Pranav T.'
];
const dummyMissions = ['#1042', '#1039', '#1024'];
const dummyAmounts = [1000, 2500, 5000, 7500, 10000, 15000, 20000];

function initLiveLedgerSimulator() {
  const ledgerContainer = document.getElementById('liveLedger');
  if (!ledgerContainer) return;

  setInterval(() => {
    const user = dummyUsers[Math.floor(Math.random() * dummyUsers.length)];
    const mission = dummyMissions[Math.floor(Math.random() * dummyMissions.length)];
    const amount = dummyAmounts[Math.floor(Math.random() * dummyAmounts.length)];
    
    // Add row
    const newRow = document.createElement('div');
    newRow.className = 'ledger-row';
    newRow.style.opacity = '0';
    newRow.style.transform = 'translateY(10px)';
    newRow.innerHTML = `
      <span class="ledger-user">${user} supported Mission ${mission}</span>
      <span class="ledger-amount">₹${amount.toLocaleString()}</span>
    `;

    // Insert first and shift out oldest
    ledgerContainer.insertBefore(newRow, ledgerContainer.firstChild);
    
    // Fade in
    setTimeout(() => {
      newRow.style.transition = 'all 0.5s ease';
      newRow.style.opacity = '1';
      newRow.style.transform = 'translateY(0)';
    }, 50);

    if (ledgerContainer.children.length > 3) {
      const last = ledgerContainer.lastChild;
      last.style.opacity = '0';
      setTimeout(() => last.remove(), 500);
    }

    // Add supporter to community wall also
    addSupporterToWall(user);
  }, 7000);
}

// SUPPORTER WALL ADDITION
function addSupporterToWall(name) {
  const wall = document.getElementById('supporterWall');
  if (!wall) return;

  const item = document.createElement('div');
  item.className = 'supporter-ticker-item';
  item.style.opacity = '0';
  item.style.transform = 'translateX(-10px)';
  item.innerHTML = `
    <span class="supporter-dot"></span>
    <strong>${name}</strong> supported a patient
    <span class="supporter-time">Just now</span>
  `;

  wall.insertBefore(item, wall.firstChild);

  setTimeout(() => {
    item.style.transition = 'all 0.5s ease';
    item.style.opacity = '1';
    item.style.transform = 'translateX(0)';
  }, 50);

  if (wall.children.length > 5) {
    wall.lastChild.remove();
  }
}

// VERIFICATION STATUS LOGS SIMULATOR
const logTemplates = [
  { text: 'Aadhaar identity match confirmation hash generated: 0x82f2c...', type: 'info' },
  { text: 'Hospital escrow verification handshakes succeeded.', type: 'info' },
  { text: 'Consensus check: 5/5 medical nodes verified diagnosis severity.', type: 'active' },
  { text: 'Double-blind cost audits: Hospital estimations match industry norms.', type: 'info' },
  { text: 'Block index updated. Earmarked patient escrow ledger online.', type: 'active' },
  { text: 'Patient ledger sync request from local Fortis Node.', type: 'info' }
];

function initVerificationLogsSimulator() {
  const logContainer = document.getElementById('verificationLogs');
  if (!logContainer) return;

  setInterval(() => {
    const template = logTemplates[Math.floor(Math.random() * logTemplates.length)];
    const time = new Date().toTimeString().split(' ')[0].substring(0, 5);
    
    const entry = document.createElement('div');
    entry.className = `log-entry ${template.type === 'active' ? 'active' : ''}`;
    entry.innerHTML = `<span>[SYS] ${template.text}</span><span style="color: var(--text-white);">${time}</span>`;
    
    logContainer.appendChild(entry);
    
    // Auto scroll down or pop oldest
    if (logContainer.children.length > 5) {
      logContainer.children[0].remove();
    }
  }, 5000);
}

// DONATION MODAL OPERATION
let currentPatient = '';
let currentMissionId = '';
let targetAmount = 0;
let raisedAmount = 0;

function openDonateModal(name, missionId, target, raised) {
  currentPatient = name;
  currentMissionId = missionId;
  targetAmount = target;
  raisedAmount = raised;

  const modal = document.getElementById('donationModal');
  const modalPatient = document.getElementById('modalPatientName');
  const modalMission = document.getElementById('modalMissionId');
  const formScreen = document.getElementById('formScreen');
  const successScreen = document.getElementById('successScreen');

  if (modal && modalPatient && modalMission) {
    modalPatient.innerText = `Support ${name}`;
    modalMission.innerText = missionId;
    
    // Reset screen states
    formScreen.style.display = 'block';
    successScreen.style.display = 'none';
    
    // Clear inputs
    document.getElementById('donationForm').reset();
    
    modal.classList.add('active');
  }
}

function closeDonateModal() {
  const modal = document.getElementById('donationModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

// HANDLE DONATION SUBMIT
function handleDonationSubmit(event) {
  event.preventDefault();
  
  const nameInput = document.getElementById('supporterName').value;
  const amountInput = parseInt(document.getElementById('donationAmount').value);
  
  if (!nameInput || isNaN(amountInput)) return;

  // Generate random transaction hash
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 32; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  
  // Update modal screen to success
  document.getElementById('formScreen').style.display = 'none';
  const successScreen = document.getElementById('successScreen');
  successScreen.style.display = 'flex';
  document.getElementById('txnHash').innerText = hash.substring(0, 8) + '...' + hash.substring(28);

  // Add transaction directly to ledger stream
  const ledgerContainer = document.getElementById('liveLedger');
  if (ledgerContainer) {
    const newRow = document.createElement('div');
    newRow.className = 'ledger-row';
    newRow.style.borderColor = 'var(--primary-red-solid)';
    newRow.style.boxShadow = '0 0 10px rgba(211,47,47,0.1)';
    newRow.innerHTML = `
      <span class="ledger-user">${nameInput} supported ${currentMissionId}</span>
      <span class="ledger-amount">₹${amountInput.toLocaleString()}</span>
    `;
    ledgerContainer.insertBefore(newRow, ledgerContainer.firstChild);
    
    if (ledgerContainer.children.length > 3) {
      ledgerContainer.lastChild.remove();
    }
  }

  // Update card progress bar in real time (simulated)
  updateCardProgress(currentPatient, amountInput);

  // Add to community supporter wall
  addSupporterToWall(nameInput);
  
  // Increment supporters pre-registered count
  const supporterCountEl = document.getElementById('supporterCount');
  if (supporterCountEl) {
    const currentVal = parseInt(supporterCountEl.innerText.replace(/,/g, ''));
    if (!isNaN(currentVal)) {
      supporterCountEl.innerText = (currentVal + 1).toLocaleString() + '+';
    }
  }
}

function updateCardProgress(patientName, additionalAmount) {
  // Find card containing patient name
  const cards = document.querySelectorAll('.mission-card');
  cards.forEach(card => {
    const nameHeader = card.querySelector('h3');
    if (nameHeader && nameHeader.innerText.includes(patientName)) {
      const progressLabel = card.querySelector('.progress-needed');
      const progressBar = card.querySelector('.progress-bar-fill');
      const progressPercent = card.querySelector('.progress-percent');
      
      if (progressLabel && progressBar && progressPercent) {
        // Parse current raised
        const textParts = progressLabel.innerText.replace(/₹/g, '').split(' / ');
        let currentRaised = parseInt(textParts[0].replace(/,/g, ''));
        const maxLimit = parseInt(textParts[1].replace(/,/g, ''));
        
        if (!isNaN(currentRaised) && !isNaN(maxLimit)) {
          currentRaised = Math.min(currentRaised + additionalAmount, maxLimit);
          const percent = Math.round((currentRaised / maxLimit) * 100);
          
          progressLabel.innerText = `₹${currentRaised.toLocaleString()} / ₹${maxLimit.toLocaleString()}`;
          progressBar.style.width = `${percent}%`;
          progressPercent.innerText = `${percent}%`;
        }
      }
    }
  });
}

// WHATSAPP CONTACT REDIRECT FORM
function handleWhatsAppSubmit(event) {
  event.preventDefault();
  const countryCode = document.getElementById('contactCountryCode').value;
  const phone = document.getElementById('contactPhone').value.trim();
  const message = document.getElementById('contactMessage').value.trim();
  
  if (!phone || !message) return;

  const targetNumber = '919188631390';
  const text = `Hello SaveMEDICS,\n\nSender Phone: +${countryCode} ${phone}\n\nMessage:\n${message}`;
  const encodedText = encodeURIComponent(text);
  
  const whatsappUrl = `https://wa.me/${targetNumber}?text=${encodedText}`;
  window.open(whatsappUrl, '_blank');
}
