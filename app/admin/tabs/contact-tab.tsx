"use client"
import { Field, Input, Textarea, Card, SectionTitle, AddBtn, RemoveBtn, type TabProps } from "./shared"

export default function ContactTab({ content, setContent }: TabProps) {
  const ct = content.contact
  const upd = (patch: Partial<typeof ct>) => setContent(c => c ? { ...c, contact: { ...c.contact, ...patch } } : c)

  return (
    <div className="space-y-6 max-w-2xl">
      <SectionTitle>Contact & Footer</SectionTitle>

      <Card className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Email Address">
            <Input type="email" value={ct.email} onChange={e => upd({ email: e.target.value })} />
          </Field>
          <Field label="Meeting Schedule">
            <Input value={ct.meetingSchedule} onChange={e => upd({ meetingSchedule: e.target.value })} />
          </Field>
          <Field label="Location (Line 1)">
            <Input value={ct.location} onChange={e => upd({ location: e.target.value })} />
          </Field>
          <Field label="Location (Line 2)">
            <Input value={ct.locationDetail} onChange={e => upd({ locationDetail: e.target.value })} />
          </Field>
        </div>
        <Field label="Form Title">
          <Input value={ct.formTitle} onChange={e => upd({ formTitle: e.target.value })} />
        </Field>
        <Field label="Success Message (after form submit)">
          <Textarea rows={2} value={ct.successMessage} onChange={e => upd({ successMessage: e.target.value })} />
        </Field>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">Social Links</p>
          <AddBtn label="ADD SOCIAL" onClick={() => upd({ socials: [...ct.socials, { label: "Platform", handle: "@handle", href: "#" }] })} />
        </div>
        <div className="space-y-3">
          {ct.socials.map((s, i) => (
            <div key={i} className="flex gap-2 items-end">
              <Field label="Platform Name">
                <Input value={s.label} onChange={e => {
                  const a = [...ct.socials]; a[i] = { ...a[i], label: e.target.value }; upd({ socials: a })
                }} placeholder="GitHub" />
              </Field>
              <Field label="Handle">
                <Input value={s.handle} onChange={e => {
                  const a = [...ct.socials]; a[i] = { ...a[i], handle: e.target.value }; upd({ socials: a })
                }} placeholder="@handle" />
              </Field>
              <Field label="URL">
                <Input value={s.href} onChange={e => {
                  const a = [...ct.socials]; a[i] = { ...a[i], href: e.target.value }; upd({ socials: a })
                }} placeholder="https://..." />
              </Field>
              <RemoveBtn onClick={() => upd({ socials: ct.socials.filter((_, j) => j !== i) })} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
