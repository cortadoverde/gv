import ConsoleCV from '@/components/ConsoleCV';

// Función para obtener datos del Gist
async function getGistData(gistId: string) {
  const response = await fetch(`https://api.github.com/gists/${gistId}`);

  if (!response.ok) {
    throw new Error('No se pudo obtener el Gist');
  }

  const data = await response.json();
  // Asumiendo que el CV está en el primer archivo del Gist
  const firstFile = Object.values(data.files)[0] as { content?: string };
  return JSON.parse(firstFile?.content || '{}');
}

// Componente de la página dinámica
export default async function CVPage(params: {
  params: Promise<{ gistId: string }>;
}) {
  const { gistId } = await params.params;
  const cvData = await getGistData(gistId);

  return (
    <main className="min-h-screen">
      <ConsoleCV cv={cvData} />
    </main>
  );
}
