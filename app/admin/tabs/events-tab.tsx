"use client"
import React from "react"
import { Field, Input, Textarea, Select, Card, SectionTitle, AddBtn, RemoveBtn, type TabProps } from "./shared"
import ImageUpload from "./image-upload"

const newEvent = () => ({
  id: `evt-${Date.now()}`, title: "New Event", type: "Workshop",
  date: "", time: "", venue: "", description: "", status: "upcoming" as const, image: "", color: "green" as const,
})

export default function EventsTab({ content, setContent }: TabProps) {
  const ev = content.events.events
  const upd = (events: typeof ev) => setContent(c => c ? { ...c, events: { events } } : c)

  return (
    <div className="space-y-6 max-w-2xl">
      <SectionTitle>Events & Workshops</SectionTitle>
      <div className="flex justify-end">
        <AddBtn label="ADD EVENT" onClick={() => upd([...ev, newEvent()])} />
      </div>
      <div className="space-y-4">
        {ev.map((event, i) => (
          <Card key={event.id}>
            <div className="flex justify-between items-center mb-4">
              <span className={`text-xs font-mono px-2 py-0.5 rounded-sm ${event.status === "upcoming" ? "bg-green-500/10 text-green-400" : "bg-slate-700 text-slate-400"}`}>
                {event.status.toUpperCase()}
              </span>
              <RemoveBtn onClick={() => upd(ev.filter((_, j) => j !== i))} />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <Field label="Title">
                <Input value={event.title} onChange={e => {
                  const a = [...ev]; a[i] = { ...a[i], title: e.target.value }; upd(a)
                }} />
              </Field>
              <Field label="Type">
                <Input value={event.type} onChange={e => {
                  const a = [...ev]; a[i] = { ...a[i], type: e.target.value }; upd(a)
                }} placeholder="Workshop / Competition" />
              </Field>
              <Field label="Date">
                <Input value={event.date} onChange={e => {
                  const a = [...ev]; a[i] = { ...a[i], date: e.target.value }; upd(a)
                }} placeholder="Aug 15, 2026" />
              </Field>
              <Field label="Time">
                <Input value={event.time} onChange={e => {
                  const a = [...ev]; a[i] = { ...a[i], time: e.target.value }; upd(a)
                }} placeholder="09:00 AM" />
              </Field>
              <Field label="Venue">
                <Input value={event.venue} onChange={e => {
                  const a = [...ev]; a[i] = { ...a[i], venue: e.target.value }; upd(a)
                }} />
              </Field>
              <Field label="Status">
                <Select options={["upcoming","past"]} value={event.status} onChange={e => {
                  const a = [...ev]; a[i] = { ...a[i], status: e.target.value as "upcoming"|"past" }; upd(a)
                }} />
              </Field>
              <Field label="Color">
                <Select options={["green","cyan"]} value={event.color} onChange={e => {
                  const a = [...ev]; a[i] = { ...a[i], color: e.target.value as "green"|"cyan" }; upd(a)
                }} />
              </Field>
              <div className="col-span-2">
                <ImageUpload label="Event Image" value={event.image} onChange={url => {
                  const a = [...ev]; a[i] = { ...a[i], image: url }; upd(a)
                }} />
              </div>
            </div>
            <Field label="Description">
              <Textarea rows={2} value={event.description} onChange={e => {
                const a = [...ev]; a[i] = { ...a[i], description: e.target.value }; upd(a)
              }} />
            </Field>
          </Card>
        ))}
      </div>
    </div>
  )
}
