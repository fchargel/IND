"use client"
import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Plus, Trash2, GripVertical, Eye, EyeOff } from "lucide-react"
import type { HeroImage } from "@/utils/supabase/types"

export function HeroEditor({ images: initial }: { images: HeroImage[] }) {
  const supabase = createClient()
  const [images, setImages] = useState(initial)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState("")

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setMsg("")

    const ext = file.name.split(".").pop()
    const path = `hero/${Date.now()}.${ext}`
    const { error: upErr } = await supabase.storage.from("media").upload(path, file)
    if (upErr) { setMsg("Erro no upload: " + upErr.message); setUploading(false); return }

    const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(path)
    const { data: newImg, error } = await supabase
      .from("hero_images")
      .insert({ url: publicUrl, alt: file.name, display_order: images.length })
      .select()
      .single()

    if (error) { setMsg("Erro ao salvar: " + error.message) }
    else { setImages(imgs => [...imgs, newImg]) }
    setUploading(false)
    e.target.value = ""
  }

  async function toggleActive(img: HeroImage) {
    const { error } = await supabase.from("hero_images").update({ active: !img.active }).eq("id", img.id)
    if (!error) setImages(imgs => imgs.map(i => i.id === img.id ? { ...i, active: !i.active } : i))
  }

  async function deleteImage(img: HeroImage) {
    if (!confirm("Excluir esta imagem?")) return
    await supabase.from("hero_images").delete().eq("id", img.id)
    setImages(imgs => imgs.filter(i => i.id !== img.id))
  }

  async function updateAlt(img: HeroImage, alt: string) {
    await supabase.from("hero_images").update({ alt }).eq("id", img.id)
    setImages(imgs => imgs.map(i => i.id === img.id ? { ...i, alt } : i))
  }

  return (
    <div style={{ maxWidth: 860 }}>
      {/* upload */}
      <div style={{ marginBottom: 32, padding: 28, border: "2px dashed var(--line)", borderRadius: 12, textAlign: "center" }}>
        <label style={{ cursor: uploading ? "not-allowed" : "pointer", display: "block" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <Plus size={32} style={{ color: "var(--muted)" }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{uploading ? "Enviando..." : "Clique para enviar foto"}</div>
              <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>JPG, PNG — max 10MB</div>
            </div>
          </div>
          <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} style={{ display: "none" }} />
        </label>
      </div>

      {msg && <p style={{ marginBottom: 16, color: msg.startsWith("Erro") ? "#c00" : "#1a8a4a", fontSize: 13 }}>{msg}</p>}

      {/* grid de imagens */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {images.map((img) => (
          <div key={img.id} style={{ border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden", background: "white", opacity: img.active ? 1 : 0.55 }}>
            <div style={{ aspectRatio: "16/9", position: "relative", background: "#eee" }}>
              <img src={img.url} alt={img.alt ?? ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 6 }}>
                <button onClick={() => toggleActive(img)} title={img.active ? "Desativar" : "Ativar"} style={iconBtn}>
                  {img.active ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button onClick={() => deleteImage(img)} title="Excluir" style={{ ...iconBtn, color: "#c00" }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div style={{ padding: "12px 14px" }}>
              <input
                defaultValue={img.alt ?? ""}
                onBlur={e => updateAlt(img, e.target.value)}
                placeholder="Texto alternativo (acessibilidade)"
                style={{ width: "100%", border: "none", borderBottom: "1px solid var(--line)", padding: "4px 0", fontSize: 13, outline: "none", background: "none" }}
              />
              <div style={{ marginTop: 6, fontSize: 11, color: "var(--muted)" }}>
                {img.active ? "✓ Ativa" : "Inativa"} · ordem {img.display_order + 1}
              </div>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <p style={{ textAlign: "center", color: "var(--muted)", padding: "48px 0" }}>Nenhuma imagem ainda. Faça upload acima.</p>
      )}
    </div>
  )
}

const iconBtn: React.CSSProperties = {
  width: 32, height: 32, borderRadius: 8,
  background: "rgba(255,255,255,0.9)", backdropFilter: "blur(4px)",
  border: "1px solid rgba(0,0,0,0.1)",
  display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer",
}
