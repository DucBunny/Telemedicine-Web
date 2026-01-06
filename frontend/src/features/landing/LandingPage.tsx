import { Header } from './components/Header'
import { HeroSection } from './components/HeroSection'
import { TechStack } from './components/TechStack'
import { HowItWorks } from './components/HowItWorks'
import { Features } from './components/Features'
import { AppShowcase } from './components/AppShowcase'
import { Community } from './components/Community'
import { Footer } from './components/Footer'
import './styles.css'

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Header />
      <main>
        <HeroSection />
        <TechStack />
        <HowItWorks />
        <Features />
        <AppShowcase />
        <Community />
      </main>
      <Footer />
    </div>
  )
}
