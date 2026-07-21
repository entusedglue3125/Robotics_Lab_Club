import type { SiteContent } from "@/lib/content-types"
import Navbar from "@/components/ui/navbar"
import RainingLetters from "@/components/ui/modern-animated-hero-section"
import AboutSection from "@/components/ui/about-section"
import StatsSection from "@/components/ui/stats-section"
import EventsSection from "@/components/ui/events-section"
import TeamsSection from "@/components/ui/teams-section"
import GallerySection from "@/components/ui/gallery-section"
import AchievementsSection from "@/components/ui/achievements-section"
import ContactSection from "@/components/ui/contact-section"
import { getSiteContent } from "@/lib/db"

export default async function Home() {
  const content = await getSiteContent()

  return (
    <>
      <Navbar />
      <RainingLetters data={content.hero} />
      <AboutSection data={content.about} />
      <div className="matrix-divider" />
      <StatsSection data={content.stats} />
      <div className="matrix-divider" />
      <EventsSection data={content.events} />
      <div className="matrix-divider" />
      <TeamsSection data={content.teams} />
      <div className="matrix-divider" />
      <GallerySection data={content.gallery} />
      <div className="matrix-divider" />
      <AchievementsSection data={content.achievements} />
      <div className="matrix-divider" />
      <ContactSection data={content.contact} />
    </>
  )
}
