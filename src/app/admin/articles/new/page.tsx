import { ArticleForm } from "../ArticleForm"

export default function NewArticlePage() {
  return (
    <div style={{ padding: "48px 56px" }}>
      <div style={{ marginBottom: 40 }}>
        <p style={{ fontFamily: "var(--sans)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)", margin: "0 0 8px" }}>Matérias</p>
        <h1 style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: 40, lineHeight: 0.95, letterSpacing: "-0.035em", margin: 0 }}>Nova matéria</h1>
      </div>
      <ArticleForm />
    </div>
  )
}
