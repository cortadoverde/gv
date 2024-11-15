'use client';

import React, { useState } from 'react';
import type { CV } from '@/types/cv';

interface RecipeBookCVProps {
  cv: CV;
}

const Recipe = ({ cv }: RecipeBookCVProps) => {
  const [currentSection, setCurrentSection] = useState<string>('info');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const sections = {
    info: {
      title: '📋 Información Personal',
      content: () => (
        <div className="recipe-card">
          <h2 className="text-3xl font-serif mb-6">{cv.basics.name}</h2>
          <div className="recipe-ingredients">
            <h3 className="text-xl mb-4 font-serif">Detalles</h3>
            <ul className="space-y-2">
              <li>🎯 {cv.basics.label}</li>
              <li>📧 {cv.basics.email}</li>
              <li>📍 {cv.basics.location.city}, {cv.basics.location.country}</li>
            </ul>
          </div>
          <div className="recipe-instructions mt-6">
            <h3 className="text-xl mb-4 font-serif">Sobre mí</h3>
            <p className="text-gray-700">{cv.basics.summary}</p>
          </div>
          <div className="recipe-notes mt-6">
            <h3 className="text-xl mb-4 font-serif">Perfiles</h3>
            <div className="flex gap-4">
              {cv.basics.profiles.map((profile, index) => (
                <a
                  key={index}
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {profile.network}
                </a>
              ))}
            </div>
          </div>
        </div>
      )
    },
    experience: {
      title: '💼 Experiencia',
      content: () => (
        <div className="space-y-8">
          {cv.work.map((job, index) => (
            <div key={index} className="recipe-card">
              <h3 className="text-2xl font-serif mb-2">{job.company}</h3>
              <div className="recipe-metadata mb-4">
                <span className="text-gray-600">{job.position}</span>
                <span className="mx-2">•</span>
                <span className="text-gray-600">{job.startDate} - {job.endDate || 'Presente'}</span>
              </div>
              <p className="text-gray-700 mb-4">{job.summary}</p>
              <div className="recipe-ingredients">
                <h4 className="text-lg font-serif mb-2">Logros destacados</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {job.highlights.map((highlight, idx) => (
                    <li key={idx} className="text-gray-700">{highlight}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )
    },
    skills: {
      title: '🛠 Habilidades',
      content: () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cv.skills.map((skill, index) => (
            <div key={index} className="recipe-card">
              <h3 className="text-2xl font-serif mb-2">{skill.name}</h3>
              <div className="recipe-metadata mb-4">
                <span className="text-gray-600">Nivel: {skill.level}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {skill.keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
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
      title: '🎓 Educación',
      content: () => (
        <div className="space-y-6">
          {cv.education.map((edu, index) => (
            <div key={index} className="recipe-card">
              <h3 className="text-2xl font-serif mb-2">{edu.institution}</h3>
              <div className="recipe-metadata mb-4">
                <span className="text-gray-600">{edu.studyType} en {edu.area}</span>
                <span className="mx-2">•</span>
                <span className="text-gray-600">{edu.startDate} - {edu.endDate || 'Presente'}</span>
              </div>
            </div>
          ))}
        </div>
      )
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-gray-200">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full w-64 bg-[#242424] shadow-lg transform transition-transform duration-300 ease-in-out"
           style={{ transform: isMenuOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
        <div className="p-6">
          <h2 className="text-2xl font-serif mb-6 text-gray-100">Índice</h2>
          <ul className="space-y-4">
            {Object.entries(sections).map(([key, section]) => (
              <li key={key}>
                <button
                  onClick={() => {
                    setCurrentSection(key);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full text-left py-2 px-4 rounded transition-colors ${
                    currentSection === key ? 'bg-[#333333] text-white' : 'hover:bg-[#2a2a2a] text-gray-300'
                  }`}
                >
                  {section.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-0 p-6">
        {/* Menu Toggle Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-[#333333] text-white rounded-full shadow-lg hover:bg-[#404040]"
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>

        {/* Content */}
        <div className="max-w-4xl mx-auto mt-12">
          <h1 className="text-3xl font-serif mb-8 text-gray-100">{sections[currentSection as keyof typeof sections].title}</h1>
          <div className="space-y-8">
            {/* Actualizar los estilos de las cards */}
            <style jsx global>{`
              .recipe-card {
                background-color: #242424;
                border-radius: 0.5rem;
                padding: 1.5rem;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
                margin-bottom: 1rem;
              }
              
              .recipe-card h2, .recipe-card h3, .recipe-card h4 {
                color: #ffffff;
              }
              
              .recipe-card p, .recipe-card li {
                color: #d1d1d1;
              }
              
              .recipe-metadata span {
                color: #a0a0a0;
              }
              
              .recipe-card a {
                color: #60a5fa;
              }
              
              .recipe-card a:hover {
                color: #93c5fd;
              }
              
              .recipe-card .bg-gray-100 {
                background-color: #333333;
                color: #d1d1d1;
              }
            `}</style>
          </div>
          {sections[currentSection as keyof typeof sections].content()}
        </div>
      </div>
    </div>
  );
};

export default Recipe; 