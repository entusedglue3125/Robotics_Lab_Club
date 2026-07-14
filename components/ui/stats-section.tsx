"use client"

import { useEffect, useRef, useState } from "react"
import type { StatsContent } from "@/lib/content-types"

const DEFAULT: StatsContent = {
  stats: [
    { value: 120, label: "Active Members", suffix: "+", prefix: "" },
    { value: 47, label: "Projects Built", suffix: "+", prefix: "" },
    { value: 18, label: "Awards Won", suffix: "", prefix: "" },
    { value: 4, label: "Years Running", suffix: "", prefix: "" },
  ],
  subStats: [
    { label: "Workshops Hosted", val: "24+" },
    { label: "Competitions Entered", val: "12" },
    { label: "Technical Domains", val: "6" },
  ],
}

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime: number | null = null
    const step = (ts: number) => {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      setCount(Math.floor((1 - Math.pow(1 - progress, 3)) * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return count
}

function StatCard({ value, label, suffix, prefix, started }: {
  value: number; label: string; suffix: string; prefix: string; started: boolean
}) {
  const count = useCountUp(value, 2000, started)
  return (
    <div className="glass-card rounded-sm p-8 text-center group">
      <div className="font-mono text-5xl md:text-6xl font-bold text-green-400 tabular-nums">
        {prefix}{count}{suffix}
      </div>
      <div className="mt-3 text-slate-400 text-xs font-mono tracking-widest uppercase">{label}</div>
      <div className="mt-4 h-px bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />
    </div>
  )
}

export default function StatsSection({ data }: { data?: StatsContent }) {
  const d = data ?? DEFAULT
  const ref = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="stats" className="relative bg-black py-24 px-4 pixel-bg" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-green-950/5 to-black pointer-events-none" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="matrix-tag mb-4 inline-block">// BY_THE_NUMBERS</span>
          <h2 className="text-4xl md:text-5xl font-mono font-bold text-white mt-4">
            Our <span className="gradient-text">Impact</span>
          </h2>
          <div className="matrix-divider mt-6 max-w-xs mx-auto" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {d.stats.map((stat, i) => (
            <StatCard key={i} {...stat} started={started} />
          ))}
        </div>
        <div className="mt-10 grid grid-cols-3 gap-4 max-w-2xl mx-auto text-center">
          {d.subStats.map((item, i) => (
            <div key={i} className="glass p-4 rounded-sm">
              <div className="text-2xl font-mono font-bold text-green-400">{item.val}</div>
              <div className="text-xs font-mono text-slate-500 tracking-wider mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
