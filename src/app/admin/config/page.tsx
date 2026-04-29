import { createClient } from "@/utils/supabase/server"
import { ConfigEditor } from "./ConfigEditor"

export default async function ConfigPage() {
  const supabase = await createClient()
  const { data: configs } = await supabase.from("page_config").select("*")

  const byKey = Object.fromEntries((configs ?? []).map(c => [c.key, c.value]))

  return (
    <div style={{ padding: "48px 56px" }}>
      <div style={{ marginBottom: 40 }}>
        <p style={{ fontFamily: "var(--sans)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)", margin: "0 0 8px" }}>Configuração</p>
        <h1 style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: 40, lineHeight: 0.95, letterSpacing: "-0.035em", margin: 0 }}>Textos da Home</h1>
        <p style={{ marginTop: 12, color: "var(--muted)", fontSize: 14 }}>Edite os textos das seções da página inicial.</p>
      </div>
      <ConfigEditor configs={byKey} />
    </div>
  )
}
