"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { LogoMark } from "@/components/Logo"
import { LayoutDashboard, FileText, ImageIcon, Settings, Folder, LogOut, ExternalLink } from "lucide-react"

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/articles", label: "Matérias", icon: FileText },
  { href: "/admin/projects", label: "Projetos", icon: Folder },
  { href: "/admin/hero", label: "Hero / Carrossel", icon: ImageIcon },
  { href: "/admin/config", label: "Textos da Home", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside style={{
      width: 240,
      background: "var(--ink)",
      color: "var(--paper)",
      display: "flex",
      flexDirection: "column",
      padding: "24px 0",
      flexShrink: 0,
      position: "sticky",
      top: 0,
      height: "100vh",
    }}>
      {/* logo */}
      <div style={{ padding: "0 20px 28px", borderBottom: "1px solid rgba(244,241,234,0.1)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--paper)" }}>
          <LogoMark style={{ height: 32 }} />
          <span style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: 12, letterSpacing: "-0.01em", textTransform: "uppercase", paddingLeft: 10, borderLeft: "1px solid rgba(244,241,234,0.2)", lineHeight: 1.1 }}>
            Instituto<br/>Novos<br/>Destinos
          </span>
        </Link>
      </div>

      {/* nav */}
      <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact)
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: active ? 600 : 400,
                color: active ? "var(--ink)" : "rgba(244,241,234,0.65)",
                background: active ? "var(--paper)" : "transparent",
                transition: "all .15s",
                textDecoration: "none",
              }}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* bottom */}
      <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(244,241,234,0.1)", display: "flex", flexDirection: "column", gap: 2 }}>
        <a
          href="/"
          target="_blank"
          style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, fontSize: 13, color: "rgba(244,241,234,0.55)", textDecoration: "none" }}
        >
          <ExternalLink size={15} /> Ver site
        </a>
        <button
          onClick={handleLogout}
          style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, fontSize: 13, color: "rgba(244,241,234,0.55)", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
        >
          <LogOut size={15} /> Sair
        </button>
      </div>
    </aside>
  )
}
