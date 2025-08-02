"use client";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { ProjectCard } from "@/components/project-card";

const categories = [
  "Devam eden projeler",
  "Sanayi Yapıları",
  "Lojistik yapılar",
  "Stadyum - Spor salonu",
  "Enerji santral yapıları",
  "AVM - Market"
];

interface Project {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  category: string | null;
  date: string | null;
  end_date: string | null;
  language: string;
  created_at: string;
  updated_at: string;
  project_images?: Array<{
    id: string;
    image_url: string;
    alt_text: string | null;
    is_primary: boolean;
  }>;
}

export default function ProjelerPage() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Projeleri API'den çek
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/projects/public');
        
        if (!response.ok) {
          throw new Error('Projeler yüklenirken hata oluştu');
        }
        
        const data = await response.json();
        console.log('Fetched projects for public page:', data);
        setProjects(data);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(
    (project) => project.category === selectedCategory
  );

  return (
    <div className="min-h-screen">
      <PageHeader title="Projelerimiz" subtitle="Gerçekleştirdiğimiz başarılı projeler ve referanslarımız" />

      <section className="py-8 md:py-12 bg-doralp-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Kategori başlıkları */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full border font-medium transition-colors duration-200 ${selectedCategory === cat ? "bg-doralp-gold text-white border-doralp-gold" : "bg-white text-doralp-navy border-doralp-gold hover:bg-doralp-gold/10"}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Loading durumu */}
          {loading && (
            <div className="col-span-full text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-doralp-gold mx-auto"></div>
              <p className="mt-4 text-doralp-gray">Projeler yükleniyor...</p>
            </div>
          )}

          {/* Error durumu */}
          {error && (
            <div className="col-span-full text-center py-8">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Proje kartları */}
          {!loading && !error && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.length === 0 ? (
                <div className="col-span-full text-center text-doralp-gray">Bu kategoriye ait proje bulunamadı.</div>
              ) : (
                filteredProjects.map((project) => (
                  <ProjectCard 
                    key={project.id}
                    id={project.id}
                    title={project.title}
                    description={project.description}
                    location={project.location}
                    category={project.category}
                    startDate={project.date}
                    endDate={project.end_date}
                    project_images={project.project_images}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
