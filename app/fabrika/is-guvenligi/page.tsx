import { PageHeader } from "@/components/page-header"
import { Shield, HardHat, AlertTriangle, CheckCircle } from "lucide-react"

export default function IsGuvenligiPage() {
  const safetyMeasures = [
    {
      title: "Kişisel Koruyucu Donanım",
      description: "Tüm çalışanlarımız için zorunlu KKD kullanımı",
      icon: HardHat,
      items: ["Güvenlik kaskı", "Koruyucu gözlük", "İş eldivenleri", "Güvenlik ayakkabısı"],
    },
    {
      title: "Güvenlik Eğitimleri",
      description: "Düzenli güvenlik eğitimleri ve sertifikasyon programları",
      icon: Shield,
      items: ["İş güvenliği eğitimi", "İlk yardım eğitimi", "Yangın güvenliği", "Acil durum prosedürleri"],
    },
    {
      title: "Risk Değerlendirmesi",
      description: "Sürekli risk analizi ve önleyici tedbirler",
      icon: AlertTriangle,
      items: ["İş güvenliği analizi", "Risk haritalaması", "Önleyici tedbirler", "Düzenli denetimler"],
    },
  ]

  const certifications = [
    "ISO 45001 İş Sağlığı ve Güvenliği",
    "İSG Yönetim Sistemi Sertifikası",
    "Çevre Yönetim Sistemi",
    "Kalite Yönetim Sistemi",
  ]

  return (
    <div className="min-h-screen">
      <PageHeader title="İş Güvenliği" subtitle="Güvenli çalışma ortamı ve iş güvenliği standartlarımız" />

      <section className="py-16 md:py-24 bg-doralp-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-doralp-navy mb-4">
              Güvenlik <span className="text-doralp-gold">Önceliğimiz</span>
            </h2>
            <p className="text-lg text-doralp-gray max-w-3xl mx-auto">
              Çalışanlarımızın güvenliği bizim için en önemli önceliktir. Modern güvenlik standartları ile çalışıyoruz.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {safetyMeasures.map((measure, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-doralp-gold rounded-full flex items-center justify-center mx-auto mb-6">
                  <measure.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-doralp-navy text-center mb-4">{measure.title}</h3>
                <p className="text-doralp-gray text-center mb-6">{measure.description}</p>
                <ul className="space-y-2">
                  {measure.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center text-doralp-gray">
                      <CheckCircle className="h-4 w-4 text-doralp-gold mr-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-doralp-navy text-center mb-8">
              Sertifikalarımız ve <span className="text-doralp-gold">Standartlarımız</span>
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {certifications.map((cert, index) => (
                <div key={index} className="text-center p-4 bg-doralp-light-gray rounded-xl">
                  <CheckCircle className="h-8 w-8 text-doralp-gold mx-auto mb-2" />
                  <p className="text-doralp-navy font-medium">{cert}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
