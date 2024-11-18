# Gist Vitae

Visualizador de CVs en formato Gist.

## Interface

```tsx
export interface CV {
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
  portfolio: Array<{
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
  }>;
}
```

```json
{
  "basics": {
    "name": "",
    "label": "",
    "email": "",
    "summary": "",
    "location": {
      "city": "",
      "country": ""
    },
    "profiles": []
  },
  "work": [],
  "education": [],
  "skills": [],
  "languages": [],
  "portfolio": []
}
```

## Next App

La aplicación permite renderizar un CV interactivo a partir de un objeto JSON. El objeto JSON debe tener la estructura de la interfaz CV.

```tsx
export default function CVPage({ cv }: { cv: CV }) {
  return (
    <main className="min-h-screen">
      <ConsoleCV cv={cv} />
    </main>
  );
}
```

## Router


`/` muestra el editor de CV.

`/render/:theme/:gistId` muestra el CV interactivo de un Gist.

:theme es el nombre del componente que va a renderizar el CV. Por ejemplo, si se quiere renderizar el CV con la interfaz de modern, se debe usar `/render/modern/:gistId`.

:gistId es el ID del Gist que contiene el CV.

### Themes

- modern: Interfaz moderna de CV.
- console: Interfaz de consola de CV.
- recipe: Interfaz de receta de CV.

### Ejemplos

- [https://gv-mocha.vercel.app/render/modern/82c57d82c8c97331177e0f3340b98c71](https://gv-mocha.vercel.app/render/modern/82c57d82c8c97331177e0f3340b98c71)