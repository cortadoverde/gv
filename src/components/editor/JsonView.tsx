'use client'

import * as React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CV } from "@/types/cv"


export default function JsonView({ 
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
    const [gistId, setGistId] = React.useState('')
  
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
    
    async function getGistData(gistId: string) {
        const response = await fetch(`https://api.github.com/gists/${gistId}`);
      
        if (!response.ok) {
          throw new Error('No se pudo obtener el Gist' + gistId);
        }
      
        const data = await response.json();
        // Asumiendo que el CV está en el primer archivo del Gist
        const firstFile = Object.values(data.files)[0] as { content?: string };
        return JSON.parse(firstFile?.content || '{}');
      }

    const fetchGist = async () => {
      try {
        const gist = await getGistData(gistId)
        setCv(gist) // Asumiendo que el gist tiene la estructura adecuada para el CV
        setJsonString(JSON.stringify(gist, null, 2))
      } catch (error) {
        console.error('Error al obtener el Gist:', error)
      }
    }
  
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Vista JSON</h2>
        <div className="flex gap-2">
          <Input placeholder="ID del Gist" onChange={(e) => setGistId(e.target.value)} />
          <Button onClick={fetchGist}>Obtener Gist</Button>
        </div>
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