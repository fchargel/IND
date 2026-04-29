import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import { FileText, Folder, ImageIcon, Settings, ArrowRight } from "lucide-react"

export default async function AdminDashboard() {
  const supabase = await createClient()
  const [{ count: articleCount }, { count: projectCount }] = await Promise.all([
    supabase.from("articles").select("*", { count: "exact", head: true }),
    supabase.from("projects").select("*", { count: "exact", head: true }),
  ])

  const cards = [
    { href: "/admin/articles", icon: FileText, title: "Matérias", desc: `${articleCount ?? 0} matérias cadastradas`, color: "#e8f5e9" },
    { href: "/admin/projects", icon: Folder, title: "Projetos", desc: `${projectCount ?? 0} projetos ativos`, color: "#e3f2fd" },
    { href: "/admin/hero", icon: ImageIcon, title: "Hero / Carrossel", desc: "Fotos e destaques da capa", color: "#fff3e0" },
    { href: "/admin/config", icon: Settings, title: "Textos da Home", desc: "Missão, inscrições, institucional", color: "#f3e5f5" },
  ]

  return (
    <div style={{ padding: "48px 56px", maxWidth: 900 }}>
      <div style={{ marginBottom: 48 }}>
        <p style={{ fontFamily: "var(--sans)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)", margin: "0 0 12px" }}>
          Painel de controle
        </p>
        <h1 style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: 48, lineHeight: 0.95, letterSpacing: "-0.035em", margin: 0 }}>
          Bom dia,<br/>admin.
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {cards.map(({ href, icon: Icon, title, desc, color }) => (
          <Link
            key={href}
            href={href}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              padding: 28,
              background: "white",
              border: "1px solid var(--line)",
              borderRadius: 12,
              textDecoration: "none",
              color: "var(--ink)",
              transition: "box-shadow .2s, transform .2s",
            }}
            className="admin-card"
          >
            <div style={{ width: 44, height: 44, background: color, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon size={20} />
            </div>
            <div>
              <div style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: 20, letterSpacing: "-0.02em" }}>{title}</div>
              <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>{desc}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, marginTop: "auto" }}>
              Gerenciar <ArrowRight size={13} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
