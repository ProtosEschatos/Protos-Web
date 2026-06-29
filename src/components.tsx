/* =============================================
   PROTOS WEB — Reusable Layout Components
   ============================================= */
import { html } from 'hono/html'

/* --- Shared Head --- */
export const Head = (title: string) => html`
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title} | Protos Web</title>
    <meta name="description" content="Professional web design agency. We turn your vision into digital reality that sells." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css" rel="stylesheet" />
    <link href="/static/style.css" rel="stylesheet" />
  </head>
`

/* --- Header --- */
export const Header = (activePage: string) => html`
  <header class="header" id="header">
    <div class="container-wide">
      <div class="header-inner">
        <a href="/" class="logo-link">
          <svg viewBox="0 0 36 36" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="18" r="17" fill="#0d0d1a" stroke="#FF8800" stroke-width="1.5"/>
            <path d="M18,1 A17,17 0 0,1 18,35 A17,17 0 0,0 18,1" fill="#FF6600"/>
          </svg>
          <span>Protos Web</span>
        </a>

        <nav class="desktop-nav">
          <a href="/" class="nav-link ${activePage === 'home' ? 'active' : ''}">HOME</a>
          <a href="/o-meni" class="nav-link ${activePage === 'about' ? 'active' : ''}">ABOUT</a>
          <a href="/proces" class="nav-link ${activePage === 'process' ? 'active' : ''}">PROCESS</a>
          <a href="/portfolio" class="nav-link ${activePage === 'portfolio' ? 'active' : ''}">PORTFOLIO</a>
          <a href="/usluge" class="nav-link ${activePage === 'services' ? 'active' : ''}">SERVICES</a>
          <a href="/blog" class="nav-link ${activePage === 'blog' ? 'active' : ''}">BLOG</a>
          <a href="/kontakt" class="nav-link ${activePage === 'contact' ? 'active' : ''}">CONTACT</a>
        </nav>

        <div class="header-controls">
          <div class="lang-selector">
            <button class="lang-btn" id="langBtn" onclick="toggleLang()">
              <i class="fas fa-globe"></i>
              <span id="currentLang">EN</span>
              <i class="fas fa-chevron-down"></i>
            </button>
            <div class="lang-dropdown" id="langDropdown">
              <button class="lang-option active" onclick="selectLang('en')"><span class="flag">&#127468;&#127463;</span> English</button>
              <button class="lang-option" onclick="selectLang('hr')"><span class="flag">&#127469;&#127479;</span> Hrvatski</button>
              <button class="lang-option" onclick="selectLang('de')"><span class="flag">&#127465;&#127466;</span> Deutsch</button>
              <button class="lang-option" onclick="selectLang('it')"><span class="flag">&#127470;&#127481;</span> Italiano</button>
              <button class="lang-option" onclick="selectLang('es')"><span class="flag">&#127466;&#127480;</span> Espanol</button>
            </div>
          </div>

          <button class="ctrl-btn" onclick="cycleTheme()" aria-label="Toggle theme" id="themeBtn">&#9790;</button>

          <a href="/kontakt" class="btn-cta">GET A QUOTE</a>

          <button class="hamburger" id="hamburger" onclick="toggleMobile()" aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Mobile Menu -->
  <div class="mobile-menu" id="mobileMenu">
    <a href="/" class="mobile-nav-link" onclick="closeMobile()">Home</a>
    <a href="/o-meni" class="mobile-nav-link" onclick="closeMobile()">About</a>
    <a href="/proces" class="mobile-nav-link" onclick="closeMobile()">Process</a>
    <a href="/portfolio" class="mobile-nav-link" onclick="closeMobile()">Portfolio</a>
    <a href="/usluge" class="mobile-nav-link" onclick="closeMobile()">Services</a>
    <a href="/blog" class="mobile-nav-link" onclick="closeMobile()">Blog</a>
    <a href="/kontakt" class="mobile-nav-link gradient-text" onclick="closeMobile()">Kontakt</a>
    <div class="mobile-contact-info">
      <p>contact@protos-design.net</p>
      <p>+385 97 604 39 41</p>
    </div>
  </div>
`

/* --- Footer --- */
export const Footer = () => html`
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <a href="/" class="logo-link" style="margin-bottom: 4px; display: inline-flex;">
            <svg viewBox="0 0 32 32" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="#8b5cf6"/>
              <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="#fff" font-weight="800" font-size="18" font-family="Inter,sans-serif">P</text>
            </svg>
            <span>Protos Web</span>
          </a>
          <p class="footer-brand-desc">Professional web design agency. We turn your vision into digital reality that sells.</p>
          <div class="footer-socials">
            <a href="#" class="footer-social" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
            <a href="#" class="footer-social" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
            <a href="#" class="footer-social" aria-label="Email"><i class="fas fa-envelope"></i></a>
          </div>
        </div>
        <div>
          <h4 class="footer-col-title">Links</h4>
          <div class="footer-links">
            <a href="/" class="footer-link">Home</a>
            <a href="/o-meni" class="footer-link">About</a>
            <a href="/usluge" class="footer-link">Services</a>
            <a href="/portfolio" class="footer-link">Portfolio</a>
            <a href="/proces" class="footer-link">Process</a>
            <a href="/blog" class="footer-link">Blog</a>
            <a href="/kontakt" class="footer-link">Contact</a>
          </div>
        </div>
        <div>
          <h4 class="footer-col-title">Legal</h4>
          <div class="footer-links">
            <a href="#" class="footer-link">Privacy</a>
            <a href="#" class="footer-link">Terms</a>
            <a href="#" class="footer-link">Cookies</a>
          </div>
        </div>
      </div>

      <div class="footer-causes">
        <p>Podrzite projekte koji mijenjaju digitalni Balkan</p>
        <div class="footer-cause-tags">
          <span class="footer-cause-tag"><span class="dot purple"></span> Anti-scam</span>
          <span class="footer-cause-tag"><span class="dot orange"></span> Edukacija</span>
          <span class="footer-cause-tag"><span class="dot cyan"></span> Platforme</span>
        </div>
      </div>

      <div class="footer-bottom">
        <span>&copy; 2025 Protos Web. All rights reserved.</span>
        <span>Made with &#10084; in Zagreb, Croatia</span>
      </div>
    </div>
  </footer>
`

/* --- Client-side JS --- */
export const ClientJS = () => html`
<script>
  // Header scroll
  window.addEventListener('scroll', () => {
    document.getElementById('header').classList.toggle('scrolled', window.scrollY > 20);
  });

  // Language dropdown
  function toggleLang() {
    const btn = document.getElementById('langBtn');
    const dd = document.getElementById('langDropdown');
    btn.classList.toggle('open');
    dd.classList.toggle('open');
  }
  function selectLang(code) {
    document.getElementById('currentLang').textContent = code.toUpperCase();
    document.getElementById('langBtn').classList.remove('open');
    document.getElementById('langDropdown').classList.remove('open');
    localStorage.setItem('protos-lang', code);
  }
  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    const sel = document.querySelector('.lang-selector');
    if (sel && !sel.contains(e.target)) {
      document.getElementById('langBtn')?.classList.remove('open');
      document.getElementById('langDropdown')?.classList.remove('open');
    }
  });

  // Theme
  function cycleTheme() {
    const themes = ['night','day','pro'];
    const icons = { night: '\\u263E', day: '\\u2600', pro: '\\u25C9' };
    const current = localStorage.getItem('protos-theme') || 'night';
    const next = themes[(themes.indexOf(current) + 1) % themes.length];
    localStorage.setItem('protos-theme', next);
    document.getElementById('themeBtn').textContent = icons[next];
  }

  // Mobile menu
  function toggleMobile() {
    document.getElementById('hamburger').classList.toggle('open');
    document.getElementById('mobileMenu').classList.toggle('open');
    document.body.style.overflow = document.getElementById('mobileMenu').classList.contains('open') ? 'hidden' : '';
  }
  function closeMobile() {
    document.getElementById('hamburger').classList.remove('open');
    document.getElementById('mobileMenu').classList.remove('open');
    document.body.style.overflow = '';
  }

  // Restore saved lang
  const savedLang = localStorage.getItem('protos-lang');
  if (savedLang) document.getElementById('currentLang').textContent = savedLang.toUpperCase();
</script>
`
