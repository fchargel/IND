import { createClient } from "@/utils/supabase/server"
import { HeroEditor } from "./HeroEditor"

export default async function HeroPage() {
  const supabase = await createClient()
  const { data: images } = await supabase
    .from("hero_images")
    .select("*")
    .order("display_order")

  return (
    <div style={{ padding: "48px 56px" }}>
      <div style={{ marginBottom: 40 }}>
        <p style={{ fontFamily: "var(--sans)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)", margin: "0 0 8px" }}>Visual</p>
        <h1 style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: 40, lineHeight: 0.95, letterSpacing: "-0.035em", margin: 0 }}>Hero / Carrossel</h1>
        <p style={{ marginTop: 12, color: "var(--muted)", fontSize: 14 }}>Gerencie as fotos da seção de destaque da home.</p>
      </div>
      <HeroEditor images={images ?? []} />
    </div>
  )
}
