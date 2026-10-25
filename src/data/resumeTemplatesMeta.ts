export interface ResumeTemplateMeta {
  id: 'executive-dark' | 'enhancv-two-column' | 'modern-clean' | 'classic-ats';
  name: string;
  subtitle: string;
  description: string;
  category: 'Top Picks' | 'ATS Optimized' | 'Executive' | 'Modern' | 'Classic';
  atsFriendly: boolean;
  style: 'Modern' | 'Classic' | 'Executive' | 'Creative';
  layout: 'Single Column' | 'Two-Column' | 'Sidebar';
  experience: 'Entry' | 'Mid-Level' | 'Senior' | 'Executive';
  colorTone: 'Navy' | 'Black' | 'Green' | 'Blue' | 'Charcoal';
  hasPhoto: boolean;
  columns: 1 | 2;
  badge?: string;
  features: string[];
}

export const RESUME_TEMPLATES_META: ResumeTemplateMeta[] = [
  {
    id: 'enhancv-two-column',
    name: 'Enhancv Two-Column',
    subtitle: 'Balanced 2-Column with Key Achievements',
    description: 'Our most popular template. Features a balanced dual-column layout highlighting key metrics, strengths, and professional experience side-by-side.',
    category: 'Top Picks',
    atsFriendly: true,
    style: 'Modern',
    layout: 'Two-Column',
    experience: 'Senior',
    colorTone: 'Green',
    hasPhoto: false,
    columns: 2,
    badge: 'Most Popular',
    features: ['Highlighted Key Achievements', 'Core Skills Tag Cloud', 'Optimized for ATS Scanners', 'Clean Professional Spacing']
  },
  {
    id: 'executive-dark',
    name: 'Executive Dark Sidebar',
    subtitle: 'Distinctive Dark Left Panel & Summary',
    description: 'A striking executive format with a high-contrast dark sidebar for contact info, skills, and languages, paired with a clean white details panel.',
    category: 'Executive',
    atsFriendly: true,
    style: 'Executive',
    layout: 'Sidebar',
    experience: 'Executive',
    colorTone: 'Charcoal',
    hasPhoto: false,
    columns: 2,
    badge: 'Executive Choice',
    features: ['High-Contrast Sidebar', 'Visual Language Proficiency Dots', 'Structured Executive Summary', 'Professional Typography']
  },
  {
    id: 'modern-clean',
    name: 'Modern Clean',
    subtitle: 'Metric-Driven & Recruiter Focused',
    description: 'Designed for engineering, product, and tech leaders. Focuses on structured timeline bullets, quantifiable achievements, and rapid recruiter scanning.',
    category: 'Modern',
    atsFriendly: true,
    style: 'Modern',
    layout: 'Single Column',
    experience: 'Mid-Level',
    colorTone: 'Blue',
    hasPhoto: false,
    columns: 1,
    badge: 'Tech Favorite',
    features: ['Metric-Driven Bullets', 'Clean Single Column Flow', 'Instant Recruiter Readability', 'Seamless PDF Export']
  },
  {
    id: 'classic-ats',
    name: 'Classic ATS Traditional',
    subtitle: 'Strict Single-Column Standard',
    description: 'Traditional academic and corporate resume layout built for strict ATS parsing engines and conservative hiring managers.',
    category: 'ATS Optimized',
    atsFriendly: true,
    style: 'Classic',
    layout: 'Single Column',
    experience: 'Entry',
    colorTone: 'Black',
    hasPhoto: false,
    columns: 1,
    badge: '100% ATS Pass Rate',
    features: ['Strict Single Column', 'Zero Parser Obstacles', 'Standard Section Headings', 'Universally Accepted']
  }
];
