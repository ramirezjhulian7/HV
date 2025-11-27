export interface ExperienceItem {
  company: string;
  position: string;
  period: string;
  project: string;
  projectPeriod?: string;
  description: string;
  highlights: string[];
}

export interface Skills {
  language: string[];
  languages: string[];
  backend: string[];
  frontend: string[];
  databases: string[];
  cloud: string[];
  architecture: string[];
  devops: string[];
  testing: string[];
  emergingTech: string[];
}

export interface ContactInfo {
  email: string;
  linkedin: string;
  phone: string;
  location: string;
}
