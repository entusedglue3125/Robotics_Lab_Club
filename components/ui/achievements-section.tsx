"use client"

import { Trophy, Star, Award, Medal } from "lucide-react"
import type { AchievementsContent } from "@/lib/content-types"

const iconMap: Record<string, React.ElementType> = { Trophy, Star, Award, Medal }
const DEFAULT: AchievementsContent = { achievements: [] }

export default function AchievementsSection({ data }: { data?: AchievementsContent }) {
  const d = data ?? DEFAULT

  return (
    <section id="achievements" className="relative bg-black py-24 px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-green-950/8 to-black pointer-events-none" />
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="matrix-tag mb-4 inline-block">// ACHIEVEMENT_LOG</span>
          <h2 className="text-4xl md:text-5xl font-mono font-bold text-white mt-4">
            Our <span className="gradient-text">Victories</span>
          </h2>
          <div className="matrix-divider mt-6 max-w-xs mx-auto" />
        </div>

        {d.achievements.length > 0 ? (
          <div className="relative">
            {/* Glowing Vertical Timeline Line & Animated Pulse Beam */}
            <div className="timeline-line z-0">
              <div className="timeline-pulse-beam" />
            </div>

            <div className="space-y-8 relative z-10">
              {d.achievements.map((item, i) => {
                const isLeft = i % 2 === 0
                const Icon = iconMap[item.icon] ?? Trophy
                return (
                  <div key={item.id} className={`group relative flex ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} gap-0`}>
                    <div className={`w-full md:w-5/12 pl-14 md:pl-0 ${isLeft ? "md:pr-8 md:text-right" : "md:pl-8"}`}>
                      <div className={`glass-card rounded-sm p-5 ${item.highlight ? "glow-box" : ""}`}>
                        {item.highlight && (
                          <div className="mb-2"><span className="text-xs font-mono text-green-400 tracking-widest">⭐ FEATURED WIN</span></div>
                        )}
                        <div className={`flex items-center gap-2 mb-3 ${isLeft ? "md:justify-end" : "justify-start"}`}>
                          <span className="matrix-tag">{item.year}</span>
                          <Icon size={14} className="text-green-400" />
                        </div>
                        <h3 className="font-mono font-bold text-white text-sm mb-1">{item.title}</h3>
                        <p className="text-green-400 text-xs font-mono mb-2">{item.subtitle}</p>
                        <p className="text-slate-600 text-xs font-mono leading-relaxed">{item.description}</p>
                      </div>
                    </div>

                    {/* Timeline Node Dot & Horizontal Connector Line */}
                    <div className="absolute left-6 md:left-1/2 top-6 -translate-x-1/2 flex items-center justify-center z-20">
                      {/* Pulsing Outer Aura */}
                      <div className="absolute w-7 h-7 rounded-full bg-green-500/20 animate-ping pointer-events-none" />

                      {/* Main Node Dot */}
                      <div className="relative w-4 h-4 rounded-full border-2 border-green-300 bg-green-500 timeline-dot-pulse group-hover:scale-125 group-hover:bg-green-400 group-hover:border-white transition-all duration-300 shadow-[0_0_12px_rgba(34,197,94,0.9)]" />

                      {/* Mobile Horizontal Connector */}
                      <div className="block md:hidden absolute left-full top-1/2 -translate-y-1/2 w-8 h-[2px] bg-gradient-to-r from-green-400 via-green-500 to-green-500/40 shadow-[0_0_8px_rgba(34,197,94,0.8)] group-hover:shadow-[0_0_12px_rgba(0,255,100,1)] group-hover:h-[3px] timeline-connector-flow-right transition-all duration-300" />

                      {/* Desktop Horizontal Connector */}
                      <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 h-[2px] w-8 shadow-[0_0_8px_rgba(34,197,94,0.8)] group-hover:shadow-[0_0_14px_rgba(0,255,100,1)] group-hover:h-[3px] transition-all duration-300 ${
                        isLeft
                          ? "right-full bg-gradient-to-l from-green-400 via-green-500 to-green-500/30 timeline-connector-flow-left"
                          : "left-full bg-gradient-to-r from-green-400 via-green-500 to-green-500/30 timeline-connector-flow-right"
                      }`} />
                    </div>

                    <div className="hidden md:block w-5/12" />
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <p className="text-center text-slate-600 font-mono text-sm">No achievements added yet.</p>
        )}
      </div>
    </section>
  )
}
