import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import { Plus, ExternalLink, Pencil } from "lucide-react"
import type { Article } from "@/utils/supabase/types"

export default async function ArticlesPage() {
  const supabase = await createClient()
  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div style={{ padding: "48px 56px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40 }}>
        <div>
          <p style={{ fontFamily: "var(--sans)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)", margin: "0 0 8px" }}>Conteúdo</p>
          <h1 style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: 40, lineHeight: 0.95, letterSpacing: "-0.035em", margin: 0 }}>Matérias</h1>
        </div>
        <Link
          href="/admin/articles/new"
          style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--ink)", color: "var(--paper)", padding: "12px 20px", borderRadius: 999, fontSize: 14, fontWeight: 500, textDecoration: "none" }}
        >
          <Plus size={16} /> Nova matéria
        </Link>
      </div>

      <div style={{ border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden", background: "white" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--line)", background: "#fafafa" }}>
              <th style={thStyle}>Título</th>
              <th style={thStyle}>Veículo</th>
              <th style={thStyle}>Data</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}></th>
            </tr>
          </thead>
          <tbody>
            {(articles as Article[])?.map((art) => (
              <tr key={art.id} style={{ borderBottom: "1px solid var(--line)" }}>
                <td style={tdStyle}>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{art.title}</div>
                  {art.excerpt && <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{art.excerpt.slice(0, 80)}…</div>}
                </td>
                <td style={tdStyle}>{art.publisher ?? "—"}</td>
                <td style={tdStyle}>{art.published_at ? new Date(art.published_at).toLocaleDateString("pt-BR") : "—"}</td>
                <td style={tdStyle}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 500,
                    background: art.published ? "#e8f5e9" : "#fff3e0",
                    color: art.published ? "#1a8a4a" : "#e65100"
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: art.published ? "#1a8a4a" : "#e65100" }}></span>
                    {art.published ? "Publicado" : "Rascunho"}
                  </span>
                </td>
                <td style={{ ...tdStyle, textAlign: "right" }}>
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    {art.content && art.content.startsWith("http") && (
                      <a href={art.content} target="_blank" rel="noopener" style={iconBtnStyle}>
                        <ExternalLink size={14} />
                      </a>
                    )}
                    <Link href={`/admin/articles/${art.id}`} style={iconBtnStyle}>
                      <Pencil size={14} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {(!articles || articles.length === 0) && (
              <tr>
                <td colSpan={5} style={{ padding: "48px 24px", textAlign: "center", color: "var(--muted)", fontSize: 14 }}>
                  Nenhuma matéria cadastrada ainda.{" "}
                  <Link href="/admin/articles/new" style={{ color: "var(--ink)", fontWeight: 500 }}>Criar a primeira</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const thStyle: React.CSSProperties = { padding: "12px 20px", textAlign: "left", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)" }
const tdStyle: React.CSSProperties = { padding: "16px 20px", fontSize: 14, verticalAlign: "top" }
const iconBtnStyle: React.CSSProperties = { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, border: "1px solid var(--line)", borderRadius: 8, color: "var(--ink)", textDecoration: "none" }
