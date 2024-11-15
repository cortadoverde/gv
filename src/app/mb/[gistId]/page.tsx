
import RetroCV from '@/components/RetroCV';
import { mockCV } from '@/mocks/cv-data';

async function getGistData(gistId: string) {
    const response = await fetch(`https://api.github.com/gists/${gistId}`);
    
    if (!response.ok) {
      throw new Error('No se pudo obtener el Gist');
    }
    console.log(response);
  
    const data = await response.json();
    // Asumiendo que el CV está en el primer archivo del Gist
    const firstFile = Object.values(data.files)[0] as { content: string };
    return JSON.parse(firstFile.content);
  }

export default async function MarioPage(params: {
  params: Promise<{ gistId: string }>;
}) {
  try {
    const { gistId } = await params.params;
    const cvData = await getGistData(gistId);
    
    return (
      <main className="min-h-screen">
        <RetroCV cv={cvData} />
      </main>
    );
  } catch (error) {
    console.error('Error cargando datos del Gist, usando mock:', error);
    return (
      <main className="min-h-screen">
        <RetroCV cv={mockCV} />
      </main>
    );
  }
}
