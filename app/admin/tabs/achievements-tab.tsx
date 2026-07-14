"use client"
import { Field, Input, Textarea, Select, Card, SectionTitle, AddBtn, RemoveBtn, type TabProps } from "./shared"

export default function AchievementsTab({ content, setContent }: TabProps) {
  const ach = content.achievements.achievements
  const upd = (a: typeof ach) => setContent(c => c ? { ...c, achievements: { achievements: a } } : c)

  return (
    <div className="space-y-6 max-w-2xl">
      <SectionTitle>Achievements</SectionTitle>
      <div className="flex justify-end">
        <AddBtn label="ADD ACHIEVEMENT" onClick={() => upd([...ach, {
          id: `a-${Date.now()}`, year: "2026", title: "New Achievement", subtitle: "Position / Award",
          description: "Description...", icon: "Trophy", color: "green" as const, highlight: false,
        }])} />
      </div>
      <div className="space-y-4">
        {ach.map((item, i) => (
          <Card key={item.id}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="matrix-tag">{item.year}</span>
                {item.highlight && <span className="text-xs text-green-400 font-mono">⭐ Featured</span>}
              </div>
              <RemoveBtn onClick={() => upd(ach.filter((_, j) => j !== i))} />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <Field label="Year">
                <Input value={item.year} onChange={e => { const a=[...ach]; a[i]={...a[i],year:e.target.value}; upd(a) }} />
              </Field>
              <Field label="Icon (Trophy/Star/Award/Medal)">
                <Select options={["Trophy","Star","Award","Medal"]} value={item.icon}
                  onChange={e => { const a=[...ach]; a[i]={...a[i],icon:e.target.value}; upd(a) }} />
              </Field>
              <Field label="Title">
                <Input value={item.title} onChange={e => { const a=[...ach]; a[i]={...a[i],title:e.target.value}; upd(a) }} />
              </Field>
              <Field label="Subtitle (Position)">
                <Input value={item.subtitle} onChange={e => { const a=[...ach]; a[i]={...a[i],subtitle:e.target.value}; upd(a) }} />
              </Field>
              <Field label="Color">
                <Select options={["green","cyan"]} value={item.color}
                  onChange={e => { const a=[...ach]; a[i]={...a[i],color:e.target.value as "green"|"cyan"}; upd(a) }} />
              </Field>
              <Field label="Featured Highlight">
                <Select options={["false","true"]} value={String(item.highlight)}
                  onChange={e => { const a=[...ach]; a[i]={...a[i],highlight:e.target.value==="true"}; upd(a) }} />
              </Field>
            </div>
            <Field label="Description">
              <Textarea rows={2} value={item.description} onChange={e => { const a=[...ach]; a[i]={...a[i],description:e.target.value}; upd(a) }} />
            </Field>
          </Card>
        ))}
      </div>
    </div>
  )
}
