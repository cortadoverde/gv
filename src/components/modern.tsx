'use client';
import './modern.css';

import React, { useState } from 'react';
import type { CV } from '@/types/cv';
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"

interface ModernCVProps {
  cv: CV;
}

const Modern = ({ cv }: ModernCVProps) => {
  const [activeSection, setActiveSection] = useState("info");

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
                <span className="text-gray-300">
                  {cv.basics.location.city}, {cv.basics.location.country}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-300">{cv.basics.email}</span>
              </div>
              {cv.basics.profiles.map((profile, index) => (
                <div key={index} className="flex items-center gap-2">
                  <a href={profile.url} className="text-gray-300 hover:text-primary transition-colors">
                    {profile.network}
                  </a>
                </div>
              ))}
            </div>
          </div>
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