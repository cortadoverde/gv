"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {  Paintbrush, RotateCcw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Copy } from "lucide-react"

const colorVariables = [
  { name: '--color-background', label: 'Fondo', defaultValue: '#1a1a1a' },
  { name: '--color-surface', label: 'Superficie', defaultValue: '#242424' },
  { name: '--color-surface-hover', label: 'Superficie Hover', defaultValue: '#333333' },
  { name: '--color-primary', label: 'Primario', defaultValue: '#c5b41e' },
  { name: '--color-primary-hover', label: 'Primario Hover', defaultValue: '#fbbf24' },
  { name: '--color-text', label: 'Texto', defaultValue: '#e5e7eb' },
  { name: '--color-text-secondary', label: 'Texto Secundario', defaultValue: '#9ca3af' },
]


interface AppSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  sections: Record<string, { title: string; content: () => JSX.Element }>;
}

export function AppSidebar({ activeSection, onSectionChange, sections }: AppSidebarProps) {
  const [showColorConfig, setShowColorConfig] = useState(false)
  const [colors, setColors] = useState<Record<string, string>>(() => {
    const initialColors: Record<string, string> = {}
    colorVariables.forEach((variable) => {
      initialColors[variable.name] = variable.defaultValue
    })
    return initialColors
  })

  const updateCSSVariable = (variableName: string, value: string) => {
    document.documentElement.style.setProperty(variableName, value)
    setColors(prev => ({ ...prev, [variableName]: value }))
  }

  const resetToDefaults = () => {
    colorVariables.forEach((variable) => {
      document.documentElement.style.setProperty(variable.name, variable.defaultValue)
    })
    setColors(() => {
      const defaultColors: Record<string, string> = {}
      colorVariables.forEach((variable) => {
        defaultColors[variable.name] = variable.defaultValue
      })
      return defaultColors
    })
  }

  const handleCopyConfig = async () => {
    const cssConfig = `
    :root {
      ${colorVariables.map(variable => `${variable.name}: ${colors[variable.name]};`).join('\n      ')}
    }`;
    
    try {
      await navigator.clipboard.writeText(cssConfig);
      alert('¡Configuración copiada al portapapeles!');
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  useEffect(() => {
    colorVariables.forEach((variable) => {
      const storedValue = localStorage.getItem(variable.name)
      if (storedValue) {
        updateCSSVariable(variable.name, storedValue)
      }
    })
  }, [])

  useEffect(() => {
    Object.entries(colors).forEach(([key, value]) => {
      localStorage.setItem(key, value)
    })
  }, [colors])

  return (
    <Sidebar className="border-r border-[var(--color-border)]">
      <ScrollArea className=" pr-4">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-[var(--color-text)]">
              Secciones
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {Object.entries(sections).map(([key, section]) => (
                  <SidebarMenuItem key={key}>
                    <SidebarMenuButton 
                      onClick={() => onSectionChange(key)}
                      className={`w-full ${activeSection === key ? 'bg-[var(--color-surface-hover)] text-[var(--color-primary)]' : ''}`}
                    >
                      {section.title}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {showColorConfig && (
            <SidebarGroup>
              <SidebarGroupLabel className="text-[var(--color-text)]">
                Personalizar Colores
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="scrollarea-wrapper">
                  <ScrollArea className="h-[250px] pr-4">
                    <div className="grid grid-cols-2 gap-4 p-4">
                      {colorVariables.map((variable) => (
                        <div key={variable.name} className="space-y-2">
                          <Label htmlFor={variable.name}>{variable.label}</Label>
                          <Input
                            id={variable.name}
                            type="color"
                            value={colors[variable.name]}
                            onChange={(e) => updateCSSVariable(variable.name, e.target.value)}
                            className="h-8 w-full cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>
      </ScrollArea>
      <div className="mt-auto border-t p-4">
        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={() => setShowColorConfig(!showColorConfig)} 
            className="col-span-2"
          >
            <Paintbrush className="mr-2 h-4 w-4" />
            {showColorConfig ? 'Ocultar Colores' : 'Personalizar'}
          </Button>
          {showColorConfig && (
            <>
              <Button 
                onClick={resetToDefaults}
                className="col-span-1"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Restaurar
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="col-span-1">
                    <Copy className="mr-2 h-4 w-4" />
                    Copiar
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Configuración de Colores</DialogTitle>
                  </DialogHeader>
                  <div className="relative">
                    <pre className="bg-muted rounded-md p-4">
                      {`:root {
  ${colorVariables.map(variable => `${variable.name}: ${colors[variable.name]};`).join('\n  ')}
}`}
                    </pre>
                    <Button
                      size="sm"
                      onClick={handleCopyConfig}
                      className="absolute top-4 right-4"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>
    </Sidebar>
  )
} 