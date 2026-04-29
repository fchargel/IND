import { createClient } from "@/utils/supabase/server"
import { ProjectsEditor } from "./ProjectsEditor"

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("display_order")

  return (
    <div style={{ padding: "48px 56px" }}>
      <div style={{ marginBottom: 40 }}>
        <p style={{ fontFamily: "var(--sans)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)", margin: "0 0 8px" }}>Conteúdo</p>
        <h1 style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: 40, lineHeight: 0.95, letterSpacing: "-0.035em", margin: 0 }}>Projetos</h1>
        <p style={{ marginTop: 12, color: "var(--muted)", fontSize: 14 }}>Gerencie os cards de projetos exibidos na home.</p>
      </div>
      <ProjectsEditor projects={projects ?? []} />
    </div>
  )
}
