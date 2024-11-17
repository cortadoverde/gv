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