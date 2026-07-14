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

          <div className="glass-card rounded-sm p-6">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
                <CheckCircle size={48} className="text-green-400 mb-4 glow-green-sm" />
                <h3 className="font-mono font-bold text-white text-lg mb-2">APPLICATION RECEIVED</h3>
                <p className="text-slate-500 text-xs font-mono">{d.successMessage}</p>
                <div className="mt-6 w-full h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
                <p className="text-green-400/50 text-xs font-mono mt-4 tracking-widest animate-pulse">TRANSMISSION COMPLETE</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-mono font-bold text-white text-sm mb-5 flex items-center gap-2">
                  <Send size={14} className="text-green-400" /> {d.formTitle}
                </h3>
                <div>
                  <label className="text-xs font-mono text-slate-600 tracking-wider mb-1.5 block">FULL NAME *</label>
                  <input id="contact-name" type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-black/50 border border-green-500/20 focus:border-green-500/60 rounded-sm px-3 py-2.5 text-sm font-mono text-white outline-none transition-colors placeholder:text-slate-700"
                    placeholder="Your Name" />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-600 tracking-wider mb-1.5 block">EMAIL ADDRESS *</label>
                  <input id="contact-email" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-black/50 border border-green-500/20 focus:border-green-500/60 rounded-sm px-3 py-2.5 text-sm font-mono text-white outline-none transition-colors placeholder:text-slate-700"
                    placeholder="you@college.edu" />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-600 tracking-wider mb-1.5 block">INTERESTED ROLE</label>
                  <select id="contact-role" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                    className="w-full bg-black/50 border border-green-500/20 focus:border-green-500/60 rounded-sm px-3 py-2.5 text-sm font-mono text-white outline-none transition-colors">
                    <option value="" className="bg-black">Select a domain...</option>
                    <option value="hardware" className="bg-black">Hardware / Electronics</option>
                    <option value="software" className="bg-black">Software / ROS</option>
                    <option value="ai" className="bg-black">AI / Machine Learning</option>
                    <option value="mechanical" className="bg-black">Mechanical Design</option>
                    <option value="management" className="bg-black">Club Management</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-600 tracking-wider mb-1.5 block">WHY DO YOU WANT TO JOIN?</label>
                  <textarea id="contact-message" rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-black/50 border border-green-500/20 focus:border-green-500/60 rounded-sm px-3 py-2.5 text-sm font-mono text-white outline-none transition-colors resize-none placeholder:text-slate-700"
                    placeholder="Tell us about your experience and what you want to build..." />
                </div>
                <button id="contact-submit" type="submit" disabled={loading}
                  className="w-full btn-matrix py-3 text-sm font-mono tracking-widest rounded-sm disabled:opacity-50">
                  <span className="flex items-center justify-center gap-2">
                    {loading ? (
                      <><div className="w-4 h-4 border border-current border-t-transparent rounded-full animate-spin" />TRANSMITTING...</>
                    ) : (
                      <><Send size={14} />SUBMIT APPLICATION</>
                    )}
                  </span>
                </button>
              </form>
            )}
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
