/* ─── Site Content Types ─── */

export interface Project {
  id: string;
  title: string;
  category: string;
  video: string;
  accent: string;
  summary: string;
  team: string;
  client: string;
  industry: string;
  type: string;
  thumbnail?: string; // custom thumbnail: uploaded path, data URL, or Google Drive image link
  orientation?: 'portrait' | 'landscape'; // sizes the Drive player (its iframe can't report video size)
}

export interface Service {
  id: string;
  icon: string; // Lucide icon name
  title: string;
  description: string;
  accent: string;
}

export interface Stat {
  value: string;
  label: string;
  iconType: 'video' | 'calendar' | 'flask';
}

export interface Software {
  name: string;
  abbr: string;
  bg: string;
  color: string;
  isRive?: boolean;
  isFigma?: boolean;
}

export interface AboutContent {
  name: string;
  title: string;
  image: string;
  greeting: string;
  bio: string[];
  stats: Stat[];
  editingSoftware: Software[];
  aiTools: string[];
}

export interface ProcessStep {
  num: string;
  title: string;
  desc: string;
}

export interface ProcessContent {
  title: string;
  titleHighlight: string;
  subtitle: string;
  steps: ProcessStep[];
}

export interface CTAContent {
  headline: string;
  buttonText: string;
  buttonLink: string;
  email: string;
}

export interface FooterContent {
  name: string;
  title: string;
  copyright: string;
  tagline: string;
}

export interface SocialLinks {
  instagram: string;
  email: string;
  whatsapp: string;
  [key: string]: string; // allow additional links
}

export interface NavItem {
  label: string;
  href: string;
}

export interface NavContent {
  items: NavItem[];
  logo: string;
}

export interface HeroContent {
  badge: string;
  headline: string;
  subtext: string;
}

export interface LoadingContent {
  name: string;
  subtitle: string;
}

export interface SEOContent {
  title: string;
  description: string;
  keywords: string;
}

export interface SectionsEnabled {
  hero: boolean;
  showcase: boolean;
  services: boolean;
  about: boolean;
  process: boolean;
  cta: boolean;
  footer: boolean;
  [key: string]: boolean;
}

export interface SettingsContent {
  sectionsEnabled: SectionsEnabled;
}

export interface SiteContent {
  hero: HeroContent;
  projects: {
    motion: Project[];
    editing: Project[];
    ai: Project[];
  };
  services: Service[];
  about: AboutContent;
  process: ProcessContent;
  cta: CTAContent;
  footer: FooterContent;
  social: SocialLinks;
  nav: NavContent;
  loading: LoadingContent;
  seo: SEOContent;
  settings: SettingsContent;
}
