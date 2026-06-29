import { html } from 'hono/html'

export const processPage = () => html`
<!-- ===== PROCESS HERO ===== -->
<section class="page-hero">
  <div class="page-hero-bg"></div>
  <div class="hero-stars"></div>
  <div class="container" style="position:relative;z-index:2;">
    <p class="section-label">OUR PROCESS</p>
    <h2 class="section-title" style="font-size:clamp(2.5rem,6vw,4rem);">How <span class="highlight">we work</span></h2>
    <p class="section-subtitle">
      A transparent process from first contact to launch. Every step is clear, measurable, and tailored to your needs.
    </p>
    <p style="font-size:0.85rem;color:var(--light-muted);margin-top:8px;">Click a step for details</p>
  </div>
  <div class="page-hero-waves"></div>
</section>

<!-- ===== 4 STEPS ===== -->
<section class="section">
  <div class="container">
    <div class="grid-4">
      <div class="process-step">
        <div class="step-number">01</div>
        <div class="step-title">We learn your business</div>
        <div class="step-text">No sales pitches — we sit down, listen, and understand what you actually need.</div>
      </div>
      <div class="process-step">
        <div class="step-number">02</div>
        <div class="step-title">Design and strategy on the table</div>
        <div class="step-text">Before we write a single line of code, we show you exactly how every page will look.</div>
      </div>
      <div class="process-step">
        <div class="step-number">03</div>
        <div class="step-title">Build and go live</div>
        <div class="step-text">You run your business, we build your website — we only reach out when we need a decision.</div>
      </div>
      <div class="process-step">
        <div class="step-number">04</div>
        <div class="step-title">We grow together</div>
        <div class="step-text">After launch, we don't disappear — we stay available for whatever you need.</div>
      </div>
    </div>
  </div>
</section>

<!-- ===== FEATURE CARDS (Speed, Deadlines, Security) ===== -->
<section class="section" style="padding-top:0;">
  <div class="container">
    <div class="feature-cards">
      <div class="feature-card">
        <div class="feature-icon orange"><i class="fas fa-bolt"></i></div>
        <div class="card-title" style="text-align:center;">Speed</div>
        <div class="card-text" style="text-align:center;">Average delivery time is 2-3 weeks for a standard project.</div>
      </div>
      <div class="feature-card">
        <div class="feature-icon purple"><i class="fas fa-clock"></i></div>
        <div class="card-title" style="text-align:center;">Deadlines</div>
        <div class="card-text" style="text-align:center;">We respect agreed deadlines. Each step has a clear timeline.</div>
      </div>
      <div class="feature-card">
        <div class="feature-icon cyan"><i class="fas fa-shield-halved"></i></div>
        <div class="card-title" style="text-align:center;">Security</div>
        <div class="card-text" style="text-align:center;">SSL, backups and best data protection practices are included in every project.</div>
      </div>
    </div>
  </div>
</section>

<!-- ===== CONTACT CTA ===== -->
<section class="section section-center" style="padding-bottom:80px;">
  <div class="container">
    <a href="/kontakt" class="btn-cta" style="padding:16px 40px;font-size:0.9rem;">Contact <i class="fas fa-arrow-right" style="margin-left:8px;"></i></a>
  </div>
</section>

<!-- ===== STATS ===== -->
<section class="section" style="padding-top:0;">
  <div class="container">
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-value">5+</div>
        <div class="stat-label">Years of experience</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">30+</div>
        <div class="stat-label">Completed projects</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">1</div>
        <div class="stat-label">Cross web app in development</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">100%</div>
        <div class="stat-label">Custom code, zero pre-made themes</div>
      </div>
    </div>
  </div>
</section>

<!-- ===== TECHNOLOGIES ===== -->
<section class="section section-center">
  <div class="container">
    <h2 class="section-title">Technologies</h2>
    <div class="tech-tags" style="margin-top:32px;">
      <span class="tech-tag">Next.js</span>
      <span class="tech-tag">TypeScript</span>
      <span class="tech-tag">Three.js</span>
      <span class="tech-tag">Tailwind CSS</span>
      <span class="tech-tag">Framer Motion</span>
      <span class="tech-tag">Supabase</span>
      <span class="tech-tag">Stripe</span>
      <span class="tech-tag">Drizzle ORM</span>
      <span class="tech-tag">Cloudflare</span>
      <span class="tech-tag">Linux / DevOps</span>
    </div>
  </div>
</section>
`
