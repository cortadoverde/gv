'use client'

import * as React from 'react'
import { ChevronDown, ChevronUp, ChevronRight, Trash2, User, Briefcase, GraduationCap, Code, Languages, FileJson } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useToast } from "@/hooks/use-toast"
import { DragHandleDots2Icon } from "@radix-ui/react-icons"
import { DragEndEvent } from '@dnd-kit/core';

interface CV {
  basics: {
    name: string;
    label: string;
    email: string;
    summary: string;
    location: {
      city: string;
      country: string;
    };
    profiles: Array<{
      network: string;
      url: string;
    }>;
  };
  work: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    summary: string;
    highlights: string[];
  }>;
  education: Array<{
    institution: string;
    area: string;
    studyType: string;
    startDate: string;
    endDate?: string;
  }>;
  skills: Array<{
    name: string;
    level: string;
    keywords: string[];
  }>;
  languages: Array<{
    language: string;
    fluency: string;
  }>;
}

const initialCV: CV = {
  basics: {
    name: "",
    label: "",
    email: "",
    summary: "",
    location: {
      city: "",
      country: "",
    },
    profiles: [],
  },
  work: [],
  education: [],
  skills: [],
  languages: [],
}

// Agregar estas funciones utilitarias fuera de los componentes
const arrayUtils = {
  moveItem: <T,>(array: T[], fromIndex: number, toIndex: number): T[] => {
    const newArray = [...array]
    const [movedItem] = newArray.splice(fromIndex, 1)
    newArray.splice(toIndex, 0, movedItem)
    return newArray
  },

  removeItem: <T,>(array: T[], index: number): T[] => {
    return array.filter((_, i) => i !== index)
  },

  moveItemUp: <T,>(array: T[], index: number): T[] => {
    if (index === 0) return array
    return arrayUtils.moveItem(array, index, index - 1)
  },

  moveItemDown: <T,>(array: T[], index: number): T[] => {
    if (index === array.length - 1) return array
    return arrayUtils.moveItem(array, index, index + 1)
  }
}

export default function CVEditor() {
  const [cv, setCv] = React.useState<CV>(initialCV)
  const [activeSection, setActiveSection] = React.useState<keyof CV | 'json'>('basics')
  const { toast } = useToast()

  const updateCV = (section: keyof CV, data: CV[keyof CV]) => {
    setCv(prev => ({ ...prev, [section]: data }))
  }

  const addItem = (section: 'work' | 'education' | 'skills' | 'languages') => {
    setCv(prev => ({
      ...prev,
      [section]: [...prev[section], getEmptyItem(section)]
    }))
  }

  const getEmptyItem = (section: 'work' | 'education' | 'skills' | 'languages') => {
    switch (section) {
      case 'work':
        return { company: '', position: '', startDate: '', summary: '', highlights: [] }
      case 'education':
        return { institution: '', area: '', studyType: '', startDate: '' }
      case 'skills':
        return { name: '', level: '', keywords: [] }
      case 'languages':
        return { language: '', fluency: '' }
    }
  }

  const copyJsonToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(cv, null, 2)).then(() => {
      toast({
        title: "JSON Copiado",
        description: "El JSON del CV se ha copiado al portapapeles.",
      })
    }, (err) => {
      console.error('No se pudo copiar el texto: ', err)
      toast({
        title: "Error",
        description: "No se pudo copiar el JSON al portapapeles.",
        variant: "destructive",
      })
    })
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar>
          <SidebarHeader>
            <h2 className="text-lg font-semibold">Editor de CV</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveSection('basics')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Información Básica</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveSection('work')}>
                  <Briefcase className="mr-2 h-4 w-4" />
                  <span>Experiencia Laboral</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveSection('education')}>
                  <GraduationCap className="mr-2 h-4 w-4" />
                  <span>Educación</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveSection('skills')}>
                  <Code className="mr-2 h-4 w-4" />
                  <span>Habilidades</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveSection('languages')}>
                  <Languages className="mr-2 h-4 w-4" />
                  <span>Idiomas</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveSection('json')}>
                  <FileJson className="mr-2 h-4 w-4" />
                  <span>Ver JSON</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 p-6 overflow-auto">
          <SidebarTrigger />
          {activeSection === 'basics' && (
            <BasicsForm data={cv.basics} updateData={(data) => updateCV('basics', data)} />
          )}
          {activeSection === 'work' && (
            <WorkForm data={cv.work} updateData={(data) => updateCV('work', data)} addItem={() => addItem('work')} />
          )}
          {activeSection === 'education' && (
            <EducationForm data={cv.education} updateData={(data) => updateCV('education', data)} addItem={() => addItem('education')} />
          )}
          {activeSection === 'skills' && (
            <SkillsForm data={cv.skills} updateData={(data) => updateCV('skills', data)} addItem={() => addItem('skills')} />
          )}
          {activeSection === 'languages' && (
            <LanguagesForm data={cv.languages} updateData={(data) => updateCV('languages', data)} addItem={() => addItem('languages')} />
          )}
          {activeSection === 'json' && (
            <JsonView 
              cv={cv} 
              copyJsonToClipboard={copyJsonToClipboard}
              setCv={setCv}
            />
          )}
        </main>
      </div>
    </SidebarProvider>
  )
}

function BasicsForm({ data, updateData }: { data: CV['basics'], updateData: (data: CV['basics']) => void }) {
  const addProfile = () => {
    updateData({
      ...data,
      profiles: [...data.profiles, { network: '', url: '' }]
    })
  }

  const removeProfile = (index: number) => {
    updateData({
      ...data,
      profiles: arrayUtils.removeItem(data.profiles, index)
    })
  }

  const moveProfileUp = (index: number) => {
    updateData({
      ...data,
      profiles: arrayUtils.moveItemUp(data.profiles, index)
    })
  }

  const moveProfileDown = (index: number) => {
    updateData({
      ...data,
      profiles: arrayUtils.moveItemDown(data.profiles, index)
    })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Información Básica</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" value={data.name} onChange={(e) => updateData({ ...data, name: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="label">Título</Label>
          <Input id="label" value={data.label} onChange={(e) => updateData({ ...data, label: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input id="email" type="email" value={data.email} onChange={(e) => updateData({ ...data, email: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="city">Ciudad</Label>
          <Input id="city" value={data.location.city} onChange={(e) => updateData({ ...data, location: { ...data.location, city: e.target.value } })} />
        </div>
        <div>
          <Label htmlFor="country">País</Label>
          <Input id="country" value={data.location.country} onChange={(e) => updateData({ ...data, location: { ...data.location, country: e.target.value } })} />
        </div>
      </div>
      <div>
        <Label htmlFor="summary">Resumen</Label>
        <Textarea id="summary" value={data.summary} onChange={(e) => updateData({ ...data, summary: e.target.value })} />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Perfiles</h3>
          <Button onClick={addProfile} variant="outline" size="sm">Agregar Perfil</Button>
        </div>
        {data.profiles.map((profile, index) => (
          <div key={index} className="border p-4 rounded-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <DragHandleDots2Icon className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Perfil {index + 1}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveProfileUp(index)}
                  disabled={index === 0}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveProfileDown(index)}
                  disabled={index === data.profiles.length - 1}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProfile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`network-${index}`}>Red</Label>
                <Input 
                  id={`network-${index}`} 
                  value={profile.network} 
                  onChange={(e) => {
                    const newProfiles = [...data.profiles]
                    newProfiles[index].network = e.target.value
                    updateData({ ...data, profiles: newProfiles })
                  }} 
                />
              </div>
              <div>
                <Label htmlFor={`url-${index}`}>URL</Label>
                <Input 
                  id={`url-${index}`} 
                  value={profile.url} 
                  onChange={(e) => {
                    const newProfiles = [...data.profiles]
                    newProfiles[index].url = e.target.value
                    updateData({ ...data, profiles: newProfiles })
                  }} 
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Define la interfaz para un elemento de trabajo
interface WorkItem {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  summary: string;
  highlights: string[];
}

// Define la interfaz para las propiedades de SortableWorkItem
interface SortableWorkItemProps {
  item: WorkItem; // Tipo explícito para item
  index: number;
  expandedPanels: Record<number, boolean>;
  togglePanel: (index: number) => void;
  moveWorkUp: (index: number) => void;
  moveWorkDown: (index: number) => void;
  removeWork: (index: number) => void;
  addHighlight: (workIndex: number) => void;
  removeHighlight: (workIndex: number, highlightIndex: number) => void;
  moveHighlightUp: (workIndex: number, highlightIndex: number) => void;
  moveHighlightDown: (workIndex: number, highlightIndex: number) => void;
  updateData: (data: WorkItem[]) => void;
  data: WorkItem[];
}

function SortableWorkItem({
  item,
  index,
  expandedPanels,
  togglePanel,
  moveWorkUp,
  moveWorkDown,
  removeWork,
  addHighlight,
  removeHighlight,
  moveHighlightUp,
  moveHighlightDown,
  updateData,
  data
}: SortableWorkItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: index });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border dark:border-gray-700 p-4 rounded-md dark:bg-gray-800"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div {...attributes} {...listeners}>
            <DragHandleDots2Icon className="h-5 w-5 text-gray-500 dark:text-gray-400 cursor-grab" />
          </div>
          <button
            onClick={() => togglePanel(index)}
            className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100"
          >
            {expandedPanels[index] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <span>{item.company || 'Sin nombre'}</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => moveWorkUp(index)}
            disabled={index === 0}
            className="dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => moveWorkDown(index)}
            disabled={index === data.length - 1}
            className="dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeWork(index)}
            className="text-red-500 hover:text-red-700 dark:hover:bg-gray-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {expandedPanels[index] && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label 
                htmlFor={`company-${index}`}
                className="text-gray-700 dark:text-gray-300"
              >
                Empresa
              </Label>
              <Input 
                id={`company-${index}`}
                value={item.company}
                onChange={(e) => {
                  const newData = [...data]
                  newData[index].company = e.target.value
                  updateData(newData)
                }}
                className="bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
              />
            </div>
            <div>
              <Label htmlFor={`position-${index}`} className="text-gray-700 dark:text-gray-300">
                Cargo
              </Label>
              <Input 
                id={`position-${index}`} 
                value={item.position} 
                onChange={(e) => {
                  const newData = [...data]
                  newData[index].position = e.target.value
                  updateData(newData)
                }}
                className="bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
              />
            </div>
            <div>
              <Label htmlFor={`startDate-${index}`} className="text-gray-700 dark:text-gray-300">
                Fecha de Inicio
              </Label>
              <Input 
                id={`startDate-${index}`} 
                value={item.startDate} 
                onChange={(e) => {
                  const newData = [...data]
                  newData[index].startDate = e.target.value
                  updateData(newData)
                }}
                className="bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
              />
            </div>
            <div>
              <Label htmlFor={`endDate-${index}`} className="text-gray-700 dark:text-gray-300">
                Fecha de Fin
              </Label>
              <Input 
                id={`endDate-${index}`} 
                value={item.endDate} 
                onChange={(e) => {
                  const newData = [...data]
                  newData[index].endDate = e.target.value
                  updateData(newData)
                }}
                className="bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
              />
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor={`summary-${index}`} className="text-gray-700 dark:text-gray-300">
              Resumen
            </Label>
            <Textarea 
              id={`summary-${index}`} 
              value={item.summary} 
              onChange={(e) => {
                const newData = [...data]
                newData[index].summary = e.target.value
                updateData(newData)
              }}
              className="bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
            />
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <Label className="text-gray-700 dark:text-gray-300">
                Logros y Responsabilidades
              </Label>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => addHighlight(index)}
                className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Agregar Logro
              </Button>
            </div>
            
            {item.highlights?.map((highlight, highlightIndex) => (
              <div key={highlightIndex} className="flex items-center gap-2 mt-2">
                <Input
                  value={highlight}
                  onChange={(e) => {
                    const newData = [...data]
                    newData[index].highlights[highlightIndex] = e.target.value
                    updateData(newData)
                  }}
                  placeholder="Describe un logro o responsabilidad"
                  className="bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                />
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveHighlightUp(index, highlightIndex)}
                    disabled={highlightIndex === 0}
                    className="dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveHighlightDown(index, highlightIndex)}
                    disabled={highlightIndex === item.highlights.length - 1}
                    className="dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeHighlight(index, highlightIndex)}
                    className="text-red-500 hover:text-red-700 dark:hover:bg-gray-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function WorkForm({ data, updateData, addItem }: { data: CV['work'], updateData: (data: CV['work']) => void, addItem: () => void }) {
  const [expandedPanels, setExpandedPanels] = React.useState<Record<number, boolean>>(
    data.reduce((acc, _, index) => ({ ...acc, [index]: true }), {})
  )

  const removeWork = (index: number) => {
    updateData(arrayUtils.removeItem(data, index))
  }

  const moveWorkUp = (index: number) => {
    updateData(arrayUtils.moveItemUp(data, index))
  }

  const moveWorkDown = (index: number) => {
    updateData(arrayUtils.moveItemDown(data, index))
  }

  const togglePanel = (index: number) => {
    setExpandedPanels(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const addHighlight = (workIndex: number) => {
    const newData = [...data]
    newData[workIndex].highlights = [...(newData[workIndex].highlights || []), '']
    updateData(newData)
  }

  const removeHighlight = (workIndex: number, highlightIndex: number) => {
    const newData = [...data]
    newData[workIndex].highlights = arrayUtils.removeItem(newData[workIndex].highlights, highlightIndex)
    updateData(newData)
  }

  const moveHighlightUp = (workIndex: number, highlightIndex: number) => {
    const newData = [...data]
    newData[workIndex].highlights = arrayUtils.moveItemUp(newData[workIndex].highlights, highlightIndex)
    updateData(newData)
  }

  const moveHighlightDown = (workIndex: number, highlightIndex: number) => {
    const newData = [...data]
    newData[workIndex].highlights = arrayUtils.moveItemDown(newData[workIndex].highlights, highlightIndex)
    updateData(newData)
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over) {
      updateData(arrayMove(data, Number(active.id), Number(over.id)));
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Experiencia Laboral
      </h2>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={data.map((_, index) => index)}
          strategy={verticalListSortingStrategy}
        >
          {data.map((item, index) => (
            <SortableWorkItem
              key={index}
              item={item}
              index={index}
              expandedPanels={expandedPanels}
              togglePanel={togglePanel}
              moveWorkUp={moveWorkUp}
              moveWorkDown={moveWorkDown}
              removeWork={removeWork}
              addHighlight={addHighlight}
              removeHighlight={removeHighlight}
              moveHighlightUp={moveHighlightUp}
              moveHighlightDown={moveHighlightDown}
              updateData={updateData}
              data={data}
            />
          ))}
        </SortableContext>
      </DndContext>

      <Button 
        onClick={addItem}
        className="dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
      >
        Agregar Experiencia Laboral
      </Button>
    </div>
  )
}

function EducationForm({ data, updateData, addItem }: { data: CV['education'], updateData: (data: CV['education']) => void, addItem: () => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Educación</h2>
      {data.map((item, index) => (
        <div key={index} className="border p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Educación {index + 1}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`institution-${index}`}>Institución</Label>
              <Input id={`institution-${index}`} value={item.institution} onChange={(e) => {
                const newData = [...data]
                newData[index].institution = e.target.value
                updateData(newData)
              }} />
            </div>
            <div>
              <Label htmlFor={`area-${index}`}>Área</Label>
              <Input id={`area-${index}`} value={item.area} onChange={(e) => {
                const newData = [...data]
                newData[index].area = e.target.value
                updateData(newData)
              }} />
            </div>
            <div>
              <Label htmlFor={`studyType-${index}`}>Tipo de Estudio</Label>
              <Input id={`studyType-${index}`} value={item.studyType} onChange={(e) => {
                const newData = [...data]
                newData[index].studyType = e.target.value
                updateData(newData)
              }} />
            </div>
            <div>
              <Label htmlFor={`startDate-${index}`}>Fecha de Inicio</Label>
              <Input id={`startDate-${index}`} value={item.startDate} onChange={(e) => {
                const newData = [...data]
                newData[index].startDate = e.target.value
                updateData(newData)
              }} />
            </div>
            <div>
              <Label htmlFor={`endDate-${index}`}>Fecha de Fin</Label>
              <Input id={`endDate-${index}`} value={item.endDate} onChange={(e) => {
                const newData = [...data]
                newData[index].endDate = e.target.value
                updateData(newData)
              }} />
            </div>
          </div>
        </div>
      ))}
      <Button onClick={addItem}>Agregar Educación</Button>
    </div>
  )
}

function SkillsForm({ data, updateData, addItem }: { data: CV['skills'], updateData: (data: CV['skills']) => void, addItem: () => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Habilidades</h2>
      {data.map((item, index) => (
        <div key={index} className="border p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Habilidad {index + 1}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`name-${index}`}>Nombre</Label>
              <Input id={`name-${index}`} value={item.name} onChange={(e) => {
                const newData = [...data]
                newData[index].name = e.target.value
                updateData(newData)
              }} />
            </div>
            <div>
              <Label htmlFor={`level-${index}`}>Nivel</Label>
              <Input id={`level-${index}`} value={item.level} onChange={(e) => {
                const newData = [...data]
                newData[index].level = e.target.value
                updateData(newData)
              }} />
            </div>
          </div>
          <div className="mt-2">
            <Label htmlFor={`keywords-${index}`}>Palabras clave (separadas por comas)</Label>
            <Input id={`keywords-${index}`} value={item.keywords.join(', ')} onChange={(e) => {
              const newData = [...data]
              newData[index].keywords = e.target.value.split(',').map(k => k.trim())
              updateData(newData)
            }} />
          </div>
        </div>
      ))}
      <Button onClick={addItem}>Agregar Habilidad</Button>
    </div>
  )
}

function LanguagesForm({ data, updateData, addItem }: { data: CV['languages'], updateData: (data: CV['languages']) => void, addItem: () => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Idiomas</h2>
      {data.map((item, index) => (
        <div key={index} className="border p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Idioma {index + 1}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`language-${index}`}>Idioma</Label>
              <Input id={`language-${index}`} value={item.language} onChange={(e) => {
                const newData = [...data]
                newData[index].language = e.target.value
                updateData(newData)
              }} />
            </div>
            <div>
              <Label htmlFor={`fluency-${index}`}>Nivel</Label>
              <Input id={`fluency-${index}`} value={item.fluency} onChange={(e) => {
                const newData = [...data]
                newData[index].fluency = e.target.value
                updateData(newData)
              }} />
            </div>
          </div>
        </div>
      ))}
      <Button onClick={addItem}>Agregar Idioma</Button>
    </div>
  )
}

function JsonView({ 
  cv, 
  copyJsonToClipboard, 
  setCv
}: { 
  cv: CV, 
  copyJsonToClipboard: () => void,
  setCv: React.Dispatch<React.SetStateAction<CV>>
}) {
  const [jsonString, setJsonString] = React.useState(JSON.stringify(cv, null, 2))
  const [error, setError] = React.useState('')

  const handleJsonChange = (value: string) => {
    setJsonString(value)
    try {
      JSON.parse(value)
      setError('')
    } catch (error) {
        console.log(error)
      setError('JSON inválido')
    }
  }

  const handleUpdate = () => {
    try {
      const newCV = JSON.parse(jsonString)
      setCv(newCV)
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Vista JSON</h2>
      <div className="flex justify-end gap-2">
        <Button onClick={copyJsonToClipboard}>Copiar JSON</Button>
        <Button onClick={handleUpdate} disabled={!!error}>Actualizar CV</Button>
      </div>
      <Textarea 
        value={jsonString}
        onChange={(e) => handleJsonChange(e.target.value)}
        className="font-mono min-h-[400px]"
      />
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  )
}