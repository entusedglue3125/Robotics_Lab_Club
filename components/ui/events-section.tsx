"use client"

import { useState } from "react"
import { Calendar, MapPin, Clock, ArrowRight, X, Maximize2 } from "lucide-react"
import type { EventsContent } from "@/lib/content-types"

const DEFAULT: EventsContent = { events: [] }

const colorMap = {
  green: { badge: "bg-green-500/10 text-green-400 border-green-500/30", glow: "group-hover:border-green-500/40" },
  cyan: { badge: "bg-green-500/10 text-green-400 border-green-500/30", glow: "group-hover:border-green-500/40" },
}

export default function EventsSection({ data }: { data?: EventsContent }) {
  const d = data ?? DEFAULT
  const [activeModalImage, setActiveModalImage] = useState<string | null>(null)

  const upcoming = d.events.filter(e => e.status === "upcoming")
  const past = d.events.filter(e => e.status === "past")

  return (
    <section id="events" className="relative bg-black py-24 px-4">
      <div className="absolute inset-0 pixel-bg opacity-30" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="matrix-tag mb-4 inline-block">// EVENTS_LOG</span>
          <h2 className="text-4xl md:text-5xl font-mono font-bold text-white mt-4">
            Events & <span className="gradient-text">Workshops</span>
          </h2>
          <div className="matrix-divider mt-6 max-w-xs mx-auto" />
        </div>

        {upcoming.length > 0 && (
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <h3 className="font-mono text-sm text-green-400 tracking-widest uppercase">Upcoming Events</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {upcoming.map((event) => {
                const colors = colorMap[event.color]
                return (
                  <div key={event.id} className={`glass-card rounded-sm overflow-hidden group ${colors.glow}`}>
                    {/* Event Poster Container - Natural Aspect Ratio & Uncropped */}
                    <div className="relative bg-black/80 flex items-center justify-center p-2 border-b border-green-500/10">
                      <img
                        src={event.image}
                        alt={event.title}
                        onClick={() => setActiveModalImage(event.image)}
                        className="w-full h-auto max-h-[650px] object-contain rounded-sm cursor-pointer transition-transform duration-300 group-hover:scale-[1.01]"
                      />
                      <div className="absolute top-4 right-4 z-10 flex gap-2">
                        <span className={`text-xs font-mono px-2.5 py-1 border rounded-sm backdrop-blur-md ${colors.badge}`}>{event.type}</span>
                        <button
                          onClick={() => setActiveModalImage(event.image)}
                          title="View full poster"
                          className="bg-black/70 hover:bg-black text-green-400 p-1.5 rounded-sm border border-green-500/30 transition-colors"
                        >
                          <Maximize2 size={13} />
                        </button>
                      </div>
                      <div className="absolute top-4 left-4 z-10">
                        <span className="text-xs font-mono px-2.5 py-1 bg-green-500 text-black font-bold rounded-sm shadow-md">UPCOMING</span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h4 className="font-mono font-bold text-white text-base mb-2">{event.title}</h4>
                      <p className="text-slate-400 text-xs font-mono mb-4 leading-relaxed">{event.description}</p>
                      <div className="flex flex-wrap gap-3 text-xs font-mono text-slate-500">
                        <span className="flex items-center gap-1.5"><Calendar size={13} className="text-green-500" /> {event.date}</span>
                        <span className="flex items-center gap-1.5"><Clock size={13} className="text-green-500" /> {event.time}</span>
                        <span className="flex items-center gap-1.5"><MapPin size={13} className="text-green-500" /> {event.venue}</span>
                      </div>
                      <div className="mt-5 flex justify-end">
                        <a
                          href="https://robotics-lab-club-peela-2.netlify.app/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-matrix px-4 py-2 text-xs font-mono tracking-widest rounded-sm inline-flex items-center gap-1.5"
                        >
                          <span>REGISTER <ArrowRight size={12} /></span>
                        </a>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {past.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-slate-600" />
              <h3 className="font-mono text-sm text-slate-500 tracking-widest uppercase">Past Events</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {past.map((event) => {
                const colors = colorMap[event.color]
                return (
                  <div key={event.id} className="glass-card rounded-sm overflow-hidden group">
                    <div className="relative bg-black/80 flex items-center justify-center p-2 border-b border-white/5">
                      <img
                        src={event.image}
                        alt={event.title}
                        onClick={() => setActiveModalImage(event.image)}
                        className="w-full h-auto max-h-[500px] object-contain rounded-sm cursor-pointer"
                      />
                      <div className="absolute top-4 right-4 z-10 flex gap-2">
                        <span className={`text-xs font-mono px-2.5 py-1 border rounded-sm backdrop-blur-md ${colors.badge}`}>{event.type}</span>
                        <button
                          onClick={() => setActiveModalImage(event.image)}
                          title="View full poster"
                          className="bg-black/70 hover:bg-black text-slate-300 p-1.5 rounded-sm border border-white/20 transition-colors"
                        >
                          <Maximize2 size={13} />
                        </button>
                      </div>
                      <div className="absolute top-4 left-4 z-10">
                        <span className="text-xs font-mono px-2.5 py-1 bg-slate-700 text-slate-300 rounded-sm">COMPLETED</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className="font-mono font-bold text-slate-300 text-base mb-2">{event.title}</h4>
                      <p className="text-slate-500 text-xs font-mono mb-3 leading-relaxed">{event.description}</p>
                      <div className="flex flex-wrap gap-3 text-xs font-mono text-slate-500">
                        <span className="flex items-center gap-1.5"><Calendar size={13} /> {event.date}</span>
                        <span className="flex items-center gap-1.5"><MapPin size={13} /> {event.venue}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {d.events.length === 0 && (
          <p className="text-center text-slate-600 font-mono text-sm">No events added yet.</p>
        )}
      </div>

      {/* Full-Screen Poster Modal */}
      {activeModalImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveModalImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center">
            <button
              onClick={() => setActiveModalImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-green-400 p-2 font-mono flex items-center gap-1 text-sm bg-black/50 rounded-sm border border-green-500/30"
            >
              <X size={18} /> CLOSE
            </button>
            <img
              src={activeModalImage}
              alt="Full Poster"
              className="max-w-full max-h-[85vh] object-contain rounded-sm border border-green-500/30 shadow-2xl"
              onClick={e => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </section>
  )
}
