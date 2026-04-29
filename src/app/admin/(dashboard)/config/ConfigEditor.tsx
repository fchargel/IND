"use client"
import { useState } from "react"
import { createClient } from "@/utils/supabase/client"

type Configs = Record<string, Record<string, unknown>>

export function ConfigEditor({ configs: initial }: { configs: Configs }) {
  const supabase = createClient()
  const [configs, setConfigs] = useState(initial)
  const [saving, setSaving] = useState<string | null>(null)
  const [msgs, setMsgs] = useState<Record<string, string>>({})

  async function save(key: string, value: Record<string, unknown>) {
    setSaving(key)
    const { error } = await supabase.from("page_config").upsert({ key, value })
    setSaving(null)
    setMsgs(m => ({ ...m, [key]: error ? "Erro: " + error.message : "Salvo!" }))
    setTimeout(() => setMsgs(m => ({ ...m, [key]: "" })), 3000)
  }

  function updateConfig(section: string, path: string[], val: unknown) {
    setConfigs(c => {
      const updated = structuredClone(c)
      let obj = updated[section] as Record<string, unknown>
      for (let i = 0; i < path.length - 1; i++) {
        obj = obj[path[i]] as Record<string, unknown>
      }
      obj[path[path.length - 1]] = val
      return updated
    })
  }

  const hero = (configs.hero ?? {}) as Record<string, unknown>
  const institutional = (configs.institutional ?? {}) as Record<string, unknown>
  const signup = (configs.signup ?? {}) as Record<string, unknown>
  const heroStats = (hero.stats as Array<{ num: string; lbl: string }>) ?? []
  const signupItems = (signup.items as Array<{ title: string; description: string; url: string }>) ?? []
  const institutionalMeta = (institutional.meta as Record<string, string>) ?? {}

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 48, maxWidth: 760 }}>

      {/* HERO */}
      <Section title="Hero" subtitle="Manchete e missão do topo da página">
        <Field label="Manchete principal (suporta <em> para itálico e <br/> para quebra)">
          <textarea
            style={{ ...inputStyle, height: 80 }}
            value={(hero.headline as string) ?? ""}
            onChange={e => updateConfig("hero", ["headline"], e.target.value)}
          />
        </Field>
        <Field label="Texto da missão">
          <textarea
            style={{ ...inputStyle, height: 100 }}
            value={(hero.mission as string) ?? ""}
            onChange={e => updateConfig("hero", ["mission"], e.target.value)}
          />
        </Field>
        <Field label="Estatísticas">
          {heroStats.map((stat, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 8, marginBottom: 8 }}>
              <input
                style={inputStyle}
                value={stat.num}
                placeholder="Número"
                onChange={e => {
                  const next = [...heroStats]
                  next[i] = { ...next[i], num: e.target.value }
                  updateConfig("hero", ["stats"], next)
                }}
              />
              <input
                style={inputStyle}
                value={stat.lbl}
                placeholder="Label"
                onChange={e => {
                  const next = [...heroStats]
                  next[i] = { ...next[i], lbl: e.target.value }
                  updateConfig("hero", ["stats"], next)
                }}
              />
            </div>
          ))}
        </Field>
        <SaveBtn onClick={() => save("hero", configs.hero)} loading={saving === "hero"} msg={msgs.hero} />
      </Section>

      {/* INSTITUCIONAL */}
      <Section title="Institucional" subtitle="Seção 'Quem somos'">
        <Field label="Parágrafo principal (suporta <span class='hl'> para itálico)">
          <textarea
            style={{ ...inputStyle, height: 120 }}
            value={(institutional.body as string) ?? ""}
            onChange={e => updateConfig("institutional", ["body"], e.target.value)}
          />
        </Field>
        <Field label="Ficha técnica">
          {Object.entries(institutionalMeta).map(([key, val]) => (
            <div key={key} style={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: 8, marginBottom: 8 }}>
              <input style={{ ...inputStyle, background: "#f5f5f5" }} value={key} readOnly />
              <input
                style={inputStyle}
                value={val}
                onChange={e => {
                  const next = { ...institutionalMeta, [key]: e.target.value }
                  updateConfig("institutional", ["meta"], next)
                }}
              />
            </div>
          ))}
        </Field>
        <SaveBtn onClick={() => save("institutional", configs.institutional)} loading={saving === "institutional"} msg={msgs.institutional} />
      </Section>

      {/* INSCRIÇÕES */}
      <Section title="Inscrições" subtitle="Seção de interesse e formulários">
        <Field label="Título da seção">
          <input
            style={inputStyle}
            value={(signup.headline as string) ?? ""}
            onChange={e => updateConfig("signup", ["headline"], e.target.value)}
          />
        </Field>
        {signupItems.map((item, i) => (
          <div key={i} style={{ padding: 20, border: "1px solid var(--line)", borderRadius: 10, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)" }}>
              Item {i + 1}
            </div>
            <Field label="Título">
              <input style={inputStyle} value={item.title} onChange={e => {
                const next = [...signupItems]
                next[i] = { ...next[i], title: e.target.value }
                updateConfig("signup", ["items"], next)
              }} />
            </Field>
            <Field label="Descrição">
              <input style={inputStyle} value={item.description} onChange={e => {
                const next = [...signupItems]
                next[i] = { ...next[i], description: e.target.value }
                updateConfig("signup", ["items"], next)
              }} />
            </Field>
            <Field label="URL do formulário">
              <input style={inputStyle} value={item.url} onChange={e => {
                const next = [...signupItems]
                next[i] = { ...next[i], url: e.target.value }
                updateConfig("signup", ["items"], next)
              }} />
            </Field>
          </div>
        ))}
        <SaveBtn onClick={() => save("signup", configs.signup)} loading={saving === "signup"} msg={msgs.signup} />
      </Section>

    </div>
  )
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid var(--line)" }}>
        <h2 style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: 26, letterSpacing: "-0.025em", margin: "0 0 4px" }}>{title}</h2>
        <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>{subtitle}</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {children}
      </div>
    </div>
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

function SaveBtn({ onClick, loading, msg }: { onClick: () => void; loading: boolean; msg?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
      <button
        onClick={onClick}
        disabled={loading}
        style={{ background: "var(--ink)", color: "var(--paper)", border: "none", borderRadius: 999, padding: "12px 24px", fontSize: 14, fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
      >
        {loading ? "Salvando..." : "Salvar"}
      </button>
      {msg && <span style={{ fontSize: 13, color: msg.startsWith("Erro") ? "#c00" : "#1a8a4a" }}>{msg}</span>}
    </div>
  )
}

const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 12px", border: "1px solid var(--line)", borderRadius: 8, fontSize: 14, fontFamily: "inherit", outline: "none", background: "white" }
