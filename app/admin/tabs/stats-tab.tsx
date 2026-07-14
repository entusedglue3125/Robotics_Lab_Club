"use client"
import { Field, Input, Card, SectionTitle, AddBtn, RemoveBtn, type TabProps } from "./shared"

export default function StatsTab({ content, setContent }: TabProps) {
  const s = content.stats
  const upd = (patch: Partial<typeof s>) => setContent(c => c ? { ...c, stats: { ...c.stats, ...patch } } : c)

  return (
    <div className="space-y-6 max-w-2xl">
      <SectionTitle>Stats Section</SectionTitle>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">Main Stat Cards</p>
          <AddBtn onClick={() => upd({ stats: [...s.stats, { value: 0, label: "New Stat", suffix: "", prefix: "" }] })} />
        </div>
        <div className="space-y-3">
          {s.stats.map((stat, i) => (
            <div key={i} className="border border-green-500/10 rounded-sm p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-mono text-slate-500">Stat {i + 1}</span>
                <RemoveBtn onClick={() => upd({ stats: s.stats.filter((_, j) => j !== i) })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Label">
                  <Input value={stat.label} onChange={e => {
                    const arr = [...s.stats]; arr[i] = { ...arr[i], label: e.target.value }; upd({ stats: arr })
                  }} />
                </Field>
                <Field label="Value (number)">
                  <Input type="number" value={stat.value} onChange={e => {
                    const arr = [...s.stats]; arr[i] = { ...arr[i], value: Number(e.target.value) }; upd({ stats: arr })
                  }} />
                </Field>
                <Field label="Prefix (e.g. $)">
                  <Input value={stat.prefix} onChange={e => {
                    const arr = [...s.stats]; arr[i] = { ...arr[i], prefix: e.target.value }; upd({ stats: arr })
                  }} />
                </Field>
                <Field label="Suffix (e.g. +)">
                  <Input value={stat.suffix} onChange={e => {
                    const arr = [...s.stats]; arr[i] = { ...arr[i], suffix: e.target.value }; upd({ stats: arr })
                  }} />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">Sub Stats (small row)</p>
          <AddBtn onClick={() => upd({ subStats: [...s.subStats, { label: "New", val: "0" }] })} />
        </div>
        <div className="space-y-2">
          {s.subStats.map((sub, i) => (
            <div key={i} className="flex gap-2 items-end">
              <Field label="Label">
                <Input value={sub.label} onChange={e => {
                  const arr = [...s.subStats]; arr[i] = { ...arr[i], label: e.target.value }; upd({ subStats: arr })
                }} />
              </Field>
              <Field label="Value">
                <Input value={sub.val} onChange={e => {
                  const arr = [...s.subStats]; arr[i] = { ...arr[i], val: e.target.value }; upd({ subStats: arr })
                }} />
              </Field>
              <RemoveBtn onClick={() => upd({ subStats: s.subStats.filter((_, j) => j !== i) })} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
