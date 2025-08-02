import { HeroSlider } from "@/components/hero-slider"
import { CounterSection } from "@/components/counter-section"
import { AboutUsSection } from "@/components/about-us-section"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSlider />
      <CounterSection />
      <AboutUsSection />
    </div>
  )
}
