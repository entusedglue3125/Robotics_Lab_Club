"use client"

import type { GalleryContent } from "@/lib/content-types"

const DEFAULT: GalleryContent = { images: [], instagramHandle: "@geekspire.robotics" }

export default function GallerySection({ data }: { data?: GalleryContent }) {
  const d = data ?? DEFAULT

  return (
    <section id="gallery" className="relative bg-black py-24 px-4">
      <div className="absolute inset-0 pixel-bg opacity-20" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="matrix-tag mb-4 inline-block">// GALLERY_FEED</span>
          <h2 className="text-4xl md:text-5xl font-mono font-bold text-white mt-4">
            Lab in <span className="gradient-text">Action</span>
          </h2>
          <div className="matrix-divider mt-6 max-w-xs mx-auto" />
          <p className="text-slate-500 text-sm font-mono mt-6">A glimpse into our sessions, competitions, and builds.</p>
        </div>

        {d.images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 auto-rows-[200px]">
            {d.images.map((img) => (
              <div key={img.id} className={`${img.span} relative overflow-hidden rounded-sm group cursor-pointer`}>
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute inset-0 border border-transparent group-hover:border-green-500/50 transition-all duration-300 rounded-sm" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-xs font-mono text-green-400 tracking-wider">{img.caption}</span>
                </div>
                <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-green-500/0 group-hover:border-green-500/80 transition-all duration-300" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-green-500/0 group-hover:border-green-500/80 transition-all duration-300" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-600 font-mono text-sm">No gallery images added yet.</p>
        )}

        <p className="text-center text-slate-700 text-xs font-mono mt-6 tracking-wider">
          FOLLOW US ON INSTAGRAM FOR MORE → {d.instagramHandle}
        </p>
      </div>
    </section>
  )
}
