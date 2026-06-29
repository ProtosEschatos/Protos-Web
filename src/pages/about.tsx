import { html } from 'hono/html'

export const aboutPage = () => html`
<!-- ===== ABOUT HERO ===== -->
<section class="page-hero" style="padding-bottom:40px;">
  <div class="about-hero-bg"></div>
  <div class="container" style="position:relative;z-index:2;">
    <p class="section-label">ABOUT ME</p>
    <h2 class="section-title" style="font-size:clamp(2.2rem,5vw,3.5rem);">
      Gradimo digitalna<br/><span class="highlight">rjesenja koja rastu</span><br/>zajedno sa Vama.
    </h2>
    <p class="section-subtitle" style="margin-bottom:16px;">
      Full Stack Developer &amp; Web Designer from Zagreb. I create modern, fast and visually stunning websites that turn visitors into customers.
    </p>
  </div>
</section>

<!-- ===== BIO + INFO ===== -->
<section class="section" style="padding-top:20px;">
  <div class="container">
    <div class="about-content">
      <div class="about-text">
        <h3>Who I am</h3>
        <p>Full Stack Developer from Zagreb with 5 years of experience building modern web solutions. I work with entrepreneurs and companies across Croatia and Europe — from fast landing pages to complex custom platforms, web shops, and CRM systems.</p>
        <p>Everything I build is custom — no pre-made themes, no compromises on quality. Every project starts from scratch, tailored exactly to your needs and goals.</p>
        <p>Interests: Full stack development, Cross platform web, 3D web experiences, Platform building, Web design, Cyber security.</p>
        <p>Goal: Help local and European businesses find the right web solution — without unnecessary complexity, with a modern interface.</p>
        <p><a href="#" style="display:inline-flex;align-items:center;gap:6px;"><i class="fas fa-book" style="font-size:0.8rem;"></i> Free web presence guides for entrepreneurs &rarr;</a></p>
      </div>
      <div>
        <h3 style="font-size:1.3rem;font-weight:700;margin-bottom:24px;">Info</h3>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">NAME</div>
            <div class="info-value">Dario Imsilovic</div>
          </div>
          <div class="info-item">
            <div class="info-label">LOCATION</div>
            <div class="info-value">Zagreb, Hrvatska</div>
          </div>
          <div class="info-item">
            <div class="info-label">EXPERIENCE</div>
            <div class="info-value">5 years</div>
          </div>
          <div class="info-item">
            <div class="info-label">EMAIL</div>
            <div class="info-value"><a href="mailto:contact@protos-design.net">contact@protos-design.net</a></div>
          </div>
          <div class="info-item">
            <div class="info-label">PHONE</div>
            <div class="info-value">+385 97 604 39 41</div>
          </div>
          <div class="info-item">
            <div class="info-label">LANGUAGES</div>
            <div class="info-value">Croatian, English, Deutsch (basic)</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ===== GOALS ===== -->
<section class="section section-center">
  <div class="container">
    <h2 class="section-title">Goals</h2>
    <div class="grid-3" style="margin-top:40px;">
      <div class="card" style="text-align:center;">
        <div style="font-size:2rem;margin-bottom:16px;">&#127758;</div>
        <div class="card-title">European market</div>
        <div class="card-text">Actively expanding to EU clients through multilingual offerings and knowledge of European standards — GDPR, accessibility, localization.</div>
      </div>
      <div class="card" style="text-align:center;">
        <div style="font-size:2rem;margin-bottom:16px;">&#128187;</div>
        <div class="card-title">Custom platforms</div>
        <div class="card-text">Building SaaS and custom CRM solutions for niches that still lack a good digital solution in the local market.</div>
      </div>
      <div class="card" style="text-align:center;">
        <div style="font-size:2rem;margin-bottom:16px;">&#128272;</div>
        <div class="card-title">Cyber security</div>
        <div class="card-text">Integrating security standards into every project — ensure every website handling data must be protected.</div>
      </div>
    </div>
  </div>
</section>

<!-- ===== SUPPORT BALKANS ===== -->
<section class="section support-section section-center">
  <div class="container">
    <p class="section-label">SUPPORT</p>
    <h2 class="section-title">Projects that change <span class="highlight">the digital Balkans</span></h2>
    <p class="section-subtitle">Every donation contributes to developing a platform for protection against internet fraud and building a freer digital space for our region.</p>
    <div class="support-cards" style="margin-top:40px;">
      <div class="support-card">
        <div class="support-card-icon">&#128737;</div>
        <div class="support-card-title">Cyber Security Education Equipment</div>
        <div class="support-card-text">Help us acquire a server, laptop and software for free online cyber security education — for everyone who wants to learn how to protect themselves online.</div>
        <div class="support-progress"><span>0 &euro;</span><span>of 10,000 &euro;</span></div>
        <div class="progress-bar"><div class="progress-bar-fill" style="width:5%;"></div></div>
        <a href="#" class="btn-support red">Support education</a>
      </div>
      <div class="support-card">
        <div class="support-card-icon">&#128218;</div>
        <div class="support-card-title">Free Digital Education</div>
        <div class="support-card-text">Fund free HR video tutorials and guides on web development, AI tools and digital security.</div>
        <div class="support-progress"><span>0 &euro;</span><span>of 10,000 &euro;</span></div>
        <div class="progress-bar"><div class="progress-bar-fill" style="width:3%;"></div></div>
        <a href="#" class="btn-support green">Support education</a>
      </div>
      <div class="support-card">
        <div class="support-card-icon">&#127760;</div>
        <div class="support-card-title">Regional Digital Platforms</div>
        <div class="support-card-text">Building open source alternatives to global platforms — made for the Balkans, by the Balkans.</div>
        <div class="support-progress"><span>0 &euro;</span><span>of 20,000 &euro;</span></div>
        <div class="progress-bar"><div class="progress-bar-fill" style="width:2%;"></div></div>
        <a href="#" class="btn-support green">Invest in the region</a>
      </div>
    </div>
  </div>
</section>
`
