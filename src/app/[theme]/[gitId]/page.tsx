import dynamic from 'next/dynamic';

// Función para obtener datos del Gist
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

// Componente de la página dinámica
export default async function CVPage(params: {
    params: Promise<{ gistId: string, theme: string }>;
  }) {
  const { gistId, theme } = await params.params;
  const cvData = await getGistData(gistId);
  
  const ThemeComponent = dynamic(() => import(`@/components/${theme}`), {
    ssr: true
  });

  return (
    <main className="min-h-screen">
      {/* @ts-expect-error Server Component */}
      <ThemeComponent cv={cvData} />
    </main>
  );
}
