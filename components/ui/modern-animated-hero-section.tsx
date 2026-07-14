"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import type { HeroContent } from "@/lib/content-types"

interface Character {
  char: string
  x: number
  y: number
  speed: number
}

class TextScramble {
  el: HTMLElement
  chars: string
  queue: Array<{ from: string; to: string; start: number; end: number; char?: string }>
  frame: number
  frameRequest: number
  resolve: (value: void | PromiseLike<void>) => void

  constructor(el: HTMLElement) {
    this.el = el
    this.chars = '!<>-_\\/[]{}—=+*^?#'
    this.queue = []
    this.frame = 0
    this.frameRequest = 0
    this.resolve = () => {}
    this.update = this.update.bind(this)
  }

  setText(newText: string) {
    const oldText = this.el.innerText
    const length = Math.max(oldText.length, newText.length)
    const promise = new Promise<void>((resolve) => (this.resolve = resolve))
    this.queue = []
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || ""
      const to = newText[i] || ""
      const start = Math.floor(Math.random() * 40)
      const end = start + Math.floor(Math.random() * 40)
      this.queue.push({ from, to, start, end })
    }
    cancelAnimationFrame(this.frameRequest)
    this.frame = 0
    this.update()
    return promise
  }

  update() {
    let output = ""
    let complete = 0
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i]
      if (this.frame >= end) {
        complete++
        output += to
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)]
          this.queue[i].char = char
        }
        output += `<span class="dud">${char}</span>`
      } else {
        output += from
      }
    }
    this.el.innerHTML = output
    if (complete === this.queue.length) {
      this.resolve()
    } else {
      this.frameRequest = requestAnimationFrame(this.update)
      this.frame++
    }
  }
}

const ScrambledTitle: React.FC<{ phrases: string[] }> = ({ phrases }) => {
  const elementRef = useRef<HTMLHeadingElement>(null)
  const scramblerRef = useRef<TextScramble | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (elementRef.current && !scramblerRef.current) {
      scramblerRef.current = new TextScramble(elementRef.current)
      setMounted(true)
    }
  }, [])

  useEffect(() => {
    if (mounted && scramblerRef.current && phrases.length > 0) {
      let counter = 0
      const next = () => {
        if (scramblerRef.current) {
          scramblerRef.current.setText(phrases[counter]).then(() => {
            setTimeout(next, 2500)
          })
          counter = (counter + 1) % phrases.length
        }
      }
      next()
    }
  }, [mounted, phrases])

  return (
    <div className="inline-flex items-center justify-center gap-1 font-mono">
      <span className="text-green-500 mr-2 text-3xl sm:text-4xl md:text-5xl font-bold">&gt;</span>
      <h1
        ref={elementRef}
        className="text-white text-3xl sm:text-4xl md:text-5xl font-bold tracking-wider text-center uppercase"
      >
        {phrases[0] || "ROBOTICS LAB CLUB"}
      </h1>
      <span className="w-2.5 h-7 sm:h-9 md:h-11 bg-green-500 animate-pulse ml-1 inline-block shrink-0" />
    </div>
  )
}

interface Props { data?: HeroContent }

const DEFAULT: HeroContent = {
  phrases: ["ROBOTICS LAB CLUB", "BUILD. INNOVATE.", "CONQUER.", "AUTONOMOUS SYSTEMS", "THE FUTURE IS NOW", "ENGINEERING EXCELLENCE"],
  tagline: "Where machines think and engineers dream.",
  ctaPrimary: "EXPLORE →",
  ctaSecondary: "JOIN US",
  badge: "EST. 2022 · ROBOTICS DIVISION",
}

const RainingLetters: React.FC<Props> = ({ data }) => {
  const d = data ?? DEFAULT
  const [characters, setCharacters] = useState<Character[]>([])
  const [activeIndices, setActiveIndices] = useState<Set<number>>(new Set())

  const createCharacters = useCallback(() => {
    const allChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"
    return Array.from({ length: 150 }, () => ({
      char: allChars[Math.floor(Math.random() * allChars.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      speed: 0.05 + Math.random() * 0.18,
    }))
  }, [])

  useEffect(() => { setCharacters(createCharacters()) }, [createCharacters])

  useEffect(() => {
    const interval = setInterval(() => {
      const s = new Set<number>()
      for (let i = 0; i < 4; i++) s.add(Math.floor(Math.random() * characters.length))
      setActiveIndices(s)
    }, 80)
    return () => clearInterval(interval)
  }, [characters.length])

  useEffect(() => {
    let id: number
    const allChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"
    const tick = () => {
      setCharacters(prev =>
        prev.map(c => ({
          ...c,
          y: c.y + c.speed,
          ...(c.y >= 100 && {
            y: -5,
            x: Math.random() * 100,
            char: allChars[Math.floor(Math.random() * allChars.length)],
          }),
        }))
      )
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden scanlines" id="hero">
      <div className="absolute inset-0 pixel-bg opacity-15 z-0" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-center px-4 w-full max-w-4xl">
        <div className="mb-4">
          <span className="matrix-tag text-[10px] tracking-[0.2em]">{d.badge}</span>
        </div>
        <ScrambledTitle phrases={d.phrases} />
        <p className="mt-6 text-slate-400 text-xs sm:text-sm max-w-md mx-auto font-mono tracking-wider">
          {d.tagline}
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <a href="#about" className="btn-matrix px-5 py-2.5 text-xs font-mono tracking-wider rounded-sm">
            <span>{d.ctaPrimary}</span>
          </a>
          <a href="#contact" className="px-5 py-2.5 text-xs font-mono tracking-wider text-white border border-white/10 hover:border-white/40 transition-colors rounded-sm bg-black/30 backdrop-blur-sm">
            {d.ctaSecondary}
          </a>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <span className="text-[10px] font-mono text-slate-600 tracking-[0.3em]">SCROLL</span>
        <div className="w-px h-10 bg-gradient-to-b from-transparent via-green-500/50 to-transparent animate-pulse" />
      </div>
      {characters.map((char, index) => (
        <span
          key={index}
          className={`absolute select-none pointer-events-none transition-colors duration-150 ${
            activeIndices.has(index) ? "text-green-400 z-10 font-bold" : "text-slate-800 font-light"
          }`}
          style={{
            left: `${char.x}%`,
            top: `${char.y}%`,
            transform: `translate(-50%, -50%) ${activeIndices.has(index) ? "scale(1.1)" : "scale(1)"}`,
            textShadow: activeIndices.has(index) ? "0 0 5px rgba(74,222,128,0.5)" : "none",
            opacity: activeIndices.has(index) ? 0.95 : 0.12,
            fontSize: "0.8rem",
            fontFamily: "monospace",
            willChange: "transform, top",
          }}
        >
          {char.char}
        </span>
      ))}
    </div>
  )
}

export default RainingLetters
