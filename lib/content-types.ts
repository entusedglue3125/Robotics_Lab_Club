// All TypeScript interfaces for site content

export interface HeroContent {
  phrases: string[]
  tagline: string
  ctaPrimary: string
  ctaSecondary: string
  badge: string
}

export interface Pillar {
  icon: string
  title: string
  description: string
}

export interface AboutContent {
  heading: string
  paragraphs: string[]
  techTags: string[]
  pillars: Pillar[]
  imageUrl: string
  imageCaption: string
}

export interface Stat {
  value: number
  label: string
  suffix: string
  prefix: string
}

export interface SubStat {
  label: string
  val: string
}

export interface StatsContent {
  stats: Stat[]
  subStats: SubStat[]
}

export interface Event {
  id: string
  title: string
  type: string
  date: string
  time: string
  venue: string
  description: string
  status: "upcoming" | "past"
  image: string
  color: "green" | "cyan"
}

export interface EventsContent {
  events: Event[]
}

export interface TeamMember {
  id: string
  name: string
  role: string
  focus: string
  image: string
  github: string
  linkedin: string
}

export interface TeamDivision {
  id: string
  division: string
  tag: string
  members: TeamMember[]
}

export interface TeamsContent {
  teams: TeamDivision[]
}

export interface GalleryImage {
  id: string
  src: string
  alt: string
  caption: string
  span: string
}

export interface GalleryContent {
  images: GalleryImage[]
  instagramHandle: string
}

export interface Achievement {
  id: string
  year: string
  title: string
  subtitle: string
  description: string
  icon: string
  color: "green" | "cyan"
  highlight: boolean
}

export interface AchievementsContent {
  achievements: Achievement[]
}

export interface SocialLink {
  label: string
  handle: string
  href: string
}

export interface ContactContent {
  email: string
  location: string
  locationDetail: string
  meetingSchedule: string
  socials: SocialLink[]
  formTitle: string
  successMessage: string
}

export interface SiteContent {
  hero: HeroContent
  about: AboutContent
  stats: StatsContent
  events: EventsContent
  teams: TeamsContent
  gallery: GalleryContent
  achievements: AchievementsContent
  contact: ContactContent
}
