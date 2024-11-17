'use client'

import * as React from 'react'
import { ChevronDown, ChevronUp, ChevronRight, Trash2, Plus } from 'lucide-react'
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

// Utility functions
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

// Portfolio item interface
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
  collaborators?: Array<{
    name: string;
    role: string;
    url?: string;
  }>;
  stats?: {
    views?: number;
    likes?: number;
    comments?: number;
  };
  featured: boolean;
  processSteps?: Array<{
    title: string;
    description: string;
    image?: string;
  }>;
}

type PortfolioItemValue = 
  | string 
  | boolean 
  | Array<{ url: string; caption?: string }> 
  | Array<{ type: 'live' | 'github' | 'behance' | 'dribbble' | 'other'; url: string; label?: string }> 
  | string[] 
  | Array<{ name: string; role: string; url?: string }> 
  | { views?: number; likes?: number; comments?: number } 
  | Array<{ title: string; description: string; image?: string }>;

// SortablePortfolioItem props interface
interface SortablePortfolioItemProps {
  item: PortfolioItem;
  index: number;
  expandedPanels: Record<number, boolean>;
  togglePanel: (index: number) => void;
  moveItemUp: (index: number) => void;
  moveItemDown: (index: number) => void;
  removeItem: (index: number) => void;
  updateData: (data: PortfolioItem[]) => void;
  data: PortfolioItem[];
}

function SortablePortfolioItem({
  item,
  index,
  expandedPanels,
  togglePanel,
  moveItemUp,
  moveItemDown,
  removeItem,
  updateData,
  data
}: SortablePortfolioItemProps) {
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

  const updateItem = (key: keyof PortfolioItem, value: PortfolioItemValue) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [key]: value };
    updateData(newData);
  };

  const addImage = () => {
    const newImages = [...item.images, { url: '', caption: '' }];
    updateItem('images', newImages);
  };

  const updateImage = (imageIndex: number, key: 'url' | 'caption', value: string) => {
    const newImages = [...item.images];
    newImages[imageIndex] = { ...newImages[imageIndex], [key]: value };
    updateItem('images', newImages);
  };

  const removeImage = (imageIndex: number) => {
    const newImages = item.images.filter((_, i) => i !== imageIndex);
    updateItem('images', newImages);
  };

  const addLink = () => {
    const newLinks = [...item.links, { type: 'other', url: '', label: '' }];
    updateItem('links', newLinks);
  };

  const updateLink = (linkIndex: number, key: 'type' | 'url' | 'label', value: string) => {
    const newLinks = [...item.links];
    newLinks[linkIndex] = { ...newLinks[linkIndex], [key]: value } as { type: 'live' | 'github' | 'behance' | 'dribbble' | 'other'; url: string; label?: string };
    updateItem('links', newLinks);
  };

  const removeLink = (linkIndex: number) => {
    const newLinks = item.links.filter((_, i) => i !== linkIndex);
    updateItem('links', newLinks);
  };

  const addCollaborator = () => {
    const newCollaborators = [...(item.collaborators || []), { name: '', role: '', url: '' }];
    updateItem('collaborators', newCollaborators);
  };

  const updateCollaborator = (collabIndex: number, key: 'name' | 'role' | 'url', value: string) => {
    const newCollaborators = [...(item.collaborators || [])];
    newCollaborators[collabIndex] = { ...newCollaborators[collabIndex], [key]: value };
    updateItem('collaborators', newCollaborators);
  };

  const removeCollaborator = (collabIndex: number) => {
    const newCollaborators = (item.collaborators || []).filter((_, i) => i !== collabIndex);
    updateItem('collaborators', newCollaborators);
  };

  const addProcessStep = () => {
    const newSteps = [...(item.processSteps || []), { title: '', description: '', image: '' }];
    updateItem('processSteps', newSteps);
  };

  const updateProcessStep = (stepIndex: number, key: 'title' | 'description' | 'image', value: string) => {
    const newSteps = [...(item.processSteps || [])];
    newSteps[stepIndex] = { ...newSteps[stepIndex], [key]: value };
    updateItem('processSteps', newSteps);
  };

  const removeProcessStep = (stepIndex: number) => {
    const newSteps = (item.processSteps || []).filter((_, i) => i !== stepIndex);
    updateItem('processSteps', newSteps);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border dark:border-gray-700 p-4 rounded-md dark:bg-gray-800 mb-4"
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
            <span>{item.title || 'Untitled Project'}</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => moveItemUp(index)}
            disabled={index === 0}
            className="dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => moveItemDown(index)}
            disabled={index === data.length - 1}
            className="dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeItem(index)}
            className="text-red-500 hover:text-red-700 dark:hover:bg-gray-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {expandedPanels[index] && (
        <>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor={`title-${index}`} className="text-gray-700 dark:text-gray-300">
                Title
              </Label>
              <Input 
                id={`title-${index}`}
                value={item.title}
                onChange={(e) => updateItem('title', e.target.value)}
                className="bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
              />
            </div>
            <div>
              <Label htmlFor={`category-${index}`} className="text-gray-700 dark:text-gray-300">
                Category
              </Label>
              <Input 
                id={`category-${index}`}
                value={item.category}
                onChange={(e) => updateItem('category', e.target.value)}
                className="bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
              />
            </div>
            <div>
              <Label htmlFor={`date-${index}`} className="text-gray-700 dark:text-gray-300">
                Date
              </Label>
              <Input 
                id={`date-${index}`}
                value={item.date}
                onChange={(e) => updateItem('date', e.target.value)}
                className="bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
              />
            </div>
            <div>
              <Label htmlFor={`coverImage-${index}`} className="text-gray-700 dark:text-gray-300">
                Cover Image URL
              </Label>
              <Input 
                id={`coverImage-${index}`}
                value={item.coverImage}
                onChange={(e) => updateItem('coverImage', e.target.value)}
                className="bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
              />
            </div>
          </div>

          <div className="mb-4">
            <Label htmlFor={`description-${index}`} className="text-gray-700 dark:text-gray-300">
              Description
            </Label>
            <Textarea 
              id={`description-${index}`}
              value={item.description}
              onChange={(e) => updateItem('description', e.target.value)}
              className="bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
            />
          </div>

          <div className="mb-4">
            <Label className="text-gray-700 dark:text-gray-300">Images</Label>
            {item.images.map((image, imageIndex) => (
              <div key={imageIndex} className="flex items-center gap-2 mt-2">
                <Input
                  value={image.url}
                  onChange={(e) => updateImage(imageIndex, 'url', e.target.value)}
                  placeholder="Image URL"
                  className="bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                />
                <Input
                  value={image.caption || ''}
                  onChange={(e) => updateImage(imageIndex, 'caption', e.target.value)}
                  placeholder="Caption (optional)"
                  className="bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeImage(imageIndex)}
                  className="text-red-500 hover:text-red-700 dark:hover:bg-gray-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={addImage}
              className="mt-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Image
            </Button>
          </div>

          <div className="mb-4">
            <Label className="text-gray-700 dark:text-gray-300">Tools</Label>
            <Input 
              value={item.tools.join(', ')}
              onChange={(e) => updateItem('tools', e.target.value.split(',').map(tool => tool.trim()))}
              placeholder="Comma-separated list of tools"
              className="bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
            />
          </div>

          <div className="mb-4">
            <Label className="text-gray-700 dark:text-gray-300">Tags</Label>
            <Input 
              value={item.tags.join(', ')}
              onChange={(e) => updateItem('tags', e.target.value.split(',').map(tag => tag.trim()))}
              placeholder="Comma-separated list of tags"
              className="bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
            />
          </div>

          <div className="mb-4">
            <Label className="text-gray-700 dark:text-gray-300">Links</Label>
            {item.links.map((link, linkIndex) => (
              <div key={linkIndex} className="flex items-center gap-2 mt-2">
                <select
                  value={link.type}
                  onChange={(e) => updateLink(linkIndex, 'type', e.target.value as string)}
                  className="bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 rounded-md"
                >
                  <option value="live">Live</option>
                  <option value="github">GitHub</option>
                  <option value="behance">Behance</option>
                  <option value="dribbble">Dribbble</option>
                  <option value="other">Other</option>
                </select>
                <Input
                  value={link.url}
                  onChange={(e) => updateLink(linkIndex, 'url', e.target.value)}
                  placeholder="URL"
                  className="bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                />
                <Input
                  value={link.label || ''}
                  onChange={(e) => updateLink(linkIndex, 'label', e.target.value)}
                  placeholder="Label (optional)"
                  className="bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLink(linkIndex)}
                  className="text-red-500 hover:text-red-700 dark:hover:bg-gray-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={addLink}
              className="mt-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Link
            </Button>
          </div>

          <div className="mb-4">
            <Label className="text-gray-700 dark:text-gray-300">Collaborators</Label>
            {item.collaborators?.map((collaborator, collabIndex) => (
              <div key={collabIndex} className="flex items-center gap-2 mt-2">
                <Input
                  value={collaborator.name}
                  onChange={(e) => updateCollaborator(collabIndex, 'name', e.target.value)}
                  placeholder="Name"
                  className="bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                />
                <Input
                  value={collaborator.role}
                  onChange={(e) => updateCollaborator(collabIndex, 'role', e.target.value)}
                  placeholder="Role"
                  className="bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                />
                <Input
                  value={collaborator.url || ''}
                  onChange={(e) => updateCollaborator(collabIndex, 'url', e.target.value)}
                  placeholder="URL (optional)"
                  className="bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCollaborator(collabIndex)}
                  className="text-red-500 hover:text-red-700 dark:hover:bg-gray-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={addCollaborator}
              className="mt-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Collaborator
            </Button>
          </div>

          <div className="mb-4">
            <Label className="text-gray-700 dark:text-gray-300">Stats</Label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor={`views-${index}`} className="text-gray-700 dark:text-gray-300">
                  Views
                </Label>
                <Input 
                  id={`views-${index}`}
                  type="number"
                  value={item.stats?.views || ''}
                  onChange={(e) => updateItem('stats', { ...(item.stats || {}), views: parseInt(e.target.value) || undefined })}
                  className="bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                />
              </div>
              <div>
                <Label htmlFor={`likes-${index}`} className="text-gray-700 dark:text-gray-300">
                  Likes
                </Label>
                <Input 
                  id={`likes-${index}`}
                  type="number"
                  value={item.stats?.likes || ''}
                  onChange={(e) => updateItem('stats', { ...item.stats, likes: parseInt(e.target.value) || undefined })}
                  className="bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                />
              </div>
              <div>
                <Label htmlFor={`comments-${index}`} className="text-gray-700 dark:text-gray-300">
                  Comments
                </Label>
                <Input 
                  id={`comments-${index}`}
                  type="number"
                  value={item.stats?.comments || ''}
                  onChange={(e) => updateItem('stats', { ...item.stats, comments: parseInt(e.target.value) || undefined })}
                  className="bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={item.featured}
                onChange={(e) => updateItem('featured', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              Featured Project
            </Label>
          </div>

          <div className="mb-4">
            <Label className="text-gray-700 dark:text-gray-300">Process Steps</Label>
            {item.processSteps?.map((step, stepIndex) => (
              <div key={stepIndex} className="mt-2 p-4 border dark:border-gray-700 rounded-md">
                <Input
                  value={step.title}
                  onChange={(e) => updateProcessStep(stepIndex, 'title', e.target.value)}
                  placeholder="Step Title"
                  className="mb-2 bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                />
                <Textarea
                  value={step.description}
                  onChange={(e) => updateProcessStep(stepIndex, 'description', e.target.value)}
                  placeholder="Step Description"
                  className="mb-2 bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                />
                <Input
                  value={step.image || ''}
                  onChange={(e) => updateProcessStep(stepIndex, 'image', e.target.value)}
                  placeholder="Step Image URL (optional)"
                  className="mb-2 bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProcessStep(stepIndex)}
                  className="text-red-500 hover:text-red-700 dark:hover:bg-gray-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Remove Step
                </Button>
              </div>
            ))}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={addProcessStep}
              className="mt-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Process Step
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default function PortfolioForm({ data, updateData, addItem }: { data: PortfolioItem[], updateData: (data: PortfolioItem[]) => void, addItem: () => void }) {
  const [expandedPanels, setExpandedPanels] = React.useState<Record<number, boolean>>(
    data.reduce((acc, _, index) => ({ ...acc, [index]: false }), {})
  )

  const removeItem = (index: number) => {
    updateData(arrayUtils.removeItem(data, index))
  }

  const moveItemUp = (index: number) => {
    updateData(arrayUtils.moveItemUp(data, index))
  }

  const moveItemDown = (index: number) => {
    updateData(arrayUtils.moveItemDown(data, index))
  }

  const togglePanel = (index: number) => {
    setExpandedPanels(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
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
        Portfolio
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
            <SortablePortfolioItem
              key={index}
              item={item}
              index={index}
              expandedPanels={expandedPanels}
              togglePanel={togglePanel}
              moveItemUp={moveItemUp}
              moveItemDown={moveItemDown}
              removeItem={removeItem}
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
        Add Portfolio Item
      </Button>
    </div>
  )
}