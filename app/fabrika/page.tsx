import { PageHeader } from "@/components/page-header"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Factory, Shield, Cog } from "lucide-react"

export default function FabrikaPage() {
  const sections = [
    {
      title: "Galeri",
      description: "Üretim süreçlerimizi ve fabrika tesislerimizi keşfedin",
      icon: Factory,
      href: "/fabrika/galeri",
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      title: "Makine Parkı",
      description: "Modern teknoloji ile donatılmış makine parkımız",
      icon: Cog,
      href: "/fabrika/makine-parki",
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      title: "İş Güvenliği",
      description: "Güvenli çalışma ortamı ve iş güvenliği standartlarımız",
      icon: Shield,
      href: "/fabrika/is-guvenligi",
      image: "/placeholder.svg?height=300&width=400",
    },
  ]

  return (
    <div className="min-h-screen">
      <PageHeader 
        title="Fabrikamız" 
        subtitle="Modern teknoloji ve kaliteli üretimin buluşma noktası"
        backgroundImage="/fabrikagörseli.jpg"
      />

      {/* Main Content */}
      <section className="py-16 md:py-24 bg-doralp-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-doralp-navy mb-4">
              Üretim <span className="text-doralp-gold">Tesislerimiz</span>
            </h2>
            <p className="text-lg text-doralp-gray max-w-3xl mx-auto">
              Modern makine parkımız ve deneyimli ekibimizle kaliteli üretim gerçekleştiriyoruz
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {sections.map((section, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-48">
                  <Image src={section.image || "/placeholder.svg"} alt={section.title} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-doralp-gold rounded-full flex items-center justify-center mr-4">
                      <section.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-doralp-navy">{section.title}</h3>
                  </div>
                  <p className="text-doralp-gray mb-6">{section.description}</p>
                  <Button asChild className="w-full bg-doralp-navy hover:bg-doralp-navy/90">
                    <Link href={section.href}>
                      Detayları Gör
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
