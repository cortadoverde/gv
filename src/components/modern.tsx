'use client';
import './modern.css';

import React, { useState } from 'react';
import type { CV } from '@/types/cv';
import { Mail, MapPin, Globe, UserCircle, Briefcase, Code2, GraduationCap, Languages   } from 'lucide-react';

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Badge } from "@/components/ui/badge"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import PortfolioItemComponent from './modern/portfolio/PortfolioItem';
 
export function BadgeSecondary() {
  return <Badge variant="secondary">Secondary</Badge>
}

interface ModernCVProps {
  cv: CV;
}



const Modern = ({ cv }: ModernCVProps) => {
  const [activeSection, setActiveSection] = useState("info")

  const sections = {
    info: {
      title: 'Perfil Profesional',
      icon: UserCircle,
      content: () => (
        <>
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-1">
                <span className="text-[var(--color-primary-highlight)]">{cv.basics.name.split(' ')[0]}</span>{' '}
                {cv.basics.name.split(' ').slice(1).join(' ')}
              </h1>
              <h2 className="text-xl text-gray-300 mb-4">{cv.basics.label}</h2>
              <p className="text-gray-300 leading-relaxed">{cv.basics.summary}</p>
            </div>
            {cv.portfolio &&
              
              <div className="porfolio w-[90%] m-auto">
                <Carousel className="w-full max-w-4xl mx-auto">
                  <CarouselContent>
                    {cv.portfolio.map((project, index) => (
                      
                      <CarouselItem key={index}>
                        <PortfolioItemComponent item={project} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            }
          </div>
          <div className="col-span-1">
            <div className="space-y-4 bg-[var(--color-surface)] p-6 rounded-lg">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-primary" />
                <span className="text-gray-300">
                  {cv.basics.location.city}, {cv.basics.location.country}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-primary" />
                <span className="text-gray-300">{cv.basics.email}</span>
              </div>
              {cv.basics.profiles.map((profile, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Globe size={18} className="text-primary" />
                  <a href={profile.url} className="text-gray-300 hover:text-primary transition-colors">
                    {profile.network}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
              
        </>
      )
    },
    experience: {
      title: 'Experiencia',
      icon: Briefcase,
      content: () => (
        <div className="grid grid-cols-2 gap-8">
          {cv.work.map((job, index) => (
            <div key={index} className="bg-[var(--color-surface)] p-6 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-primary">{job.company}</h3>
                  <p className="text-xl text-gray-300">{job.position}</p>
                </div>
                <span className="text-[var(--color-primary-hover)] text-sm">
                  {job.startDate} - {job.endDate}
                </span>
              </div>
              <p className="text-gray-300 mb-4">{job.summary}</p>
              <div className="flex gap-3 flex-wrap">
                {job.highlights.map((highlight, idx) => (
                  <Badge key={idx} variant="secondary">{highlight}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      )
    },
    skills: {
      title: 'Habilidades',
      icon: Code2,
      content: () => (
        <div className="grid grid-cols-2 gap-6">
          {cv.skills.map((skill, index) => (
            <div key={index} className="bg-[var(--color-surface)] p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-primary">{skill.name}</h3>
                <span className="text-gray-400 text-sm">{skill.level}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {skill.keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-color-surface-hover text-gray-300 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )
    },
    education: {
      title: 'Formación',
      icon: GraduationCap,
      content: () => (
        <div className="space-y-6">
          {cv.education.map((edu, index) => (
            <div key={index} className="bg-[var(--color-surface)] p-6 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-primary">{edu.institution}</h3>
                  <p className="text-gray-300">{edu.studyType} en {edu.area}</p>
                </div>
                <span className="text-gray-400 text-sm">
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
            </div>
          ))}
        </div>
      )
    },
    languages: {
      title: 'Idiomas',
      icon: Languages,
      content: () => (
        <div className="grid grid-cols-3 gap-6">
          {cv.languages.map((lang, index) => (
            <div key={index} className="bg-[var(--color-surface)] p-6 rounded-lg">
              <h3 className="text-xl font-bold text-primary mb-2">{lang.language}</h3>
              <p className="text-gray-300">{lang.fluency}</p>
            </div>
          ))}
        </div>
      )
    }
  };

 

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
          <AppSidebar 
              activeSection={activeSection} 
              onSectionChange={setActiveSection} 
              sections={sections}
          />
        
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 px-6">
            <SidebarTrigger />
            <h1>{sections[activeSection as keyof typeof sections].title}</h1>
          </header>
          <main className="flex-1 overflow-auto p-6">
            {sections[activeSection as keyof typeof sections].content()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Modern; 