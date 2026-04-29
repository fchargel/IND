import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { ArticleForm } from "../ArticleForm"

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: article } = await supabase.from("articles").select("*").eq("id", id).single()

  if (!article) notFound()

  return (
    <div style={{ padding: "48px 56px" }}>
      <div style={{ marginBottom: 40 }}>
        <p style={{ fontFamily: "var(--sans)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)", margin: "0 0 8px" }}>Matérias</p>
        <h1 style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: 40, lineHeight: 0.95, letterSpacing: "-0.035em", margin: 0 }}>Editar matéria</h1>
      </div>
      <ArticleForm article={article} />
    </div>
  )
}
