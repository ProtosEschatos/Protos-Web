import Hero from '@/components/sections/Hero'
import Services from '@/components/sections/Services'
import Process from '@/components/sections/Process'
import Portfolio from '@/components/sections/Portfolio'
import Blog from '@/components/sections/Blog'
import Contact from '@/components/sections/Contact'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Process />
      <Portfolio />
      <Services />
      <Blog />
      <Contact />
    </>
  )
}
