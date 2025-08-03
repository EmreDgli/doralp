import { HeroSlider } from "@/components/hero-slider"
import { CounterSection } from "@/components/counter-section"
import { AboutUsSection } from "@/components/about-us-section"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <div className="animate-fade-in">
        <HeroSlider />
      </div>
      <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <CounterSection />
      </div>
      <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <AboutUsSection />
      </div>
    </div>
  )
}
