import { PageHeader } from "@/components/page-header"
import Image from "next/image"
import { Award, CheckCircle, Target, Users } from "lucide-react"

export default function KaliteSistemiPage() {
  const qualityStandards = [
    {
      title: "ISO 9001:2015",
      description: "Kalite Yönetim Sistemi",
      icon: Award,
    },
    {
      title: "ISO 14001",
      description: "Çevre Yönetim Sistemi",
      icon: Target,
    },
    {
      title: "ISO 45001",
      description: "İş Sağlığı ve Güvenliği",
      icon: Users,
    },
  ]

  const qualityProcesses = [
    "Hammadde kalite kontrolü",
    "Üretim süreç kontrolü",
    "Ürün kalite testleri",
    "Müşteri memnuniyet ölçümü",
    "Sürekli iyileştirme",
    "Personel eğitimi ve gelişimi",
  ]

  return (
    <div className="min-h-screen">
      <PageHeader title="Kalite Sistemi" subtitle="Kalite standartlarımız ve sürekli iyileştirme yaklaşımımız" />

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-doralp-navy mb-6">
                Kalite <span className="text-doralp-gold">Politikamız</span>
              </h2>

              <p className="text-lg text-doralp-gray leading-relaxed">
                Doralp olarak, müşteri memnuniyetini en üst düzeyde tutmak ve sürekli iyileştirme ilkesiyle hareket
                etmek temel kalite politikamızdır. Uluslararası standartlara uygun üretim süreçlerimizle sektörde öncü
                konumumuzu sürdürüyoruz.
              </p>

              <p className="text-lg text-doralp-gray leading-relaxed">
                Kaliteli hammadde seçiminden son ürün teslimatına kadar her aşamada titiz kalite kontrol süreçleri
                uyguluyoruz. Deneyimli kalite kontrol ekibimiz ve modern test ekipmanlarımızla en yüksek kalite
                standartlarını garanti ediyoruz.
              </p>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/placeholder.svg?height=500&width=700"
                  alt="Kalite Kontrol"
                  width={700}
                  height={500}
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Quality Standards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {qualityStandards.map((standard, index) => (
              <div key={index} className="text-center p-8 bg-doralp-light-gray rounded-2xl">
                <div className="w-16 h-16 bg-doralp-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <standard.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-doralp-navy mb-2">{standard.title}</h3>
                <p className="text-doralp-gray">{standard.description}</p>
              </div>
            ))}
          </div>

          {/* Quality Processes */}
          <div className="bg-doralp-light-gray rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-doralp-navy text-center mb-8">
              Kalite <span className="text-doralp-gold">Süreçlerimiz</span>
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {qualityProcesses.map((process, index) => (
                <div key={index} className="flex items-center space-x-3 bg-white p-4 rounded-xl">
                  <CheckCircle className="h-5 w-5 text-doralp-gold flex-shrink-0" />
                  <span className="text-doralp-navy font-medium">{process}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
