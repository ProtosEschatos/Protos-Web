import { Hono } from 'hono'
import { Head, Header, Footer, ClientJS } from './components'
import { homePage } from './pages/home'
import { processPage } from './pages/process'
import { aboutPage } from './pages/about'
import { portfolioPage } from './pages/portfolio'
import { blogPage } from './pages/blog'
import { contactPage } from './pages/contact'
import { servicesPage } from './pages/services'

const app = new Hono()

// ====== PAGES ======

app.get('/', (c) => {
  return c.html(`<!DOCTYPE html><html lang="en">${Head('Home')}
    <body>${Header('home')}${homePage()}${Footer()}${ClientJS()}</body></html>`)
})

app.get('/proces', (c) => {
  return c.html(`<!DOCTYPE html><html lang="en">${Head('Process')}
    <body>${Header('process')}${processPage()}${Footer()}${ClientJS()}</body></html>`)
})

app.get('/o-meni', (c) => {
  return c.html(`<!DOCTYPE html><html lang="en">${Head('About')}
    <body>${Header('about')}${aboutPage()}${Footer()}${ClientJS()}</body></html>`)
})

app.get('/portfolio', (c) => {
  return c.html(`<!DOCTYPE html><html lang="en">${Head('Portfolio')}
    <body>${Header('portfolio')}${portfolioPage()}${Footer()}${ClientJS()}</body></html>`)
})

app.get('/blog', (c) => {
  return c.html(`<!DOCTYPE html><html lang="en">${Head('Blog')}
    <body>${Header('blog')}${blogPage()}${Footer()}${ClientJS()}</body></html>`)
})

app.get('/kontakt', (c) => {
  return c.html(`<!DOCTYPE html><html lang="en">${Head('Contact')}
    <body>${Header('contact')}${contactPage()}${Footer()}${ClientJS()}</body></html>`)
})

app.get('/usluge', (c) => {
  return c.html(`<!DOCTYPE html><html lang="en">${Head('Services')}
    <body>${Header('services')}${servicesPage()}${Footer()}${ClientJS()}</body></html>`)
})

// ====== API PLACEHOLDERS ======

app.get('/api/content/blog', (c) => {
  return c.json({
    posts: [
      { id: 1, title: 'Email Marketing — Why Your Subscriber List is Worth More Than Instagram Followers', date: 'June 15, 2026', excerpt: '1,000 email subscribers are worth more than 10,000 Instagram followers. Email is direct, algorithm-free.' },
      { id: 2, title: 'Web Analytics — How Do You Know Who Visits Your Site?', date: 'June 15, 2026', excerpt: 'Web analytics shows who visits your site, where they come from, and what they do.' },
      { id: 3, title: 'What is a Landing Page and When to Use It for Maximum Impact?', date: 'June 17, 2026', excerpt: 'A landing page is a page with one goal — turning visitors into customers.' },
      { id: 4, title: "SEO — Why Isn't Your Site on Google's First Page?", date: 'June 17, 2026', excerpt: 'SEO (Search Engine Optimization) is the process of optimizing your website to rank higher.' },
      { id: 5, title: 'How Much Does a Website Cost? Real Price Ranges for 2024', date: 'June 18, 2026', excerpt: 'Website costs range from 300 to 10,000+. The difference isn\'t random.' },
      { id: 6, title: "SSL Certificate — What the Browser Lock Means and Why It's Mandatory", date: 'June 18, 2026', excerpt: 'An SSL certificate is a digital security confirmation for your website.' },
      { id: 7, title: 'Responsive Design — Why Mobile Must Be Your Priority', date: 'June 15, 2026', excerpt: '70%+ of web traffic comes from mobile devices. A site that looks bad on mobile loses most customers.' },
      { id: 8, title: 'Online Payments — How to Accept Payments Through Your Website', date: 'June 13, 2026', excerpt: 'Payment processing lets you accept card or PayPal payments directly through your website.' },
      { id: 9, title: 'Social Media vs Website — Why You Need Both', date: 'June 14, 2026', excerpt: 'An Instagram profile is not a substitute for a website. Algorithms change, profiles get deleted.' },
    ]
  })
})

app.post('/api/contact', async (c) => {
  // Placeholder — wire up your email service later
  const body = await c.req.json()
  return c.json({ success: true, message: 'Message received! We will get back to you soon.' })
})

export default app
