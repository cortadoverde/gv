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
} 