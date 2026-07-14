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
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-green-500/30 to-transparent" />
            <div className="space-y-8">
              {d.achievements.map((item, i) => {
                const isLeft = i % 2 === 0
                const Icon = iconMap[item.icon] ?? Trophy
                return (
                  <div key={item.id} className={`relative flex ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} gap-0`}>
                    <div className={`w-full md:w-5/12 pl-14 md:pl-0 ${isLeft ? "md:pr-8 md:text-right" : "md:pl-8"}`}>
                      <div className={`glass-card rounded-sm p-5 group ${item.highlight ? "glow-box" : ""}`}>
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
                    <div className="absolute left-6 md:left-1/2 top-6 -translate-x-1/2 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full border-2 bg-green-500 border-green-400 shadow-[0_0_4px_rgba(34,197,94,0.3)]" />
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
