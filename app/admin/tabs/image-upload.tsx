"use client"

import { useRef, useState } from "react"
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react"

interface ImageUploadProps {
  /** Current image URL to preview */
  value: string
  /** Called with the new URL after upload or when URL is typed */
  onChange: (url: string) => void
  /** Optional label shown above the control */
  label?: string
}

export default function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const compressImage = (file: File, maxDim = 1400, quality = 0.82): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          let width = img.width
          let height = img.height

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width)
              width = maxDim
            } else {
              width = Math.round((width * maxDim) / height)
              height = maxDim
            }
          }

          const canvas = document.createElement("canvas")
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext("2d")
          if (!ctx) {
            resolve(e.target?.result as string)
            return
          }

          ctx.drawImage(img, 0, 0, width, height)
          const mime = file.type === "image/png" ? "image/png" : "image/jpeg"
          const compressed = canvas.toDataURL(mime, quality)
          resolve(compressed)
        }
        img.onerror = () => resolve(e.target?.result as string)
        img.src = e.target?.result as string
      }
      reader.onerror = () => {
        const fallbackReader = new FileReader()
        fallbackReader.onload = () => resolve(fallbackReader.result as string)
        fallbackReader.readAsDataURL(file)
      }
      reader.readAsDataURL(file)
    })
  }

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) { setError("Only images allowed"); return }
    if (file.size > 10 * 1024 * 1024) { setError("Max file size is 10MB"); return }

    setError(null)
    setUploading(true)
    setSuccess(false)

    try {
      // 1. Try uploading to /api/upload endpoint
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      const data = await res.json()

      if (res.ok && data.url) {
        onChange(data.url)
      } else {
        // Fall back to compressed Data URL
        const dataUrl = await compressImage(file)
        onChange(dataUrl)
      }
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2500)
    } catch {
      try {
        // Fall back to compressed Data URL if server upload fails
        const dataUrl = await compressImage(file)
        onChange(dataUrl)
        setSuccess(true)
        setTimeout(() => setSuccess(false), 2500)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Upload failed")
      }
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-xs font-mono text-slate-500 tracking-wider uppercase block">{label}</label>
      )}

      {/* URL input + upload button row */}
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="https://... or upload below"
          className="flex-1 bg-black/50 border border-green-500/20 focus:border-green-500/50 rounded-sm px-3 py-2 text-sm font-mono text-white outline-none transition-colors placeholder:text-slate-700"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          title="Upload from device"
          className="shrink-0 px-3 py-2 border border-green-500/30 text-green-400 hover:bg-green-500/10 transition-colors rounded-sm disabled:opacity-50 flex items-center gap-1.5 text-xs font-mono"
        >
          <Upload size={13} />
          {uploading ? "..." : "UPLOAD"}
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = "" }}
      />

      {/* Drag-and-drop zone — shown only if no image yet */}
      {!value && (
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          className="border border-dashed border-green-500/20 hover:border-green-500/50 rounded-sm p-4 text-center cursor-pointer transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          <Upload size={18} className="mx-auto text-slate-600 mb-1" />
          <p className="text-xs font-mono text-slate-700">Drag & drop or click to upload</p>
          <p className="text-xs font-mono text-slate-800 mt-0.5">PNG, JPG, WEBP · max 5MB</p>
        </div>
      )}

      {/* Preview */}
      {value && (
        <div className="relative group inline-block">
          <img
            src={value}
            alt="Preview"
            className="h-24 w-full object-cover rounded-sm border border-green-500/20 grayscale group-hover:grayscale-0 transition-all"
            onError={e => { (e.target as HTMLImageElement).style.display = "none" }}
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-1 right-1 w-5 h-5 bg-black/80 text-red-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            title="Remove image"
          >
            <X size={10} />
          </button>
        </div>
      )}

      {/* Status messages */}
      {success && (
        <p className="flex items-center gap-1.5 text-xs font-mono text-green-400">
          <CheckCircle size={11} /> Uploaded successfully
        </p>
      )}
      {error && (
        <p className="flex items-center gap-1.5 text-xs font-mono text-red-400">
          <AlertCircle size={11} /> {error}
        </p>
      )}
      {uploading && (
        <div className="h-0.5 bg-green-500/10 rounded overflow-hidden">
          <div className="h-full bg-green-500 animate-[border-flow_1s_ease_infinite] w-1/2" />
        </div>
      )}
    </div>
  )
}
