import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin } from "lucide-react"

interface ProjectCardProps {
  id: string
  title: string
  description: string
  image?: string
  location: string
  year?: string
  category: string
  'project-images'?: Array<{
    id: string;
    image_url: string;
    alt_text: string | null;
    is_primary: boolean;
  }>;
}

export function ProjectCard({ id, title, description, image, location, year, category, 'project-images': projectImages }: ProjectCardProps) {
  // İlk resmi al veya placeholder kullan
  const displayImage = projectImages && projectImages.length > 0 
    ? projectImages[0].image_url 
    : image || "/placeholder.svg";
    
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48">
        <Image src={displayImage} alt={title} fill className="object-cover" />
        <div className="absolute top-4 left-4">
          <span className="bg-doralp-gold text-white px-3 py-1 rounded-full text-sm font-medium">{category}</span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-doralp-navy mb-2">{title}</h3>
        <p className="text-doralp-gray mb-4 line-clamp-3">{description}</p>
        <div className="flex items-center justify-between text-sm text-doralp-gray mb-4">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {location}
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {year}
          </div>
        </div>
        <Link href={`/projeler/${id}`}>
          <Button className="w-full bg-doralp-navy hover:bg-doralp-navy/90">Detayları Gör</Button>
        </Link>
      </div>
    </div>
  )
}
