'use client';

import React, { useState } from 'react';
import type { CV } from '@/types/cv';

interface RetroCVProps {
  cv: CV;
} 

export default function RetroCV({ cv }: RetroCVProps) {
  const [selectedOption, setSelectedOption] = useState<number>(0);
  const [currentScreen, setCurrentScreen] = useState<string>('menu');

  const menuOptions = [
    { id: 'info', label: 'INFORMACIÓN PERSONAL' },
    { id: 'exp', label: 'EXPERIENCIA LABORAL' },
    { id: 'edu', label: 'EDUCACIÓN' },
    { id: 'skills', label: 'HABILIDADES' },
    { id: 'langs', label: 'IDIOMAS' }
  ];

  const handleKeyDown = (e: KeyboardEvent) => {
    switch(e.key) {
      case 'ArrowUp':
        setSelectedOption(prev => (prev > 0 ? prev - 1 : menuOptions.length - 1));
        break;
      case 'ArrowDown':
        setSelectedOption(prev => (prev < menuOptions.length - 1 ? prev + 1 : 0));
        break;
      case 'Enter':
        setCurrentScreen(menuOptions[selectedOption].id);
        break;
      case 'Escape':
        setCurrentScreen('menu');
        break;
    }
  };

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedOption]);

  return (
    <div className="min-h-screen bg-[#5c94fc] p-8 font-['Press_Start_2P'] text-white">
      <div className="max-w-2xl mx-auto bg-black p-8 rounded-lg border-4 border-white">
        {currentScreen === 'menu' ? (
          <>
            <h1 className="text-2xl text-center mb-8 text-[#ffd700]">
              {cv.basics.name}
            </h1>
            <div className="space-y-4">
              {menuOptions.map((option, index) => (
                <div 
                  key={option.id}
                  className={`p-2 ${selectedOption === index ? 'bg-white text-black' : ''}`}
                >
                  {selectedOption === index && '→ '}
                  {option.label}
                </div>
              ))}
            </div>
            <div className="mt-8 text-xs text-[#ffd700]">
              Use ↑↓ para navegar, ENTER para seleccionar
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl mb-4 text-[#ffd700]">{menuOptions.find(opt => opt.id === currentScreen)?.label}</h2>
            {currentScreen === 'info' && (
              <div className="space-y-2">
                <p>{cv.basics.label}</p>
                <p>{cv.basics.email}</p>
                <p>{cv.basics.summary}</p>
                <p>📍 {cv.basics.location.city}, {cv.basics.location.country}</p>
              </div>
            )}
            {currentScreen === 'exp' && (
              <div className="space-y-4">
                {cv.work.map((job, i) => (
                  <div key={i} className="space-y-2">
                    <h3 className="text-[#ffd700]">{job.company}</h3>
                    <p>{job.position}</p>
                    <p>{job.startDate} - {job.endDate || 'Presente'}</p>
                    <ul className="list-disc pl-4">
                      {job.highlights.map((highlight, j) => (
                        <li key={j}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
            {/* Agregar más secciones aquí... */}
            <div className="mt-8 text-xs text-[#ffd700]">
              Presiona ESC para volver al menú
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 