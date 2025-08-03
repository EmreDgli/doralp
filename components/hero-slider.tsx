"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import Link from "next/link"
import Image from "next/image"
import { sliderApi } from "@/lib/api"
import type { Slide } from "../types/slide"
import { 
  FileText, 
  HandHeart, 
  Factory, 
  Target, 
  BookOpen 
} from "lucide-react"

export function HeroSlider() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [homeContent, setHomeContent] = useState({
    hero: {
      title: 'Doralp Yapı',
      subtitle: 'Güvenilir İnşaat Çözümleri',
      description: '25 yıllık deneyimle kaliteli inşaat hizmetleri sunuyoruz'
    }
  })

  const services = [
    {
      id: "projects",
      title: "Projeler",
      icon: FileText,
      href: "/projeler",
      delay: 0.8
    },
    {
      id: "services",
      title: "Bilgi Toplumu Hizmetleri",
      icon: HandHeart,
      href: "https://mths.ttr.com.tr/firmabilgileri.aspx?mersis=0310003990900026",
      delay: 0.9
    },
    {
      id: "factory",
      title: "Fabrika",
      icon: Factory,
      href: "/fabrika",
      delay: 1.0
    },
    {
      id: "new-project",
      title: "Yeni Proje!",
      icon: Target,
      href: "/iletisim",
      delay: 1.1
    },
    {
      id: "catalog",
      title: "e-Catalog English",
      icon: BookOpen,
      href: "https://www.doralp.com.tr/Doralp_En.pdf",
      delay: 1.2
    }
  ]

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const data = await sliderApi.getActiveSlides()
        setSlides(data)
      } catch (error) {
        console.error("Slides yüklenirken hata:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSlides()
  }, [])

  // Ana sayfa içeriğini localStorage'dan yükle
  useEffect(() => {
    const savedContent = localStorage.getItem('homeContent')
    if (savedContent) {
      try {
        const parsedContent = JSON.parse(savedContent)
        setHomeContent(parsedContent)
      } catch (error) {
        console.error('Home content parse error:', error)
      }
    }
  }, [])

  useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  // Auto-scroll functionality
  useEffect(() => {
    if (!api || slides.length <= 1) {
      return
    }

    const autoScroll = setInterval(() => {
      api.scrollNext()
    }, 5000) // 5 seconds

    return () => clearInterval(autoScroll)
  }, [api, slides.length])

  if (loading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-doralp-navy/90"></div>
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-white mt-4">Yükleniyor...</p>
        </div>
      </section>
    )
  }

  if (!slides || slides.length === 0) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/herosection-doralp-foto.jpg"
            alt="Endüstriyel Çelik Yapı"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-doralp-navy/70"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex items-center justify-center h-full">
          <div className="space-y-4 md:space-y-6 lg:space-y-8 -mt-16 md:-mt-24 lg:-mt-32 px-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              {homeContent.hero.title}
              <br />
              <span className="text-doralp-gold">{homeContent.hero.subtitle}</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              {homeContent.hero.description}
            </p>
            <Button size="lg" className="bg-doralp-gold hover:bg-doralp-gold/90 text-white px-8 py-3 text-lg">
              <Link href="/projeler">Projelerimizi İnceleyin</Link>
            </Button>

            {/* Services Navigation */}
            <div className="w-full max-w-6xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
                {services.map((service) => (
                  <div key={service.id} className="group">
                    <Link 
                      href={service.href}
                      target={service.href.startsWith('http') ? "_blank" : "_self"}
                      rel={service.href.startsWith('http') ? "noopener noreferrer" : ""}
                    >
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 text-center hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40">
                        <div className="flex flex-col items-center space-y-2 md:space-y-3">
                          {/* Icon */}
                          <div className="w-8 h-8 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-doralp-gold/30 transition-all duration-300">
                            <service.icon className="w-4 h-4 md:w-6 md:h-6 text-white" />
                          </div>
                          
                          {/* Text */}
                          <div>
                            <h3 className="text-xs md:text-sm font-medium text-white group-hover:text-doralp-gold transition-colors duration-300">
                              {service.title}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative min-h-screen overflow-hidden">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full h-screen"
      >
        <CarouselContent className="h-screen">
          {slides.map((slide, index) => (
            <CarouselItem key={slide.id} className="h-screen">
              <div className="relative h-full flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={slide.image_url}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-doralp-navy/70"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex items-center justify-center h-full">
                  <div className="space-y-4 md:space-y-6 lg:space-y-8 -mt-16 md:-mt-24 lg:-mt-32 px-4">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                      {slide.title}
                    </h1>

                    {slide.subtitle && (
                      <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                        {slide.subtitle}
                      </p>
                    )}

                    {/* Buttons - support both new buttons array and legacy button_text/button_url */}
                    {((slide.buttons && slide.buttons.length > 0) || (slide.button_text && slide.button_url)) && (
                      <div className="flex flex-wrap gap-4 justify-center">
                        {slide.buttons && slide.buttons.length > 0 ? (
                          // New buttons array
                          slide.buttons.map((button, buttonIndex) => (
                            <Button 
                              key={button.id || buttonIndex}
                              size="lg" 
                              className={`px-8 py-3 text-lg ${
                                button.style === 'primary' ? 'bg-doralp-gold hover:bg-doralp-gold/90 text-white' :
                                button.style === 'secondary' ? 'bg-doralp-navy hover:bg-doralp-navy/90 text-white' :
                                'bg-transparent border-2 border-white hover:bg-white hover:text-doralp-navy text-white'
                              }`}
                            >
                              {button.url.startsWith('http') ? (
                                <a href={button.url} target="_blank" rel="noopener noreferrer">
                                  {button.text}
                                </a>
                              ) : (
                                <Link href={button.url}>
                                  {button.text}
                                </Link>
                              )}
                            </Button>
                          ))
                        ) : (
                          // Legacy single button support
                          slide.button_text && slide.button_url && (
                            <Button size="lg" className="bg-doralp-gold hover:bg-doralp-gold/90 text-white px-8 py-3 text-lg">
                              {slide.button_url.startsWith('http') ? (
                                <a href={slide.button_url} target="_blank" rel="noopener noreferrer">
                                  {slide.button_text}
                                </a>
                              ) : (
                                <Link href={slide.button_url}>
                                  {slide.button_text}
                                </Link>
                              )}
                            </Button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {slides.length > 1 && (
          <>
            <CarouselPrevious className="left-4 md:left-8 bg-white/20 border-white/40 hover:bg-white/30 text-white" />
            <CarouselNext className="right-4 md:right-8 bg-white/20 border-white/40 hover:bg-white/30 text-white" />
            
            {/* Indicator Dots */}
            <div className="absolute bottom-40 md:bottom-44 lg:bottom-48 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === current
                      ? "bg-doralp-gold scale-125"
                      : "bg-white/50 hover:bg-white/70"
                  }`}
                  onClick={() => api?.scrollTo(index)}
                />
              ))}
            </div>
          </>
        )}
      </Carousel>

      {/* Services Navigation - Slider'ın üzerinde */}
      <div className="absolute bottom-16 md:bottom-20 lg:bottom-24 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-6xl px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
          {services.map((service, index) => (
            <div key={service.id} className={`group animate-card-up animate-delay-${(index + 1) * 100}`}>
              <Link 
                href={service.href}
                target={service.href.startsWith('http') ? "_blank" : "_self"}
                rel={service.href.startsWith('http') ? "noopener noreferrer" : ""}
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 text-center hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40">
                  <div className="flex flex-col items-center space-y-2 md:space-y-3">
                    {/* Icon */}
                    <div className="w-8 h-8 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-doralp-gold/30 transition-all duration-300">
                      <service.icon className="w-4 h-4 md:w-6 md:h-6 text-white" />
                    </div>
                    
                    {/* Text */}
                    <div>
                      <h3 className="text-xs md:text-sm font-medium text-white group-hover:text-doralp-gold transition-colors duration-300">
                        {service.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}