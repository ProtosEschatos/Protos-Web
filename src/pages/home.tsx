import { html } from 'hono/html'

export const homePage = () => html`
<!-- ===== HERO ===== -->
<section class="hero">
  <div class="hero-bg"></div>
  <div class="hero-stars"></div>
  <div class="container" style="position:relative;z-index:2;">
    <div class="hero-content">
      <p class="hero-label">FAST. FOR YOUR BUSINESS</p>
      <h1 class="hero-title">
        We Turn<br/>visitors into<br/><span class="gradient-word">customers.</span>
      </h1>
      <p class="hero-subtitle">
        Fast, lightweight, and robust websites that work for you.
        All in one place.
      </p>
      <div class="hero-buttons">
        <a href="/kontakt" class="btn-cta">Start build <i class="fas fa-arrow-right" style="margin-left:6px;font-size:0.75rem;"></i></a>
        <a href="/portfolio" class="btn-secondary">View Portfolio <i class="fas fa-arrow-right" style="margin-left:6px;font-size:0.75rem;"></i></a>
      </div>
      <div class="hero-stats">
        <div class="hero-stat">
          <div class="hero-stat-value"><span class="orange">50</span>+</div>
          <div class="hero-stat-label">Projects delivered</div>
        </div>
        <div class="hero-stat">
          <div class="hero-stat-value"><span class="orange">98</span>%</div>
          <div class="hero-stat-label">Client satisfaction</div>
        </div>
        <div class="hero-stat">
          <div class="hero-stat-value">5 <span style="font-size:0.85rem;color:var(--light-muted);">jezika</span></div>
          <div class="hero-stat-label">Multilingual support</div>
        </div>
        <div class="hero-stat">
          <div class="hero-stat-value" style="font-size:1.1rem;font-weight:600;">3D &amp; WebGL</div>
          <div class="hero-stat-label">Interactive experiences</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ===== ABOUT PREVIEW ===== -->
<section class="section section-center">
  <div class="container">
    <p class="section-label">ABOUT US</p>
    <h2 class="section-title">
      Gradimo digitalna rjesenja koja<br/>rastu <span class="highlight">zajedno sa Vama.</span>
    </h2>
    <div style="margin-top:48px;">
      <h3 style="font-size:1.2rem;font-weight:700;margin-bottom:32px;">Goals</h3>
      <div class="grid-3">
        <div class="card" style="text-align:center;">
          <div class="card-icon orange" style="margin:0 auto 16px;">
            <i class="fas fa-desktop"></i>
          </div>
          <div class="card-title">European market</div>
          <div class="card-text">Actively expanding to EU clients through multilingual offerings and knowledge of European standards.</div>
        </div>
        <div class="card" style="text-align:center;">
          <div class="card-icon purple" style="margin:0 auto 16px;">
            <i class="fas fa-cubes"></i>
          </div>
          <div class="card-title">Custom platforms</div>
          <div class="card-text">Building SaaS and custom CRM solutions for niches that still lack a good digital solution in the local market.</div>
        </div>
        <div class="card" style="text-align:center;">
          <div class="card-icon cyan" style="margin:0 auto 16px;">
            <i class="fas fa-shield-halved"></i>
          </div>
          <div class="card-title">Cyber security</div>
          <div class="card-text">Integrating security standards into every project — making every website handling data as safe as possible.</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ===== HOW WE WORK PREVIEW ===== -->
<section class="section section-center" style="background:var(--dark-surface);border-top:1px solid var(--border-subtle);border-bottom:1px solid var(--border-subtle);">
  <div class="container">
    <h2 class="section-title">How <span class="highlight">we work</span></h2>
    <div class="grid-4" style="margin-top:40px;">
      <div style="text-align:center;padding:20px;">
        <div style="font-size:1.8rem;font-weight:800;color:var(--primary);margin-bottom:12px;">01</div>
        <div style="font-size:0.9rem;font-weight:600;color:var(--light);margin-bottom:6px;">We learn your business</div>
        <div style="font-size:0.8rem;color:var(--light-muted);">No sales pitches — we sit down, listen, and understand what you actually need.</div>
      </div>
      <div style="text-align:center;padding:20px;">
        <div style="font-size:1.8rem;font-weight:800;color:var(--secondary);margin-bottom:12px;">02</div>
        <div style="font-size:0.9rem;font-weight:600;color:var(--light);margin-bottom:6px;">Design and strategy on the table</div>
        <div style="font-size:0.8rem;color:var(--light-muted);">Before we write a single line of code, we show you exactly how every page will look.</div>
      </div>
      <div style="text-align:center;padding:20px;">
        <div style="font-size:1.8rem;font-weight:800;color:var(--accent);margin-bottom:12px;">03</div>
        <div style="font-size:0.9rem;font-weight:600;color:var(--light);margin-bottom:6px;">Build and go live</div>
        <div style="font-size:0.8rem;color:var(--light-muted);">You run your business, we build your website — we only reach out when we need a decision.</div>
      </div>
      <div style="text-align:center;padding:20px;">
        <div style="font-size:1.8rem;font-weight:800;color:var(--primary);margin-bottom:12px;">04</div>
        <div style="font-size:0.9rem;font-weight:600;color:var(--light);margin-bottom:6px;">We grow together</div>
        <div style="font-size:0.8rem;color:var(--light-muted);">After launch, we don't disappear — we stay available for whatever you need.</div>
      </div>
    </div>
  </div>
</section>

<!-- ===== DIGITAL INSPIRATION (Portfolio Preview) ===== -->
<section class="section section-center">
  <div class="container">
    <p class="section-label">PORTFOLIO</p>
    <h2 class="section-title">Digital <span class="highlight">Inspiration</span></h2>
    <p class="section-subtitle">Websites that inspire us and the quality standards we strive for</p>

    <!-- Marquee -->
    <div class="marquee-container">
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
        <!-- duplicate for infinite scroll -->
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

    <div class="portfolio-grid" style="margin-top:32px;">
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
    <div class="showcase-banner">
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
        <a href="/portfolio" class="showcase-arrow"><i class="fas fa-arrow-right"></i></a>
      </div>
    </div>
  </div>
</section>

<!-- ===== WHAT WE OFFER PREVIEW ===== -->
<section class="section section-center" style="background:var(--dark-surface);border-top:1px solid var(--border-subtle);border-bottom:1px solid var(--border-subtle);">
  <div class="container">
    <p class="section-label">SERVICES</p>
    <h2 class="section-title">What <span class="highlight">we offer</span></h2>
    <div class="services-grid" style="margin-top:40px;">
      <div class="service-card">
        <div class="service-card-icon" style="background:rgba(255,102,0,0.15);color:var(--primary);"><i class="fas fa-code"></i></div>
        <div>
          <div class="service-card-title">Custom Web Solutions</div>
          <div class="service-card-text">Tailored websites built from scratch with modern technologies, optimized for performance and conversions.</div>
        </div>
      </div>
      <div class="service-card">
        <div class="service-card-icon" style="background:rgba(139,92,246,0.15);color:var(--secondary);"><i class="fas fa-palette"></i></div>
        <div>
          <div class="service-card-title">UI/UX Design</div>
          <div class="service-card-text">Beautiful, intuitive interfaces designed with the user journey in mind. Every pixel has a purpose.</div>
        </div>
      </div>
      <div class="service-card">
        <div class="service-card-icon" style="background:rgba(6,182,212,0.15);color:var(--accent);"><i class="fas fa-shopping-cart"></i></div>
        <div>
          <div class="service-card-title">E-Commerce &amp; Web Apps</div>
          <div class="service-card-text">Full-featured online stores and web applications with payment integration and inventory management.</div>
        </div>
      </div>
      <div class="service-card">
        <div class="service-card-icon" style="background:rgba(255,102,0,0.15);color:var(--primary);"><i class="fas fa-search"></i></div>
        <div>
          <div class="service-card-title">SEO &amp; Marketing</div>
          <div class="service-card-text">Search engine optimization and digital marketing strategies to increase your online visibility.</div>
        </div>
      </div>
      <div class="service-card">
        <div class="service-card-icon" style="background:rgba(139,92,246,0.15);color:var(--secondary);"><i class="fas fa-wrench"></i></div>
        <div>
          <div class="service-card-title">Maintenance</div>
          <div class="service-card-text">Ongoing support, updates, security patches, and performance monitoring to keep your site running smoothly.</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ===== WEB ACADEMY (Blog Preview) ===== -->
<section class="section section-center">
  <div class="container">
    <p class="section-label">BLOG</p>
    <h2 class="section-title">Web Academy</h2>
    <p class="section-subtitle">Free guides on web presence for entrepreneurs</p>
    <div class="blog-grid" style="margin-top:32px;" id="blogGrid">
      <!-- Filled by JS or static -->
      <div class="blog-card">
        <div class="blog-date"><i class="fas fa-calendar"></i> June 15, 2026</div>
        <div class="blog-title-link">Email Marketing — Why Your Subscriber List is Worth More Than Instagram Followers</div>
        <div class="blog-excerpt">1,000 email subscribers are worth more than 10,000 Instagram followers. Email is direct, algorithm-free.</div>
      </div>
      <div class="blog-card">
        <div class="blog-date"><i class="fas fa-calendar"></i> June 15, 2026</div>
        <div class="blog-title-link">Web Analytics — How Do You Know Who Visits Your Site?</div>
        <div class="blog-excerpt">Web analytics shows who visits your site, where they come from, and what they do. Without this data, you're making business...</div>
      </div>
      <div class="blog-card">
        <div class="blog-date"><i class="fas fa-calendar"></i> June 17, 2026</div>
        <div class="blog-title-link">What is a Landing Page and When to Use It for Maximum Impact?</div>
        <div class="blog-excerpt">A landing page is a page with one goal — turning visitors into customers. Ideal for all campaigns.</div>
      </div>
    </div>
    <div style="margin-top:40px;">
      <a href="/blog" class="btn-secondary">View All Articles <i class="fas fa-arrow-right" style="margin-left:6px;"></i></a>
    </div>
  </div>
</section>

<!-- ===== CONTACT CTA ===== -->
<section class="section contact-section" style="padding:100px 0;">
  <div class="contact-bg"></div>
  <div class="container" style="position:relative;z-index:2;">
    <div class="contact-grid">
      <div>
        <p class="section-label">CONTACT</p>
        <h2 class="section-title" style="font-size:clamp(2.5rem,5vw,3.8rem);">Have a project?<br/>Let's talk.</h2>
        <div style="margin-top:40px;">
          <div class="contact-info-item">
            <div class="contact-icon purple"><i class="fas fa-envelope"></i></div>
            <div>
              <div class="contact-detail-label">Email</div>
              <div class="contact-detail-value">contact@protos-design.net</div>
            </div>
          </div>
          <div class="contact-info-item">
            <div class="contact-icon cyan"><i class="fas fa-phone"></i></div>
            <div>
              <div class="contact-detail-label">Phone</div>
              <div class="contact-detail-value">+385 97 604 39 41</div>
            </div>
          </div>
          <div class="contact-info-item">
            <div class="contact-icon orange"><i class="fas fa-location-dot"></i></div>
            <div>
              <div class="contact-detail-label">Location</div>
              <div class="contact-detail-value">Zagreb, Croatia</div>
            </div>
          </div>
        </div>
      </div>
      <div class="contact-form-card">
        <h3 class="form-title">Send an Inquiry</h3>
        <form id="contactForm" onsubmit="return false;">
          <div class="form-row">
            <input type="text" class="form-input" placeholder="Your name" required />
            <input type="email" class="form-input" placeholder="Email address" required />
          </div>
          <div class="form-group">
            <select class="form-select">
              <option value="">Select a service</option>
              <option>Custom Website</option>
              <option>E-Commerce</option>
              <option>Web Application</option>
              <option>UI/UX Design</option>
              <option>SEO &amp; Marketing</option>
              <option>Maintenance</option>
            </select>
          </div>
          <div class="form-group">
            <textarea class="form-textarea" placeholder="Describe your project..."></textarea>
          </div>
          <button type="submit" class="btn-submit">Send Message <i class="fas fa-arrow-right"></i></button>
        </form>
      </div>
    </div>
  </div>
</section>
`
