import { Header } from '@/features/landing/components/Header'
import { HeroSection } from '@/features/landing/components/HeroSection'
import { TechStack } from '@/features/landing/components/TechStack'
import { HowItWorks } from '@/features/landing/components/HowItWorks'
import { Features } from '@/features/landing/components/Features'
import { AppShowcase } from '@/features/landing/components/AppShowcase'
import { Community } from '@/features/landing/components/Community'
import { Footer } from '@/features/landing/components/Footer'
import './styles.css'

export const LandingPage = () => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-sans text-gray-900">
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
