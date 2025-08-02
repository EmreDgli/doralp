"use client"

import { useEffect, useState, useRef } from "react"

interface CounterItemProps {
  end: number
  label: string
  suffix?: string
  duration?: number
}

// Simple intersection observer hook
function useInView(ref: React.RefObject<HTMLElement>, options?: { once?: boolean }) {
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (options?.once) {
            observer.unobserve(element)
          }
        } else if (!options?.once) {
          setIsInView(false)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [ref, options?.once])

  return isInView
}

function CounterItem({ end, label, suffix = "", duration = 2 }: CounterItemProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      let startTime: number
      let animationFrame: number

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)

        setCount(Math.floor(progress * end))

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate)
        }
      }

      animationFrame = requestAnimationFrame(animate)
      return () => cancelAnimationFrame(animationFrame)
    }
  }, [isInView, end, duration])

  return (
    <div
      ref={ref}
      className={`text-center transition-all duration-600 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-doralp-navy mb-2">
        {count}
        {suffix}
      </div>
      <div className="text-lg md:text-xl text-doralp-gray font-medium">{label}</div>
    </div>
  )
}

export function CounterSection() {
  const counters = [
    { end: 25, label: "Yıllık Deneyim", suffix: "+" },
    { end: 500, label: "Tamamlanan Proje", suffix: "+" },
    { end: 40, label: "Uzman Çalışan", suffix: "+" },
    { end: 100, label: "Müşteri Memnuniyeti", suffix: "%" },
  ]

  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section className="py-16 md:py-24 bg-doralp-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-600 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-doralp-navy mb-4">
            Rakamlarla <span className="text-doralp-gold">Doralp</span>
          </h2>
          <p className="text-lg md:text-xl text-doralp-gray max-w-3xl mx-auto">
            Yılların getirdiği deneyim ve güvenle sektörde öncü konumumuzu sürdürüyoruz
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {counters.map((counter, index) => (
            <CounterItem
              key={index}
              end={counter.end}
              label={counter.label}
              suffix={counter.suffix}
              duration={2 + index * 0.2}
            />
          ))}
        </div>
      </div>
    </section>
  )
}