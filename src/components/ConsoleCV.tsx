'use client';

import React, { useState } from 'react';
import type { CV } from '@/types/cv';

interface ConsoleCVProps {
  cv: CV;
}

interface ConsoleConfig {
  theme: {
    colors: {
      primary: string;
      background: string;
      text: string;
    };
    prompt: {
      user: string;
      host: string;
    };
  };
}

export default function ConsoleCV({ cv }: ConsoleCVProps) {
  const [currentCommand, setCurrentCommand] = useState("");
  const [output, setOutput] = useState([
    `Bienvenido al CV interactivo de ${cv.basics.name}`,
    "Escribe 'help' para ver los comandos disponibles",
    ""
  ]);

  const config: ConsoleConfig = {
    theme: {
      colors: {
        primary: "#00ff00",
        background: "#000000",
        text: "#00ff00"
      },
      prompt: {
        user: "visitor",
        host: "cv.dev"
      }
    }
  };

  const commands = {
    help: () => [
      "Comandos disponibles:",
      "  info      - Muestra información personal",
      "  exp       - Muestra experiencia laboral",
      "  edu       - Muestra educación",
      "  skills    - Muestra habilidades",
      "  langs     - Muestra idiomas",
      "  clear     - Limpia la pantalla",
      "  all       - Muestra todo el CV",
      ""
    ],
    info: () => [
      `${cv.basics.name}`,
      `${cv.basics.label}`,
      `${cv.basics.email}`,
      `${cv.basics.summary}`,
      `Location: ${cv.basics.location.city}, ${cv.basics.location.country}`,
      "",
      "Perfiles:",
      ...cv.basics.profiles.map(profile => `  ${profile.network}: ${profile.url}`),
      ""
    ],
    exp: () => {
      const output: string[] = [];
      cv.work.forEach(job => {
        output.push(`${job.company} (${job.startDate} - ${job.endDate || 'Presente'})`);
        output.push(`Role: ${job.position}`);
        output.push(`${job.summary}`);
        job.highlights.forEach(highlight => {
          output.push(`  - ${highlight}`);
        });
        output.push("");
      });
      return output;
    },
    edu: () => {
      const output: string[] = [];
      cv.education.forEach(edu => {
        output.push(`${edu.institution}`);
        output.push(`${edu.studyType} en ${edu.area}`);
        output.push(`${edu.startDate} - ${edu.endDate || 'Presente'}`);
        output.push("");
      });
      return output;
    },
    skills: () => {
      const output: string[] = [];
      cv.skills.forEach(skill => {
        output.push(`${skill.name} (${skill.level})`);
        output.push(`  Keywords: ${skill.keywords.join(', ')}`);
        output.push("");
      });
      return output;
    },
    langs: () => {
      const output = [];
      cv.languages.forEach(lang => {
        output.push(`${lang.language}: ${lang.fluency}`);
      });
      output.push("");
      return output;
    },
    clear: () => [],
    all: () => [
      ...commands.info(),
      "EXPERIENCIA LABORAL",
      "----------------",
      ...commands.exp(),
      "EDUCACIÓN",
      "----------------",
      ...commands.edu(),
      "HABILIDADES",
      "----------------",
      ...commands.skills(),
      "IDIOMAS",
      "----------------",
      ...commands.langs()
    ]
  };

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = currentCommand.toLowerCase().trim();
      const newOutput = [
        ...output,
        `${config.theme.prompt.user}@${config.theme.prompt.host}:~$ ${currentCommand}`,
        ...(commands[cmd as keyof typeof commands] 
          ? commands[cmd as keyof typeof commands]() 
          : ["Comando no reconocido. Escribe 'help' para ver los comandos disponibles", ""])
      ];
      setOutput(cmd === 'clear' ? [] : newOutput);
      setCurrentCommand("");
    }
  };

  return (
    <div className="min-h-screen bg-black p-4 font-mono text-green-500">
      <div className="whitespace-pre-wrap mb-4">
        {output.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
      <div className="flex">
        <span>{`${config.theme.prompt.user}@${config.theme.prompt.host}:~$`}</span>
        <input
          type="text"
          value={currentCommand}
          onChange={(e) => setCurrentCommand(e.target.value)}
          onKeyDown={handleCommand}
          className="flex-1 ml-2 bg-transparent outline-none text-green-500"
          autoFocus
        />
      </div>
    </div>
  );
} 