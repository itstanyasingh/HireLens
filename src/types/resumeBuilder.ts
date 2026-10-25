export interface AchievementItem {
  id: string;
  title: string;
  metric: string;
  description: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  dates: string;
  location: string;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  year: string;
  location: string;
  honors?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  role?: string;
  link?: string;
  bullets: string[];
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: string; // e.g. Native, Fluent, Advanced, Intermediate
  levelScore: number; // 1 to 5
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface PersonalInfo {
  fullName: string;
  targetTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
  avatarUrl?: string;
}

export interface ResumeData {
  personal: PersonalInfo;
  summary: string;
  keyAchievements: AchievementItem[];
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
}

export type TemplateId = 
  | 'executive-dark'       // Dark left column (Violet Rodriguez style)
  | 'enhancv-two-column'   // Balanced 2-column with Strengths & Key Achievements (Justin Coleman style)
  | 'modern-clean'         // Clean metric-driven layout (Johnatan Carrillo style)
  | 'classic-ats';         // Single-column traditional ATS layout

export type AccentColor = 
  | '#16B889' // Enhancv Mint
  | '#1E3A8A' // Deep Navy
  | '#4F46E5' // Indigo
  | '#991B1B' // Crimson
  | '#334155'; // Charcoal Slate

export type FontFamily = 'sans' | 'serif' | 'mono';
export type SpacingDensity = 'compact' | 'comfortable';

export interface ResumeDesign {
  templateId: TemplateId;
  accentColor: AccentColor;
  fontFamily: FontFamily;
  spacing: SpacingDensity;
}
