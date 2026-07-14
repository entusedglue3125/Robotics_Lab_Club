"use client"

import { BackgroundPixelStars } from "./background-pixel-stars"
import { Zap, Code2, Cpu, Globe } from "lucide-react"
import type { AboutContent } from "@/lib/content-types"

const iconMap: Record<string, React.ElementType> = { Cpu, Code2, Zap, Globe }

const DEFAULT: AboutContent = {
  heading: "About Robotics Lab Club",
  paragraphs: [
    "Robotics Lab Club is an elite student-led robotics and engineering club.",
    "Our team competes at national level competitions and conducts hands-on workshops.",
    "From line-following robots to autonomous drones — if it can be engineered, we'll build it.",
  ],
  techTags: ["Raspberry Pi", "Arduino", "ROS2", "OpenCV", "Python", "C++"],
  pillars: [
    { icon: "Cpu", title: "Autonomous Systems", description: "We design and program robots capable of independent decision-making." },
    { icon: "Code2", title: "Software Engineering", description: "From embedded C to Python ML pipelines — our members master the full stack." },
    { icon: "Zap", title: "Electronics & PCB Design", description: "Custom motor drivers and sensor boards built from scratch." },
    { icon: "Globe", title: "Competitive Robotics", description: "We compete in national and international robotics competitions." },
  ],
  imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
  imageCaption: "LAB IN SESSION",
}

export default function AboutSection({ data }: { data?: AboutContent }) {
  const d = data ?? DEFAULT
  return (
    <section id="about" className="relative min-h-screen bg-black overflow-hidden py-24 px-4">
      <div className="absolute inset-0 opacity-60">
        <BackgroundPixelStars />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none z-[1]" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="matrix-tag mb-4 inline-block">// WHO_WE_ARE</span>
          <h2 className="text-4xl md:text-5xl font-mono font-bold text-white mt-4">
            <span className="gradient-text">{d.heading}</span>
          </h2>
          <div className="matrix-divider mt-6 max-w-xs mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            {d.paragraphs.map((p, i) => (
              <p key={i} className="text-slate-400 text-sm leading-relaxed font-mono">
                {i === 0 ? (
                  <><span className="text-green-400 font-bold">ROBOTICS LAB CLUB</span> {p.replace(/^Robotics Lab Club\s*/i, "")}</>
                ) : p}
              </p>
            ))}
            <div className="flex flex-wrap gap-2 pt-2">
              {d.techTags.map(tag => (
                <span key={tag} className="matrix-tag text-xs">{tag}</span>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="glass-card rounded-sm overflow-hidden aspect-video">
              <img
                src={d.imageUrl}
                alt="Robotics team"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="matrix-tag">{d.imageCaption}</span>
              </div>
            </div>
            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-green-500" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-green-500" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {d.pillars.map((pillar, i) => {
            const Icon = iconMap[pillar.icon] ?? Cpu
            return (
              <div key={i} className="glass-card rounded-sm p-6 group cursor-default">
                <Icon className="text-green-400 mb-4 group-hover:scale-110 transition-transform" size={28} />
                <h3 className="font-mono font-bold text-white text-sm mb-2 tracking-wide">{pillar.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed font-mono">{pillar.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
