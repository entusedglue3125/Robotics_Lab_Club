"use client"

import { useState, useEffect } from "react"
import type { SiteContent } from "@/lib/content-types"
import HeroTab from "./tabs/hero-tab"
import AboutTab from "./tabs/about-tab"
import StatsTab from "./tabs/stats-tab"
import EventsTab from "./tabs/events-tab"
import TeamsTab from "./tabs/teams-tab"
import GalleryTab from "./tabs/gallery-tab"
import AchievementsTab from "./tabs/achievements-tab"
import ContactTab from "./tabs/contact-tab"

const TABS = ["Hero","About","Stats","Events","Teams","Gallery","Achievements","Contact"]
const PASSWORD = "ROBOTICSLAB2024"

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState("")
  const [pwErr, setPwErr] = useState(false)
  const [tab, setTab] = useState("Hero")
  const [content, setContent] = useState<SiteContent | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (authed) {
      setLoading(true)
      fetch("/api/content").then(r => r.json()).then(d => { setContent(d); setLoading(false) })
    }
  }, [authed])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (pw === PASSWORD) { setAuthed(true); setPwErr(false) }
    else setPwErr(true)
  }

  const save = async () => {
    if (!content) return
    setSaving(true)
    await fetch("/api/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (!authed) return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="glass-card rounded-sm p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <p className="font-mono font-bold text-white text-xl tracking-widest">ROBOTICS LAB <span className="text-green-400">CLUB</span></p>
          <p className="text-slate-500 text-xs font-mono mt-1 tracking-wider">ADMIN PANEL</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-mono text-slate-600 tracking-wider mb-1.5 block">ACCESS CODE</label>
            <input type="password" value={pw} onChange={e => setPw(e.target.value)}
              className="w-full bg-black/50 border border-green-500/20 focus:border-green-500/60 rounded-sm px-3 py-2.5 text-sm font-mono text-white outline-none transition-colors"
              placeholder="Enter password" autoFocus />
            {pwErr && <p className="text-red-400 text-xs font-mono mt-1">ACCESS DENIED</p>}
          </div>
          <button type="submit" className="w-full btn-matrix py-3 text-sm font-mono tracking-widest rounded-sm"><span>AUTHENTICATE</span></button>
        </form>
      </div>
    </div>
  )

  if (loading || !content) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-green-400 font-mono text-sm animate-pulse tracking-widest">LOADING CONTENT...</div>
    </div>
  )

  const tabProps = { content, setContent }

  return (
    <div className="min-h-screen bg-black pixel-bg">
      {/* Header */}
      <header className="glass border-b border-green-500/20 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div>
          <p className="font-mono font-bold text-white tracking-widest">ROBOTICS LAB <span className="text-green-400">CLUB</span> <span className="text-slate-500 text-xs">/ ADMIN</span></p>
          <p className="text-slate-600 text-xs font-mono">Content Management System</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank" className="text-xs font-mono text-slate-400 hover:text-green-400 transition-colors px-3 py-1.5 border border-white/10 rounded-sm">
            VIEW SITE ↗
          </a>
          <button onClick={save} disabled={saving}
            className="btn-matrix px-5 py-2 text-xs font-mono tracking-widest rounded-sm disabled:opacity-50">
            <span>{saving ? "SAVING..." : saved ? "✓ SAVED!" : "SAVE CHANGES"}</span>
          </button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-65px)]">
        {/* Sidebar tabs */}
        <nav className="w-44 shrink-0 border-r border-green-500/10 py-6 px-3 flex flex-col gap-1">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`w-full text-left px-3 py-2 rounded-sm text-xs font-mono tracking-wider transition-all ${
                tab === t ? "bg-green-500/10 text-green-400 border border-green-500/30" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
              }`}>
              {t.toUpperCase()}
            </button>
          ))}
          <div className="mt-auto">
            <button onClick={() => setAuthed(false)} className="w-full text-left px-3 py-2 text-xs font-mono text-slate-700 hover:text-red-400 transition-colors">
              LOGOUT
            </button>
          </div>
        </nav>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-6">
          {tab === "Hero" && <HeroTab {...tabProps} />}
          {tab === "About" && <AboutTab {...tabProps} />}
          {tab === "Stats" && <StatsTab {...tabProps} />}
          {tab === "Events" && <EventsTab {...tabProps} />}
          {tab === "Teams" && <TeamsTab {...tabProps} />}
          {tab === "Gallery" && <GalleryTab {...tabProps} />}
          {tab === "Achievements" && <AchievementsTab {...tabProps} />}
          {tab === "Contact" && <ContactTab {...tabProps} />}
        </main>
      </div>
    </div>
  )
}
