'use client';
import './modern.css';

import React, { useState } from 'react';
import type { CV } from '@/types/cv';
import { Mail, MapPin, Globe } from 'lucide-react';

import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

interface ModernCVProps {
  cv: CV;
}

const Modern = ({ cv }: ModernCVProps) => {
  const [activeSection, setActiveSection] = useState("info")

  const sections = {
    info: {
      title: 'Perfil Profesional',
      content: () => (
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
          </div>
          <div className="col-span-1">
            <div className="space-y-4 bg-[#242424] p-6 rounded-lg">
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
      )
    },
    experience: {
      title: 'Experiencia Culinaria',
      content: () => (
        <div className="space-y-8">
          {cv.work.map((job, index) => (
            <div key={index} className="bg-[#242424] p-6 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-primary">{job.company}</h3>
                  <p className="text-xl text-gray-300">{job.position}</p>
                </div>
                <span className="text-gray-400 text-sm">
                  {job.startDate} - {job.endDate}
                </span>
              </div>
              <p className="text-gray-300 mb-4">{job.summary}</p>
              <div className="space-y-2">
                {job.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-primary">•</span>
                    <span className="text-gray-300">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )
    },
    skills: {
      title: 'Habilidades Culinarias',
      content: () => (
        <div className="grid grid-cols-2 gap-6">
          {cv.skills.map((skill, index) => (
            <div key={index} className="bg-[#242424] p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-primary">{skill.name}</h3>
                <span className="text-gray-400 text-sm">{skill.level}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {skill.keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-[#333333] text-gray-300 rounded-full text-sm"
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
      title: 'Formación Culinaria',
      content: () => (
        <div className="space-y-6">
          {cv.education.map((edu, index) => (
            <div key={index} className="bg-[#242424] p-6 rounded-lg">
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
      content: () => (
        <div className="grid grid-cols-3 gap-6">
          {cv.languages.map((lang, index) => (
            <div key={index} className="bg-[#242424] p-6 rounded-lg">
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
      <div className="flex h-screen w-full overflow-hidden">
        <div className="h-full w-[290px]">
          <AppSidebar 
            activeSection={activeSection} 
            onSectionChange={setActiveSection} 
            sections={sections}
          />
        </div>
        
        <SidebarInset className="flex-1 overflow-auto">
          <div className="flex flex-col h-full">
            <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-[var(--color-surface)]">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger />
                <h2 className="text-2xl font-bold text-[var(--color-primary)]">
                  {sections[activeSection as keyof typeof sections].title}
                </h2>
              </div>
            </header>
            
            <main className="flex-1 overflow-auto">
              <div className="max-w-7xl mx-auto p-6">
                {sections[activeSection as keyof typeof sections].content()}
              </div>
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Modern; 