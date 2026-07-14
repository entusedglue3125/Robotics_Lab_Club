"use client"
import React from "react"
import { Field, Input, Card, SectionTitle, AddBtn, RemoveBtn, type TabProps } from "./shared"
import type { TeamMember } from "@/lib/content-types"
import ImageUpload from "./image-upload"

const newMember = (): TeamMember => ({
  id: `m-${Date.now()}`, name: "New Member", role: "Role", focus: "Focus area",
  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
  github: "#", linkedin: "#",
})

export default function TeamsTab({ content, setContent }: TabProps) {
  const teams = content.teams.teams
  const upd = (t: typeof teams) => setContent(c => c ? { ...c, teams: { teams: t } } : c)

  return (
    <div className="space-y-6 max-w-2xl">
      <SectionTitle>Team Roster</SectionTitle>
      <div className="flex justify-end">
        <AddBtn label="ADD DIVISION" onClick={() => upd([...teams, {
          id: `team-${Date.now()}`, division: "New Division", tag: "DIVISION", members: []
        }])} />
      </div>

      {teams.map((team, ti) => (
        <Card key={team.id}>
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-3 flex-1 mr-3">
              <Field label="Division Name">
                <Input value={team.division} onChange={e => {
                  const a = [...teams]; a[ti] = { ...a[ti], division: e.target.value }; upd(a)
                }} />
              </Field>
              <Field label="Tag">
                <Input value={team.tag} onChange={e => {
                  const a = [...teams]; a[ti] = { ...a[ti], tag: e.target.value }; upd(a)
                }} />
              </Field>
            </div>
            <RemoveBtn onClick={() => upd(teams.filter((_, j) => j !== ti))} />
          </div>

          <div className="flex justify-between items-center mb-3">
            <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">Members</p>
            <AddBtn label="ADD MEMBER" onClick={() => {
              const a = [...teams]; a[ti] = { ...a[ti], members: [...a[ti].members, newMember()] }; upd(a)
            }} />
          </div>

          <div className="space-y-3">
            {team.members.map((member, mi) => (
              <div key={member.id} className="border border-green-500/10 rounded-sm p-3 space-y-3">
                <div className="flex justify-between">
                  <span className="text-xs font-mono text-slate-600">{member.name}</span>
                  <RemoveBtn onClick={() => {
                    const a = [...teams]; a[ti] = { ...a[ti], members: a[ti].members.filter((_, j) => j !== mi) }; upd(a)
                  }} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(["name", "role", "focus", "github", "linkedin"] as (keyof TeamMember)[]).map(key => (
                    <Field key={key} label={key.charAt(0).toUpperCase() + key.slice(1)}>
                      <Input value={member[key]} onChange={e => {
                        const a = [...teams]
                        const ms = [...a[ti].members]
                        ms[mi] = { ...ms[mi], [key]: e.target.value }
                        a[ti] = { ...a[ti], members: ms }
                        upd(a)
                      }} />
                    </Field>
                  ))}
                  <div className="col-span-2 mt-2">
                    <ImageUpload label="Member Photo" value={member.image} onChange={url => {
                      const a = [...teams]
                      const ms = [...a[ti].members]
                      ms[mi] = { ...ms[mi], image: url }
                      a[ti] = { ...a[ti], members: ms }
                      upd(a)
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  )
}
