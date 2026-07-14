import type { SiteContent } from "@/lib/content-types"

export interface TabProps {
  content: SiteContent
  setContent: React.Dispatch<React.SetStateAction<SiteContent | null>>
}

export const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-mono text-slate-500 tracking-wider uppercase block">{label}</label>
    {children}
  </div>
)

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={`w-full bg-black/50 border border-green-500/20 focus:border-green-500/50 rounded-sm px-3 py-2 text-sm font-mono text-white outline-none transition-colors placeholder:text-slate-700 ${props.className ?? ""}`} />
)

export const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...props} className={`w-full bg-black/50 border border-green-500/20 focus:border-green-500/50 rounded-sm px-3 py-2 text-sm font-mono text-white outline-none transition-colors resize-none placeholder:text-slate-700 ${props.className ?? ""}`} />
)

export const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement> & { options: string[] }) => (
  <select {...props} className="w-full bg-black/50 border border-green-500/20 focus:border-green-500/50 rounded-sm px-3 py-2 text-sm font-mono text-white outline-none transition-colors">
    {props.options.map(o => <option key={o} value={o} className="bg-black">{o}</option>)}
  </select>
)

export const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`glass-card rounded-sm p-5 ${className}`}>{children}</div>
)

export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-mono font-bold text-white text-base mb-6 flex items-center gap-2">
    <span className="text-green-400">//</span> {children}
  </h2>
)

export const AddBtn = ({ onClick, label = "ADD" }: { onClick: () => void; label?: string }) => (
  <button onClick={onClick} className="text-xs font-mono text-green-400 border border-green-500/30 px-3 py-1.5 rounded-sm hover:bg-green-500/10 transition-colors">
    + {label}
  </button>
)

export const RemoveBtn = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="text-xs font-mono text-red-400/60 hover:text-red-400 transition-colors px-2 py-1 border border-red-400/20 rounded-sm">
    ✕
  </button>
)
