'use client'

import * as React from 'react'
import { ChevronDown, ChevronUp, ChevronRight, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DragHandleDots2Icon } from "@radix-ui/react-icons"
import { DragEndEvent } from '@dnd-kit/core';
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

import { CV } from "@/types/cv"

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
  
  export default function WorkForm({ data, updateData, addItem }: { data: CV['work'], updateData: (data: CV['work']) => void, addItem: () => void }) {
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
  