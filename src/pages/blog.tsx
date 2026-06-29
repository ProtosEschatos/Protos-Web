import { html } from 'hono/html'

export const blogPage = () => html`
<!-- ===== BLOG HERO ===== -->
<section class="page-hero">
  <div class="page-hero-bg"></div>
  <div class="hero-stars"></div>
  <div class="container" style="position:relative;z-index:2;">
    <p class="section-label">BLOG</p>
    <h2 class="section-title" style="font-size:clamp(2.5rem,6vw,4rem);">Web Academy</h2>
    <p class="section-subtitle">Free guides on web presence for entrepreneurs</p>
  </div>
  <div class="page-hero-waves"></div>
</section>

<!-- ===== BLOG GRID ===== -->
<section class="section">
  <div class="container">
    <div class="blog-grid" id="blogFullGrid">
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
      <div class="blog-card">
        <div class="blog-date"><i class="fas fa-calendar"></i> June 17, 2026</div>
        <div class="blog-title-link">SEO — Why Isn't Your Site on Google's First Page?</div>
        <div class="blog-excerpt">SEO (Search Engine Optimization) is the process of optimizing your website to rank higher in Google results. Without SEO, your sit...</div>
      </div>
      <div class="blog-card">
        <div class="blog-date"><i class="fas fa-calendar"></i> June 18, 2026</div>
        <div class="blog-title-link">How Much Does a Website Cost? Real Price Ranges for 2024</div>
        <div class="blog-excerpt">Website costs range from 300 to 10,000+. The difference isn't random — we explain what you get at each tier.</div>
      </div>
      <div class="blog-card">
        <div class="blog-date"><i class="fas fa-calendar"></i> June 18, 2026</div>
        <div class="blog-title-link">SSL Certificate — What the Browser Lock Means and Why It's Mandatory</div>
        <div class="blog-excerpt">An SSL certificate is a digital security confirmation for your website. Without it, Google penalizes your site and customers do...</div>
      </div>
      <div class="blog-card">
        <div class="blog-date"><i class="fas fa-calendar"></i> June 15, 2026</div>
        <div class="blog-title-link">Responsive Design — Why Mobile Must Be Your Priority</div>
        <div class="blog-excerpt">70%+ of web traffic comes from mobile devices. A site that looks bad on mobile loses most customers.</div>
      </div>
      <div class="blog-card">
        <div class="blog-date"><i class="fas fa-calendar"></i> June 13, 2026</div>
        <div class="blog-title-link">Online Payments — How to Accept Payments Through Your Website</div>
        <div class="blog-excerpt">Payment processing lets you accept card or PayPal payments directly through your website. No middleman, no waiting.</div>
      </div>
      <div class="blog-card">
        <div class="blog-date"><i class="fas fa-calendar"></i> June 14, 2026</div>
        <div class="blog-title-link">Social Media vs Website — Why You Need Both</div>
        <div class="blog-excerpt">An Instagram profile is not a substitute for a website. Algorithms change, profiles get deleted. A website is truly yours.</div>
      </div>
      <div class="blog-card">
        <div class="blog-date"><i class="fas fa-calendar"></i> June 14, 2026</div>
        <div class="blog-title-link">Booking Form — How to Automate Reservations and Save Time</div>
        <div class="blog-excerpt">A booking form lets clients reserve appointments 24/7 without a phone call. Less administration, more business.</div>
      </div>
      <div class="blog-card">
        <div class="blog-date"><i class="fas fa-calendar"></i> June 13, 2026</div>
        <div class="blog-title-link">What is a CMS and Do I Need One for My Website?</div>
        <div class="blog-excerpt">A CMS lets you edit website content yourself without technical knowledge. We explain when it makes sense.</div>
      </div>
      <div class="blog-card">
        <div class="blog-date"><i class="fas fa-calendar"></i> June 13, 2026</div>
        <div class="blog-title-link">Contact Form vs Email — Why a Form Protects Your Business</div>
        <div class="blog-excerpt">Posting your email address directly on your website invites spam bots. A contact form protects your inbox and collects structured...</div>
      </div>
      <div class="blog-card">
        <div class="blog-date"><i class="fas fa-calendar"></i> June 15, 2026</div>
        <div class="blog-title-link">Website vs Web Application — Which Does Your Business Need?</div>
        <div class="blog-excerpt">A website displays information. A web app lets users do things. Which type you need depends on your goals.</div>
      </div>
      <div class="blog-card">
        <div class="blog-date"><i class="fas fa-calendar"></i> June 13, 2026</div>
        <div class="blog-title-link">Web Hosting — Where Your Website Lives and Why It Matters</div>
        <div class="blog-excerpt">Hosting is like renting space for your website. Bad hosting means a slow or unavailable site — and that means lost customers.</div>
      </div>
      <div class="blog-card">
        <div class="blog-date"><i class="fas fa-calendar"></i> June 15, 2026</div>
        <div class="blog-title-link">What is a Website and Does Your Business Even Need One?</div>
        <div class="blog-excerpt">Many business owners wonder if they need a website. Short answer: yes. Long answer — we explain why and for whom it is essentia...</div>
      </div>
      <div class="blog-card">
        <div class="blog-date"><i class="fas fa-calendar"></i> June 17, 2026</div>
        <div class="blog-title-link">What is a Domain and Why Does Every Business Need One?</div>
        <div class="blog-excerpt">A domain is your business's address on the Internet. Without it, customers cannot find you — no matter how good your product is.</div>
      </div>
    </div>
  </div>
</section>
`
