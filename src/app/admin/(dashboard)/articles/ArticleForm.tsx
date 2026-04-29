"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import type { Article } from "@/utils/supabase/types"

type Props = { article?: Article }

function slugify(str: string) {
  return str.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim().replace(/\s+/g, "-")
}

export function ArticleForm({ article }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [msg, setMsg] = useState("")

  const [form, setForm] = useState({
    title: article?.title ?? "",
    slug: article?.slug ?? "",
    excerpt: article?.excerpt ?? "",
    content: article?.content ?? "",
    publisher: article?.publisher ?? "",
    published_at: article?.published_at ?? "",
    published: article?.published ?? false,
    cover_url: article?.cover_url ?? "",
  })

  function set(field: string, value: unknown) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMsg("")
    const payload = { ...form, slug: form.slug || slugify(form.title) }
    const { error } = article?.id
      ? await supabase.from("articles").update(payload).eq("id", article.id)
      : await supabase.from("articles").insert(payload)
    setSaving(false)
    if (error) { setMsg("Erro: " + error.message); return }
    setMsg("Salvo!")
    if (!article?.id) router.push("/admin/articles")
  }

  async function handleDelete() {
    if (!article?.id) return
    if (!confirm("Excluir esta matéria?")) return
    setDeleting(true)
    await supabase.from("articles").delete().eq("id", article.id)
    router.push("/admin/articles")
  }

  return (
    <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 760 }}>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Field label="Veículo (ex: Cada Minuto)">
          <input style={inputStyle} value={form.publisher} onChange={e => set("publisher", e.target.value)} placeholder="Nome do veículo" />
        </Field>
        <Field label="Data de publicação">
          <input type="date" style={inputStyle} value={form.published_at} onChange={e => set("published_at", e.target.value)} />
        </Field>
      </div>

      <Field label="Título da matéria">
        <input
          style={inputStyle}
          value={form.title}
          onChange={e => { set("title", e.target.value); if (!article?.id) set("slug", slugify(e.target.value)) }}
          placeholder="Título completo da notícia"
          required
        />
      </Field>

      <Field label="Slug (URL)">
        <input style={inputStyle} value={form.slug} onChange={e => set("slug", e.target.value)} placeholder="gerado-automaticamente" />
      </Field>

      <Field label="Resumo (excerpt)">
        <textarea style={{ ...inputStyle, height: 80, resize: "vertical" }} value={form.excerpt} onChange={e => set("excerpt", e.target.value)} placeholder="Breve descrição para cards" />
      </Field>

      <Field label="Link externo da matéria (URL)">
        <input style={inputStyle} value={form.content} onChange={e => set("content", e.target.value)} placeholder="https://..." />
      </Field>

      <Field label="URL da imagem de capa">
        <input style={inputStyle} value={form.cover_url} onChange={e => set("cover_url", e.target.value)} placeholder="https://... ou caminho /assets/..." />
        {form.cover_url && (
          <img src={form.cover_url} alt="preview" style={{ marginTop: 8, height: 120, objectFit: "cover", borderRadius: 8, border: "1px solid var(--line)" }} onError={e => { (e.target as HTMLImageElement).style.display = "none" }} />
        )}
      </Field>

      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 0", borderTop: "1px solid var(--line)" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14 }}>
          <input
            type="checkbox"
            checked={form.published}
            onChange={e => set("published", e.target.checked)}
            style={{ width: 18, height: 18, cursor: "pointer" }}
          />
          Publicar (aparecer no site)
        </label>
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button type="submit" disabled={saving} style={primaryBtn}>
          {saving ? "Salvando..." : article?.id ? "Salvar alterações" : "Criar matéria"}
        </button>
        {article?.id && (
          <button type="button" onClick={handleDelete} disabled={deleting} style={dangerBtn}>
            {deleting ? "Excluindo..." : "Excluir"}
          </button>
        )}
        {msg && <span style={{ fontSize: 13, color: msg.startsWith("Erro") ? "#c00" : "#1a8a4a" }}>{msg}</span>}
      </div>
    </form>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)" }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = { width: "100%", padding: "12px 14px", border: "1px solid var(--line)", borderRadius: 8, fontSize: 14, fontFamily: "inherit", outline: "none", background: "white" }
const primaryBtn: React.CSSProperties = { background: "var(--ink)", color: "var(--paper)", border: "none", borderRadius: 999, padding: "12px 24px", fontSize: 14, fontWeight: 500, cursor: "pointer" }
const dangerBtn: React.CSSProperties = { background: "none", color: "#c00", border: "1px solid #fcc", borderRadius: 999, padding: "12px 24px", fontSize: 14, fontWeight: 500, cursor: "pointer" }
