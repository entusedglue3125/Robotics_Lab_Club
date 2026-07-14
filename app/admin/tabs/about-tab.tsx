"use client"
import React from "react"
import { Field, Input, Textarea, Card, SectionTitle, AddBtn, RemoveBtn, type TabProps } from "./shared"
import ImageUpload from "./image-upload"

export default function AboutTab({ content, setContent }: TabProps) {
  const a = content.about
  const upd = (patch: Partial<typeof a>) => setContent(c => c ? { ...c, about: { ...c.about, ...patch } } : c)

  return (
    <div className="space-y-6 max-w-2xl">
      <SectionTitle>About Section</SectionTitle>

      <Card>
        <Field label="Section Heading">
          <Input value={a.heading} onChange={e => upd({ heading: e.target.value })} />
        </Field>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">Paragraphs</p>
          <AddBtn onClick={() => upd({ paragraphs: [...a.paragraphs, "New paragraph..."] })} />
        </div>
        <div className="space-y-2">
          {a.paragraphs.map((p, i) => (
            <div key={i} className="flex gap-2">
              <Textarea rows={3} value={p} onChange={e => {
                const arr = [...a.paragraphs]; arr[i] = e.target.value; upd({ paragraphs: arr })
              }} />
              <RemoveBtn onClick={() => upd({ paragraphs: a.paragraphs.filter((_, j) => j !== i) })} />
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">Tech Tags</p>
          <AddBtn label="ADD TAG" onClick={() => upd({ techTags: [...a.techTags, "New Tag"] })} />
        </div>
        <div className="flex flex-wrap gap-2">
          {a.techTags.map((tag, i) => (
            <div key={i} className="flex items-center gap-1 glass border border-green-500/20 rounded-sm px-2 py-1">
              <input value={tag} onChange={e => {
                const arr = [...a.techTags]; arr[i] = e.target.value; upd({ techTags: arr })
              }} className="bg-transparent text-xs font-mono text-green-400 outline-none w-24" />
              <button onClick={() => upd({ techTags: a.techTags.filter((_, j) => j !== i) })} className="text-red-400/50 hover:text-red-400 text-xs">✕</button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <ImageUpload label="Section Image" value={a.imageUrl} onChange={url => upd({ imageUrl: url })} />
        <Field label="Image Caption">
          <Input value={a.imageCaption} onChange={e => upd({ imageCaption: e.target.value })} />
        </Field>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">Pillars (4 feature cards)</p>
          <AddBtn label="ADD PILLAR" onClick={() => upd({ pillars: [...a.pillars, { icon: "Cpu", title: "New Pillar", description: "Description here." }] })} />
        </div>
        <div className="space-y-4">
          {a.pillars.map((pillar, i) => (
            <div key={i} className="border border-green-500/10 rounded-sm p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-slate-500">Pillar {i + 1}</span>
                <RemoveBtn onClick={() => upd({ pillars: a.pillars.filter((_, j) => j !== i) })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Icon (Cpu/Code2/Zap/Globe)">
                  <Input value={pillar.icon} onChange={e => {
                    const arr = [...a.pillars]; arr[i] = { ...arr[i], icon: e.target.value }; upd({ pillars: arr })
                  }} />
                </Field>
                <Field label="Title">
                  <Input value={pillar.title} onChange={e => {
                    const arr = [...a.pillars]; arr[i] = { ...arr[i], title: e.target.value }; upd({ pillars: arr })
                  }} />
                </Field>
              </div>
              <Field label="Description">
                <Textarea rows={2} value={pillar.description} onChange={e => {
                  const arr = [...a.pillars]; arr[i] = { ...arr[i], description: e.target.value }; upd({ pillars: arr })
                }} />
              </Field>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
