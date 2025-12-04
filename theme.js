/* THEME.JS — Handles theme toggle, mobile menu, animations, transitions, scroll-top, form basic validation */

/* ----- Helpers ----- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/* ----- Page overlay (page transition) ----- */
const pageOverlay = $('#pageOverlay');
window.addEventListener('load', () => {
  // Hide overlay to reveal page
  requestAnimationFrame(()=> pageOverlay.classList.add('hide'));
  // Set year in footer
  const y = new Date().getFullYear(); document.getElementById('year').textContent = y;
  // trigger initial observe after small delay
  setTimeout(()=> observeAnimItems(), 120);
});

/* ----- Theme toggle with localStorage ----- */
const themeToggle = $('#themeToggle');
function setTheme(dark){
  if(dark) {
    document.documentElement.classList.add('dark');
    themeToggle.textContent = '☀️';
    localStorage.setItem('theme','dark');
  } else {
    document.documentElement.classList.remove('dark');
    themeToggle.textContent = '🌙';
    localStorage.setItem('theme','light');
  }
}
const saved = localStorage.getItem('theme');
if(saved === 'dark') setTheme(true);

/* Toggle button */
themeToggle.addEventListener('click', ()=> {
  const isDark = document.documentElement.classList.toggle('dark');
  setTheme(isDark);
});

/* ----- Mobile menu toggle ----- */
const hamburger = $('#hamburger');
const mobileMenu = $('#mobileMenu');
hamburger.addEventListener('click', ()=> {
  const open = mobileMenu.classList.toggle('show');
  hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  mobileMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
});

/* Close mobile menu on link click */
document.querySelectorAll('.mobile-link').forEach(a=> a.addEventListener('click', ()=> {
  mobileMenu.classList.remove('show');
  hamburger.setAttribute('aria-expanded','false');
  mobileMenu.setAttribute('aria-hidden','true');
}));

/* ----- Smooth scroll for navigation links (with small page fade effect) ----- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e){
    // internal links only
    const href = this.getAttribute('href');
    if(!href || href === '#') return;
    e.preventDefault();

    // animate overlay briefly to simulate page transition
    pageOverlay.classList.remove('hide');
    setTimeout(()=> {
      const target = document.querySelector(href);
      if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
      setTimeout(()=> pageOverlay.classList.add('hide'), 420);
    }, 180);
  });
});

/* ----- Scroll to top button ----- */
const scrollTopBtn = $('#scrollTop');
window.addEventListener('scroll', () => {
  if(window.scrollY > 400) scrollTopBtn.classList.add('show');
  else scrollTopBtn.classList.remove('show');
});
scrollTopBtn.addEventListener('click', ()=> {
  window.scrollTo({top:0, behavior:'smooth'});
});

/* ----- IntersectionObserver for anim items ----- */
function observeAnimItems(){
  const items = document.querySelectorAll('.anim-item');
  if(!items.length) return;
  const obs = new IntersectionObserver((entries, o)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('inview');
        // optionally unobserve for performance
        o.unobserve(entry.target);
      }
    });
  }, {threshold:0.18});
  items.forEach(i=> obs.observe(i));
}

/* ----- Interactive Hero image: subtle parallax based on mouse move ----- */
const heroMedia = $('#heroMedia');
if(heroMedia){
  const mediaImg = heroMedia.querySelector('img');
  heroMedia.addEventListener('mousemove', (e)=>{
    const rect = heroMedia.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotX = (y - 0.5) * 6; // tilt
    const rotY = (x - 0.5) * -6;
    mediaImg.style.transform = `scale(1.06) rotate(${rotY*0.04}deg) translate3d(${(x-0.5)*10}px, ${(y-0.5)*10*-1}px, 0)`;
    // small glow follow
    const glow = heroMedia.querySelector('.hero-glow');
    if(glow) glow.style.transform = `translate(${(x-0.5)*60}px, ${(y-0.5)*30}px) rotate(12deg)`;
  });
  heroMedia.addEventListener('mouseleave', ()=>{
    const mediaImg = heroMedia.querySelector('img');
    if(mediaImg) mediaImg.style.transform = '';
    const glow = heroMedia.querySelector('.hero-glow');
    if(glow) glow.style.transform = '';
  });
}

/* ----- Basic form validation (client-side) ----- */
const contactForm = document.getElementById('contactForm');
if(contactForm){
  contactForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = contactForm.querySelector('#name').value.trim();
    const email = contactForm.querySelector('#email').value.trim();
    const message = contactForm.querySelector('#message').value.trim();

    if(!name || !email || !message){
      alert('Please complete all fields before sending.');
      return;
    }
    // Simulate success
    alert('Thanks! Your message was sent (demo).');
    contactForm.reset();
  });
}

/* ----- Initial small entrance animations for navbar + hero ----- */
setTimeout(()=> {
  document.querySelectorAll('.fade-init').forEach(el=> el.classList.add('inview'));
}, 140);

/* End of theme.js */
