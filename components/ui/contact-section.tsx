"use client"

import { useState } from "react"
import { Mail, MessageSquare, GitBranch, Image, Link2, Share2, Send, CheckCircle } from "lucide-react"
import type { ContactContent } from "@/lib/content-types"

const socialIconMap: Record<string, React.ElementType> = {
  GitHub: GitBranch,
  Instagram: Image,
  LinkedIn: Link2,
  "Twitter / X": Share2,
  Twitter: Share2,
}

const DEFAULT: ContactContent = {
  email: "geekspire@college.edu",
  location: "Electronics Lab, Block B2",
  locationDetail: "Main Campus",
  meetingSchedule: "Every Saturday · 10:00 AM — 1:00 PM",
  socials: [
    { label: "GitHub", handle: "@geekspire", href: "#" },
    { label: "Instagram", handle: "@geekspire.robotics", href: "#" },
    { label: "LinkedIn", handle: "GEEKSPIRE Club", href: "#" },
    { label: "Twitter / X", handle: "@geekspire_bot", href: "#" },
  ],
  formTitle: "JOIN APPLICATION",
  successMessage: "We'll get back to you within 48 hours. Welcome to the grid!",
}

export default function ContactSection({ data }: { data?: ContactContent }) {
  const d = data ?? DEFAULT
  const [form, setForm] = useState({ name: "", email: "", role: "", message: "" })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <section id="contact" className="relative bg-black py-24 px-4">
      <div className="absolute inset-0 pixel-bg opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-t from-green-950/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="matrix-tag mb-4 inline-block">// CONTACT_MODULE</span>
          <h2 className="text-4xl md:text-5xl font-mono font-bold text-white mt-4">
            Join the <span className="gradient-text">Mission</span>
          </h2>
          <div className="matrix-divider mt-6 max-w-xs mx-auto" />
          <p className="text-slate-500 text-sm font-mono mt-6 max-w-md mx-auto">
            Ready to build the future? Reach out and become part of the Robotics Lab Club family.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="glass-card rounded-sm p-6">
              <h3 className="font-mono font-bold text-white text-sm mb-4 flex items-center gap-2">
                <Mail size={14} className="text-green-400" /> REACH OUT
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-mono text-slate-600 mb-1">EMAIL</p>
                  <a href={`mailto:${d.email}`} className="text-sm font-mono text-green-400 hover:text-green-300 transition-colors">{d.email}</a>
                </div>
                <div>
                  <p className="text-xs font-mono text-slate-600 mb-1">LOCATION</p>
                  <p className="text-sm font-mono text-slate-300">{d.location}<br />{d.locationDetail}</p>
                </div>
                <div>
                  <p className="text-xs font-mono text-slate-600 mb-1">MEETINGS</p>
                  <p className="text-sm font-mono text-slate-300">{d.meetingSchedule}</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-sm p-6">
              <h3 className="font-mono font-bold text-white text-sm mb-4 flex items-center gap-2">
                <MessageSquare size={14} className="text-green-400" /> SOCIAL LINKS
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {d.socials.map((social, i) => {
                  const Icon = socialIconMap[social.label] ?? Share2
                  return (
                    <a key={i} href={social.href} className="glass p-3 rounded-sm hover:border-green-500/40 hover:text-green-400 transition-all group">
                      <Icon size={14} className="text-slate-500 group-hover:text-green-400 transition-colors mb-1.5" />
                      <p className="text-xs font-mono font-bold text-white">{social.label}</p>
                      <p className="text-xs font-mono text-slate-600">{social.handle}</p>
                    </a>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="glass-card rounded-sm p-8 flex flex-col justify-center items-center text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 mb-2 glow-box">
              <Send size={28} />
            </div>
            <h3 className="font-mono font-bold text-white text-xl tracking-wider">
              {d.formTitle || "JOIN APPLICATION"}
            </h3>
            <p className="text-slate-400 text-xs font-mono max-w-sm leading-relaxed">
              Ready to engineer the future with us? Click below to open the official Robotics Lab Club application portal and submit your application.
            </p>
            <a
              href="https://robotics-lab-club-peela-2.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full btn-matrix py-4 text-sm font-mono tracking-widest rounded-sm inline-flex items-center justify-center gap-2 group"
            >
              <span>JOIN APPLICATION ↗</span>
            </a>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-green-500/10 text-center">
          <p className="font-mono font-bold text-white text-sm tracking-widest mb-2">ROBOTICS LAB <span className="text-green-400">CLUB</span></p>
          <p className="text-slate-700 text-xs font-mono">© {new Date().getFullYear()} Robotics Lab Club · All systems operational.</p>
          <div className="mt-4 flex justify-center gap-1">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-green-500/30" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
