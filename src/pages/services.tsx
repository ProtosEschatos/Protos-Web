import { html } from 'hono/html'

export const servicesPage = () => html`
<!-- ===== SERVICES HERO ===== -->
<section class="page-hero">
  <div class="page-hero-bg"></div>
  <div class="hero-stars"></div>
  <div class="container" style="position:relative;z-index:2;">
    <p class="section-label">SERVICES</p>
    <h2 class="section-title" style="font-size:clamp(2.5rem,6vw,4rem);">What <span class="highlight">we offer</span></h2>
    <p class="section-subtitle">Professional web solutions tailored to your business needs. From concept to launch and beyond.</p>
  </div>
  <div class="page-hero-waves"></div>
</section>

<!-- ===== SERVICES GRID ===== -->
<section class="section">
  <div class="container">
    <div class="services-grid">
      <div class="service-card">
        <div class="service-card-icon" style="background:rgba(255,102,0,0.15);color:var(--primary);"><i class="fas fa-code"></i></div>
        <div>
          <div class="service-card-title">Custom Web Solutions</div>
          <div class="service-card-text">Tailored websites built from scratch with modern technologies, optimized for performance and conversions. No templates, no compromises — every project is 100% custom.</div>
        </div>
      </div>
      <div class="service-card">
        <div class="service-card-icon" style="background:rgba(139,92,246,0.15);color:var(--secondary);"><i class="fas fa-palette"></i></div>
        <div>
          <div class="service-card-title">UI/UX Design</div>
          <div class="service-card-text">Beautiful, intuitive interfaces designed with the user journey in mind. Every pixel has a purpose. We design experiences that convert visitors into loyal customers.</div>
        </div>
      </div>
      <div class="service-card">
        <div class="service-card-icon" style="background:rgba(6,182,212,0.15);color:var(--accent);"><i class="fas fa-shopping-cart"></i></div>
        <div>
          <div class="service-card-title">E-Commerce &amp; Web Apps</div>
          <div class="service-card-text">Full-featured online stores and web applications with payment integration, inventory management, and customer dashboards. Everything you need to sell online.</div>
        </div>
      </div>
      <div class="service-card">
        <div class="service-card-icon" style="background:rgba(255,102,0,0.15);color:var(--primary);"><i class="fas fa-search"></i></div>
        <div>
          <div class="service-card-title">SEO &amp; Marketing</div>
          <div class="service-card-text">Search engine optimization and digital marketing strategies to increase your online visibility. We make sure your customers can find you on Google.</div>
        </div>
      </div>
      <div class="service-card">
        <div class="service-card-icon" style="background:rgba(139,92,246,0.15);color:var(--secondary);"><i class="fas fa-robot"></i></div>
        <div>
          <div class="service-card-title">AI &amp; Scheduling</div>
          <div class="service-card-text">Smart integrations including AI chatbots, automated booking systems, and intelligent workflows to save you time and serve your clients better.</div>
        </div>
      </div>
      <div class="service-card">
        <div class="service-card-icon" style="background:rgba(6,182,212,0.15);color:var(--accent);"><i class="fas fa-wrench"></i></div>
        <div>
          <div class="service-card-title">Maintenance</div>
          <div class="service-card-text">Ongoing support, updates, security patches, and performance monitoring to keep your site running smoothly 24/7. We don't disappear after launch.</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ===== CTA ===== -->
<section class="section section-center" style="padding-top:0;">
  <div class="container">
    <h2 class="section-title" style="font-size:1.8rem;">Ready to start your project?</h2>
    <p class="section-subtitle" style="margin-bottom:32px;">Get a free consultation and quote — no strings attached.</p>
    <a href="/kontakt" class="btn-cta" style="padding:16px 40px;font-size:0.9rem;">Get a Quote <i class="fas fa-arrow-right" style="margin-left:8px;"></i></a>
  </div>
</section>
`
