"use client"
import React from "react"
import { Field, Input, Select, Card, SectionTitle, AddBtn, RemoveBtn, type TabProps } from "./shared"
import ImageUpload from "./image-upload"

const SPANS = ["col-span-1 row-span-1","col-span-1 row-span-2","col-span-2 row-span-1","col-span-2 row-span-2"]

export default function GalleryTab({ content, setContent }: TabProps) {
  const g = content.gallery
  const upd = (patch: Partial<typeof g>) => setContent(c => c ? { ...c, gallery: { ...c.gallery, ...patch } } : c)
  const imgs = g.images

  return (
    <div className="space-y-6 max-w-2xl">
      <SectionTitle>Gallery</SectionTitle>

      <Card>
        <Field label="Instagram Handle">
          <Input value={g.instagramHandle} onChange={e => upd({ instagramHandle: e.target.value })} />
        </Field>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">Images</p>
          <AddBtn label="ADD IMAGE" onClick={() => upd({ images: [...imgs, {
            id: `g-${Date.now()}`, src: "", alt: "", caption: "New Image", span: "col-span-1 row-span-1"
          }] })} />
        </div>
        <div className="space-y-4">
          {imgs.map((img, i) => (
            <div key={img.id} className="border border-green-500/10 rounded-sm p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-mono text-slate-500">Image {i + 1}</span>
                <RemoveBtn onClick={() => upd({ images: imgs.filter((_, j) => j !== i) })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <ImageUpload label="Gallery Image" value={img.src} onChange={url => {
                    const a = [...imgs]; a[i] = { ...a[i], src: url }; upd({ images: a })
                  }} />
                </div>
                <Field label="Caption">
                  <Input value={img.caption} onChange={e => {
                    const a = [...imgs]; a[i] = { ...a[i], caption: e.target.value }; upd({ images: a })
                  }} />
                </Field>
                <Field label="Alt Text">
                  <Input value={img.alt} onChange={e => {
                    const a = [...imgs]; a[i] = { ...a[i], alt: e.target.value }; upd({ images: a })
                  }} />
                </Field>
                <Field label="Grid Span">
                  <Select options={SPANS} value={img.span} onChange={e => {
                    const a = [...imgs]; a[i] = { ...a[i], span: e.target.value }; upd({ images: a })
                  }} />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
