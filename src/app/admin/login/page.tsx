"use client"
import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { LogoMark } from "@/components/Logo"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError("E-mail ou senha incorretos.")
      setLoading(false)
      return
    }
    router.push("/admin")
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 48, color: "var(--paper)" }}>
          <LogoMark style={{ height: 36 }} />
          <span style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: 13, letterSpacing: "-0.01em", textTransform: "uppercase", paddingLeft: 12, borderLeft: "1px solid rgba(244,241,234,0.2)" }}>
            Admin
          </span>
        </div>
        <h1 style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: 40, lineHeight: 0.95, letterSpacing: "-0.035em", color: "var(--paper)", margin: "0 0 32px" }}>
          Entrar no<br/>painel
        </h1>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(244,241,234,0.55)", marginBottom: 8 }}>
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: "100%", background: "rgba(244,241,234,0.08)", border: "1px solid rgba(244,241,234,0.15)", borderRadius: 8, padding: "14px 16px", color: "var(--paper)", fontSize: 15, outline: "none" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(244,241,234,0.55)", marginBottom: 8 }}>
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ width: "100%", background: "rgba(244,241,234,0.08)", border: "1px solid rgba(244,241,234,0.15)", borderRadius: 8, padding: "14px 16px", color: "var(--paper)", fontSize: 15, outline: "none" }}
            />
          </div>
          {error && <p style={{ color: "#ff6b6b", fontSize: 13, margin: 0 }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{ marginTop: 8, background: "var(--paper)", color: "var(--ink)", border: "none", borderRadius: 999, padding: "16px 24px", fontFamily: "var(--sans)", fontWeight: 600, fontSize: 14, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  )
}
