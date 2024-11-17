import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Github, Globe, ExternalLink, Eye, Heart } from 'lucide-react'

interface PortfolioItem {
  title: string;
  description: string;
  category: string;
  date: string;
  coverImage: string;
  images: Array<{
    url: string;
    caption?: string;
  }>;
  tools: string[];
  tags: string[];
  links: Array<{
    type: 'live' | 'github' | 'behance' | 'dribbble' | 'other';
    url: string;
    label?: string;
  }>;
  stats?: {
    views?: number;
    likes?: number;
  };
  featured: boolean;
  processSteps?: Array<{
    title: string;
    description: string;
  }>;
}

const realEstateProject: PortfolioItem = {
  title: "Sistema de Análisis de Mercado Inmobiliario",
  description: "Plataforma automatizada de web scraping y análisis de datos para el mercado inmobiliario argentino. El sistema recopila información de múltiples fuentes, procesa los datos y genera informes detallados sobre tendencias de precios y oportunidades de inversión.",
  category: "Web Scraping & Data Analysis",
  date: "2023-06",
  coverImage: "https://i.pinimg.com/736x/e5/bd/d8/e5bdd8b375ff94cdb228bf86054809c9.jpg",
  images: [
    {
      url: "https://i.pinimg.com/736x/e5/bd/d8/e5bdd8b375ff94cdb228bf86054809c9.jpg",
      caption: "Dashboard principal con métricas en tiempo real"
    }
  ],
  tools: ["Python", "Node.js", "MongoDB", "React", "D3.js", "Docker"],
  tags: ["Web Scraping", "Real Estate", "Data Analysis", "Dashboard"],
  links: [
    {
      type: "github",
      url: "https://github.com/pablosamudia/realestate-analysis",
      label: "GitHub"
    },
    {
      type: "live",
      url: "https://realestate-analysis.demo.com",
      label: "Demo"
    }
  ],
  stats: {
    views: 1200,
    likes: 45
  },
  featured: true,
  processSteps: [
    {
      title: "Recopilación de Datos",
      description: "Implementación de scrapers automatizados para múltiples fuentes"
    },
    {
      title: "Procesamiento y Análisis",
      description: "Algoritmos de limpieza y normalización de datos"
    }
  ]
};

export default function PortfolioItemComponent({ item }: { item: PortfolioItem | undefined }) {
  
  const getLinkIcon = (type: string) => {
    switch (type) {
      case 'github': return <Github className="h-4 w-4" />;
      case 'live': return <Globe className="h-4 w-4" />;
      default: return <ExternalLink className="h-4 w-4" />;
    }
  };
  if (!item) item = realEstateProject;
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {item.title}
          {item.featured && <Badge variant="default">Destacado</Badge>}
        </CardTitle>
        <CardDescription>{item.category} - {item.date}</CardDescription>
      </CardHeader>
      <CardContent>
        <Carousel className="w-full max-w-xs mx-auto mb-4">
          <CarouselContent>
            {item.images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <img 
                    src={image.url || item.coverImage} 
                    alt={image.caption || `Image ${index + 1}`}
                    className="rounded-md object-cover w-full h-[200px]" 
                  />
                  {image.caption && (
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                      {image.caption}
                    </p>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        
        <p className="mt-4">{item.description}</p>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {item.tools.map((tool, index) => (
            <Badge key={index} variant="secondary">{tool}</Badge>
          ))}
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags.map((tag, index) => (
            <Badge key={index} >{tag}</Badge>
          ))}
        </div>

        {item.processSteps && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Proceso</h3>
            <ul className="list-disc pl-5 space-y-2">
              {item.processSteps.map((step, index) => (
                <li key={index}>
                  <span className="font-medium">{step.title}:</span> {step.description}
                </li>
              ))}
            </ul>
          </div>
        )}

        {item.stats && (
          <div className="mt-4 flex items-center gap-4">
            {item.stats.views !== undefined && (
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                <span>{item.stats.views} vistas</span>
              </div>
            )}
            {item.stats.likes !== undefined && (
              <div className="flex items-center">
                <Heart className="h-4 w-4 mr-1" />
                <span>{item.stats.likes} likes</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          {item.links.map((link, index) => (
            <Button key={index} variant="outline" size="sm" asChild>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {getLinkIcon(link.type)}
                <span className="ml-2">{link.label || link.type}</span>
              </a>
            </Button>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}