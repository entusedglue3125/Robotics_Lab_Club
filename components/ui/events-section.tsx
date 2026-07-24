"use client"

import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react"
import type { EventsContent } from "@/lib/content-types"

const DEFAULT: EventsContent = { events: [] }

const colorMap = {
  green: { badge: "bg-green-500/10 text-green-400 border-green-500/30", glow: "group-hover:border-green-500/40" },
  cyan: { badge: "bg-green-500/10 text-green-400 border-green-500/30", glow: "group-hover:border-green-500/40" },
}

export default function EventsSection({ data }: { data?: EventsContent }) {
  const d = data ?? DEFAULT
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
            <div className="grid md:grid-cols-2 gap-5">
              {upcoming.map((event) => {
                const colors = colorMap[event.color]
                return (
                  <div key={event.id} className={`glass-card rounded-sm overflow-hidden group cursor-pointer ${colors.glow}`}>
                    <div className="relative h-40 overflow-hidden">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60" />
                      <div className="absolute top-3 right-3">
                        <span className={`text-xs font-mono px-2 py-1 border rounded-sm ${colors.badge}`}>{event.type}</span>
                      </div>
                      <div className="absolute top-3 left-3">
                        <span className="text-xs font-mono px-2 py-1 bg-green-500 text-black font-bold rounded-sm">UPCOMING</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className="font-mono font-bold text-white text-sm mb-2">{event.title}</h4>
                      <p className="text-slate-500 text-xs font-mono mb-4 leading-relaxed">{event.description}</p>
                      <div className="flex flex-wrap gap-3 text-xs font-mono text-slate-600">
                        <span className="flex items-center gap-1"><Calendar size={11} className="text-green-500" /> {event.date}</span>
                        <span className="flex items-center gap-1"><Clock size={11} className="text-green-500" /> {event.time}</span>
                        <span className="flex items-center gap-1"><MapPin size={11} className="text-green-500" /> {event.venue}</span>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button className="flex items-center gap-1 text-xs font-mono text-green-400 hover:text-green-300 transition-colors">
                          REGISTER <ArrowRight size={12} />
                        </button>
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
            <div className="grid md:grid-cols-2 gap-5">
              {past.map((event) => {
                const colors = colorMap[event.color]
                return (
                  <div key={event.id} className="glass-card rounded-sm overflow-hidden group cursor-pointer">
                    <div className="relative h-32 overflow-hidden">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                      <div className="absolute top-3 right-3">
                        <span className={`text-xs font-mono px-2 py-1 border rounded-sm ${colors.badge}`}>{event.type}</span>
                      </div>
                      <div className="absolute top-3 left-3">
                        <span className="text-xs font-mono px-2 py-1 bg-slate-700 text-slate-400 rounded-sm">COMPLETED</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className="font-mono font-bold text-slate-300 text-sm mb-2">{event.title}</h4>
                      <p className="text-slate-600 text-xs font-mono mb-3 leading-relaxed">{event.description}</p>
                      <div className="flex flex-wrap gap-3 text-xs font-mono text-slate-700">
                        <span className="flex items-center gap-1"><Calendar size={11} /> {event.date}</span>
                        <span className="flex items-center gap-1"><MapPin size={11} /> {event.venue}</span>
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
    </section>
  )
}
