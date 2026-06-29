import { html } from 'hono/html'

export const contactPage = () => html`
<!-- ===== CONTACT PAGE ===== -->
<section class="section contact-section" style="padding-top:120px;min-height:70vh;">
  <div class="contact-page-bg"></div>
  <div class="container" style="position:relative;z-index:2;">
    <div class="contact-grid">
      <div>
        <p class="section-label">CONTACT</p>
        <h2 class="section-title" style="font-size:clamp(2.5rem,5vw,3.8rem);">Have a project?<br/>Let's talk.</h2>
        <div style="margin-top:48px;">
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
        <form id="contactPageForm" onsubmit="submitContact(event)">
          <div class="form-row">
            <input type="text" class="form-input" placeholder="Your name" required name="name" />
            <input type="email" class="form-input" placeholder="Email address" required name="email" />
          </div>
          <div class="form-group">
            <select class="form-select" name="service">
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
            <textarea class="form-textarea" placeholder="Describe your project..." name="message"></textarea>
          </div>
          <button type="submit" class="btn-submit" id="submitBtn">Send Message <i class="fas fa-arrow-right"></i></button>
        </form>
        <div id="formSuccess" style="display:none;text-align:center;padding:24px 0;">
          <div style="font-size:2rem;margin-bottom:12px;">&#10003;</div>
          <p style="font-size:1.1rem;font-weight:600;color:var(--light);">Message sent!</p>
          <p style="font-size:0.9rem;color:var(--light-muted);margin-top:8px;">We'll get back to you within 24 hours.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<script>
async function submitContact(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  try {
    const form = e.target;
    const data = {
      name: form.name.value,
      email: form.email.value,
      service: form.service.value,
      message: form.message.value
    };
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    form.style.display = 'none';
    document.getElementById('formSuccess').style.display = 'block';
  } catch (err) {
    btn.innerHTML = 'Send Message <i class="fas fa-arrow-right"></i>';
    btn.disabled = false;
    alert('Something went wrong. Please try again.');
  }
}
</script>
`
