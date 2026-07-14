"use client"

import { useState } from "react"
import { Menu, X, Cpu } from "lucide-react"

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Stats", href: "#stats" },
  { label: "Events", href: "#events" },
  { label: "Teams", href: "#teams" },
  { label: "Gallery", href: "#gallery" },
  { label: "Achievements", href: "#achievements" },
  { label: "Contact", href: "#contact" },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-green-500/20 py-3">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2 group">
          <div className="w-8 h-8 border border-green-500 flex items-center justify-center glow-box group-hover:bg-green-500/10 transition-colors">
            <Cpu size={16} className="text-green-400" />
          </div>
          <span className="font-mono font-bold text-white tracking-widest text-sm">
            ROBOTICS LAB <span className="text-green-400">CLUB</span>
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="nav-link text-xs font-mono tracking-wider uppercase"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#contact"
            className="btn-matrix px-4 py-2 text-xs font-mono tracking-widest rounded-sm"
          >
            <span>JOIN CLUB</span>
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          id="mobile-menu-toggle"
          className="md:hidden text-green-400 hover:text-green-300 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="glass border-t border-green-500/20 px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-mono text-slate-300 hover:text-green-400 tracking-widest uppercase py-1 border-b border-white/5"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="btn-matrix px-4 py-2 text-xs font-mono tracking-widest text-center rounded-sm mt-2"
          >
            <span>JOIN CLUB</span>
          </a>
        </div>
      </div>
    </header>
  )
}
