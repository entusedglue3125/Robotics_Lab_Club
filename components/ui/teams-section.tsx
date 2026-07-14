"use client"

import { GitBranch, Link2 } from "lucide-react"
import type { TeamsContent } from "@/lib/content-types"

const DEFAULT: TeamsContent = { teams: [] }

export default function TeamsSection({ data }: { data?: TeamsContent }) {
  const d = data ?? DEFAULT

  return (
    <section id="teams" className="relative bg-black py-24 px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-950/5 to-transparent pointer-events-none" />
      <div className="absolute inset-0 pixel-bg opacity-20" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="matrix-tag mb-4 inline-block">// TEAM_ROSTER</span>
          <h2 className="text-4xl md:text-5xl font-mono font-bold text-white mt-4">
            Meet the <span className="gradient-text">Engineers</span>
          </h2>
          <div className="matrix-divider mt-6 max-w-xs mx-auto" />
          <p className="text-slate-500 text-sm font-mono mt-6 max-w-lg mx-auto">
            A collective of passionate builders, thinkers, and problem-solvers.
          </p>
        </div>

        {d.teams.map((team) => (
          <div key={team.id} className="mb-14">
            <div className="flex items-center gap-3 mb-7">
              <span className="matrix-tag">{team.tag}</span>
              <h3 className="font-mono text-sm text-slate-400 tracking-wider">{team.division}</h3>
              <div className="flex-1 h-px bg-green-500/10" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {team.members.map((member) => (
                <div key={member.id} className="glass-card rounded-sm p-5 flex items-start gap-4 group">
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-sm overflow-hidden border border-green-500/30 group-hover:border-green-500/70 transition-colors">
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black animate-pulse" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-mono font-bold text-white text-sm truncate">{member.name}</h4>
                    <p className="text-green-400 text-xs font-mono mt-0.5">{member.role}</p>
                    <p className="text-slate-600 text-xs font-mono mt-1 leading-relaxed">{member.focus}</p>
                    <div className="flex gap-2 mt-3">
                      <a href={member.github} className="text-slate-600 hover:text-green-400 transition-colors" aria-label={`${member.name} GitHub`}>
                        <GitBranch size={13} />
                      </a>
                      <a href={member.linkedin} className="text-slate-600 hover:text-green-400 transition-colors" aria-label={`${member.name} LinkedIn`}>
                        <Link2 size={13} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {d.teams.length === 0 && (
          <p className="text-center text-slate-600 font-mono text-sm">No team members added yet.</p>
        )}

        <div className="text-center mt-8">
          <p className="text-slate-500 text-xs font-mono mb-4">Want to see your name here?</p>
          <a href="#contact" className="btn-matrix px-8 py-3 text-xs font-mono tracking-widest rounded-sm inline-block">
            <span>APPLY TO JOIN</span>
          </a>
        </div>
      </div>
    </section>
  )
}
