"use client"
import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Plus, Trash2, Upload } from "lucide-react"
import type { Project } from "@/utils/supabase/types"

export function ProjectsEditor({ projects: initial }: { projects: Project[] }) {
  const supabase = createClient()
  const [projects, setProjects] = useState(initial)
  const [saving, setSaving] = useState<string | null>(null)
  const [msgs, setMsgs] = useState<Record<string, string>>({})
  const [uploading, setUploading] = useState<string | null>(null)

  function update(id: string, field: keyof Project, value: unknown) {
    setProjects(ps => ps.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  async function save(proj: Project) {
    setSaving(proj.id)
    const { error } = await supabase.from("projects").upsert(proj)
    setSaving(null)
    setMsgs(m => ({ ...m, [proj.id]: error ? "Erro: " + error.message : "Salvo!" }))
    setTimeout(() => setMsgs(m => ({ ...m, [proj.id]: "" })), 3000)
  }

  async function addProject() {
    const { data, error } = await supabase
      .from("projects")
      .insert({ title: "Novo projeto", display_order: projects.length, active: false })
      .select()
      .single()
    if (!error && data) setProjects(ps => [...ps, data])
  }

  async function deleteProject(id: string) {
    if (!confirm("Excluir este projeto?")) return
    await supabase.from("projects").delete().eq("id", id)
    setProjects(ps => ps.filter(p => p.id !== id))
  }

  async function uploadImage(projId: string, file: File) {
    setUploading(projId)
    const ext = file.name.split(".").pop()
    const path = `projects/${Date.now()}.${ext}`
    const { error: upErr } = await supabase.storage.from("media").upload(path, file)
    if (upErr) { setMsgs(m => ({ ...m, [projId]: "Erro upload: " + upErr.message })); setUploading(null); return }
    const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(path)
    update(projId, "image_url", publicUrl)
    setUploading(null)
  }

  return (
    <div style={{ maxWidth: 800, display: "flex", flexDirection: "column", gap: 24 }}>
      {projects.map(proj => (
        <div key={proj.id} style={{ border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden", background: "white" }}>
          <div style={{ padding: "20px 24px 0", display: "flex", gap: 20 }}>

            {/* imagem */}
            <div style={{ flexShrink: 0 }}>
              <div style={{ width: 160, height: 120, borderRadius: 8, overflow: "hidden", background: "#f0f0f0", position: "relative" }}>
                {proj.image_url && (
                  <img
                    src={proj.image_url.startsWith("http") ? proj.image_url : `/assets/${proj.image_url.replace(/^assets\//, "")}`}
                    alt={proj.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                )}
                <label style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.35)", cursor: "pointer", opacity: 0, transition: "opacity .2s" }} className="img-upload-overlay">
                  <Upload size={20} color="white" />
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { if (e.target.files?.[0]) uploadImage(proj.id, e.target.files[0]) }} />
                </label>
              </div>
              {uploading === proj.id && <div style={{ fontSize: 11, color: "var(--muted)", textAlign: "center", marginTop: 4 }}>Enviando…</div>}
              <div style={{ marginTop: 4 }}>
                <input
                  style={{ ...inputStyle, fontSize: 12 }}
                  value={proj.image_url ?? ""}
                  placeholder="URL da imagem"
                  onChange={e => update(proj.id, "image_url", e.target.value)}
                />
              </div>
            </div>

            {/* campos */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                style={{ ...inputStyle, fontFamily: "var(--display)", fontWeight: 800, fontSize: 18 }}
                value={proj.title}
                onChange={e => update(proj.id, "title", e.target.value)}
                placeholder="Título do projeto"
              />
              <textarea
                style={{ ...inputStyle, height: 72, resize: "vertical" }}
                value={proj.description ?? ""}
                onChange={e => update(proj.id, "description", e.target.value)}
                placeholder="Descrição breve"
              />
              <input
                style={inputStyle}
                value={proj.form_url ?? ""}
                onChange={e => update(proj.id, "form_url", e.target.value)}
                placeholder="URL do formulário de inscrição (opcional)"
              />
            </div>
          </div>

          <div style={{ padding: "16px 24px", display: "flex", alignItems: "center", gap: 16, borderTop: "1px solid var(--line)", marginTop: 20, background: "#fafafa" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={proj.active}
                onChange={e => update(proj.id, "active", e.target.checked)}
                style={{ width: 16, height: 16 }}
              />
              Visível no site
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
              {msgs[proj.id] && <span style={{ fontSize: 12, color: msgs[proj.id].startsWith("Erro") ? "#c00" : "#1a8a4a" }}>{msgs[proj.id]}</span>}
              <button onClick={() => deleteProject(proj.id)} style={dangerBtn} title="Excluir"><Trash2 size={14} /></button>
              <button onClick={() => save(proj)} disabled={saving === proj.id} style={primaryBtn}>
                {saving === proj.id ? "Salvando…" : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addProject}
        style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 24px", border: "2px dashed var(--line)", borderRadius: 12, background: "none", cursor: "pointer", fontSize: 14, color: "var(--muted)", justifyContent: "center" }}
      >
        <Plus size={18} /> Adicionar projeto
      </button>

      <style>{`.img-upload-overlay:hover { opacity: 1 !important; }`}</style>
    </div>
  )
}

const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", border: "1px solid var(--line)", borderRadius: 8, fontSize: 14, fontFamily: "inherit", outline: "none", background: "white" }
const primaryBtn: React.CSSProperties = { background: "var(--ink)", color: "var(--paper)", border: "none", borderRadius: 999, padding: "9px 20px", fontSize: 13, fontWeight: 500, cursor: "pointer" }
const dangerBtn: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, background: "none", border: "1px solid #fcc", borderRadius: 8, color: "#c00", cursor: "pointer" }
