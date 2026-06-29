import { html } from 'hono/html'

export const portfolioPage = () => html`
<!-- ===== PORTFOLIO HERO ===== -->
<section class="page-hero">
  <div class="page-hero-bg"></div>
  <div class="hero-stars"></div>
  <div class="container" style="position:relative;z-index:2;">
    <p class="section-label">PORTFOLIO</p>
    <h2 class="section-title" style="font-size:clamp(2.5rem,6vw,4rem);">Digital <span class="highlight">Inspiration</span></h2>
    <p class="section-subtitle">Websites that inspire us and the quality standards we strive for</p>
  </div>
  <div class="page-hero-waves"></div>
</section>

<!-- ===== MARQUEE ===== -->
<div class="marquee-container" style="margin-top:-20px;">
  <div class="marquee-track">
    <span class="marquee-item">NEXT.JS</span>
    <span class="marquee-item">&bull;</span>
    <span class="marquee-item">TYPESCRIPT</span>
    <span class="marquee-item">&bull;</span>
    <span class="marquee-item">TAILWIND</span>
    <span class="marquee-item">&bull;</span>
    <span class="marquee-item">THREE.JS</span>
    <span class="marquee-item">&bull;</span>
    <span class="marquee-item">FRAMER MOTION</span>
    <span class="marquee-item">&bull;</span>
    <span class="marquee-item">WEBGL</span>
    <span class="marquee-item">&bull;</span>
    <span class="marquee-item">SUPABASE</span>
    <span class="marquee-item">NEXT.JS</span>
    <span class="marquee-item">&bull;</span>
    <span class="marquee-item">TYPESCRIPT</span>
    <span class="marquee-item">&bull;</span>
    <span class="marquee-item">TAILWIND</span>
    <span class="marquee-item">&bull;</span>
    <span class="marquee-item">THREE.JS</span>
    <span class="marquee-item">&bull;</span>
    <span class="marquee-item">FRAMER MOTION</span>
    <span class="marquee-item">&bull;</span>
    <span class="marquee-item">WEBGL</span>
    <span class="marquee-item">&bull;</span>
    <span class="marquee-item">SUPABASE</span>
  </div>
</div>

<!-- ===== PORTFOLIO GRID ===== -->
<section class="section">
  <div class="container">
    <div class="portfolio-grid">
      <div class="portfolio-card">
        <div class="portfolio-thumb"><i class="fas fa-image"></i></div>
        <div class="portfolio-info">
          <div class="portfolio-cat orange">INDUSTRIAL DESIGN</div>
          <div class="portfolio-name">Coating Tools</div>
          <div class="portfolio-desc">30+ years of experience in industrial solutions</div>
        </div>
      </div>
      <div class="portfolio-card">
        <div class="portfolio-thumb"><i class="fas fa-image"></i></div>
        <div class="portfolio-info">
          <div class="portfolio-cat purple">E-COMMERCE CREATIVE</div>
          <div class="portfolio-name">Mood Water</div>
          <div class="portfolio-desc">Take a sip, enjoy the trip - Vibrant brand</div>
        </div>
      </div>
      <div class="portfolio-card">
        <div class="portfolio-thumb"><i class="fas fa-image"></i></div>
        <div class="portfolio-info">
          <div class="portfolio-cat cyan">DIGITAL STUDIO</div>
          <div class="portfolio-name">Estrela Studio</div>
          <div class="portfolio-desc">A people first digital studio</div>
        </div>
      </div>
    </div>

    <!-- Showcase Banner -->
    <div class="showcase-banner" style="margin-top:64px;">
      <div class="showcase-left">
        <div class="showcase-icon"><i class="fas fa-layer-group"></i></div>
        <div>
          <div class="showcase-badge">NEW</div>
          <div class="showcase-title">Portfolio Showcase</div>
          <div class="showcase-desc">Explore our projects through an immersive 3D experience</div>
        </div>
      </div>
      <div class="showcase-right">
        <span class="showcase-action">OPEN GALLERY</span>
        <span class="showcase-arrow"><i class="fas fa-arrow-right"></i></span>
      </div>
    </div>
  </div>
</section>
`
