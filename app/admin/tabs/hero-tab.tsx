"use client"
import { Field, Input, Textarea, Card, SectionTitle, AddBtn, RemoveBtn, type TabProps } from "./shared"

export default function HeroTab({ content, setContent }: TabProps) {
  const h = content.hero
  const upd = (patch: Partial<typeof h>) => setContent(c => c ? { ...c, hero: { ...c.hero, ...patch } } : c)

  return (
    <div className="space-y-6 max-w-2xl">
      <SectionTitle>Hero Section</SectionTitle>

      <Card>
        <Field label="Badge Text">
          <Input value={h.badge} onChange={e => upd({ badge: e.target.value })} />
        </Field>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">Scramble Phrases</p>
          <AddBtn onClick={() => upd({ phrases: [...h.phrases, "NEW PHRASE"] })} />
        </div>
        <div className="space-y-2">
          {h.phrases.map((phrase, i) => (
            <div key={i} className="flex gap-2">
              <Input value={phrase} onChange={e => {
                const p = [...h.phrases]; p[i] = e.target.value; upd({ phrases: p })
              }} />
              <RemoveBtn onClick={() => upd({ phrases: h.phrases.filter((_, j) => j !== i) })} />
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <Field label="Tagline">
          <Input value={h.tagline} onChange={e => upd({ tagline: e.target.value })} />
        </Field>
      </Card>

      <Card className="grid grid-cols-2 gap-4">
        <Field label="Primary CTA Button">
          <Input value={h.ctaPrimary} onChange={e => upd({ ctaPrimary: e.target.value })} />
        </Field>
        <Field label="Secondary CTA Button">
          <Input value={h.ctaSecondary} onChange={e => upd({ ctaSecondary: e.target.value })} />
        </Field>
      </Card>
    </div>
  )
}
