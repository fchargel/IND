import { createClient } from "@/utils/supabase/server"
import { SiteNav } from "@/components/SiteNav"
import { SiteFooter } from "@/components/SiteFooter"
import type { Article, Project } from "@/utils/supabase/types"

const ArrowRight = () => (
  <svg className="arr" width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ExtArrow = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M2 8L8 2M8 2H3.5M8 2v4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
)

function formatDate(dateStr: string | null) {
  if (!dateStr) return ""
  return new Date(dateStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()
}

export default async function HomePage() {
  let heroConfig = null, institutionalConfig = null, signupConfig = null
  let projects: Project[] = [], articles: Article[] = []

  try {
    const supabase = await createClient()
    const [h, i, s, p, a] = await Promise.all([
      supabase.from("page_config").select("value").eq("key", "hero").single(),
      supabase.from("page_config").select("value").eq("key", "institutional").single(),
      supabase.from("page_config").select("value").eq("key", "signup").single(),
      supabase.from("projects").select("*").eq("active", true).order("display_order"),
      supabase.from("articles").select("*").eq("published", true).order("published_at", { ascending: false }).limit(9),
    ])
    heroConfig = h.data; institutionalConfig = i.data; signupConfig = s.data
    projects = (p.data as Project[]) ?? []; articles = (a.data as Article[]) ?? []
  } catch {
    // Supabase unavailable — render with static fallbacks
  }

  const hero = ((heroConfig as {value?: Record<string, unknown>})?.value ?? {}) as Record<string, unknown>
  const institutional = ((institutionalConfig as {value?: Record<string, unknown>})?.value ?? {}) as Record<string, unknown>
  const signup = ((signupConfig as {value?: Record<string, unknown>})?.value ?? {}) as Record<string, unknown>

  const heroHeadline = (hero.headline as string) ?? "Reescrever o futuro <em>com</em><br/>quem mais precisa."
  const heroMission = (hero.mission as string) ?? "O Instituto Novos Destinos é uma organização sem fins lucrativos que promove projetos esportivos, educacionais, sociais e culturais — para ajudar pessoas a mudarem suas histórias e encontrarem novas oportunidades."
  const heroStats = (hero.stats as Array<{ num: string; lbl: string }>) ?? [{ num: "4", lbl: "Áreas de atuação" }, { num: "2020", lbl: "Ano de fundação" }]

  const institutionalBody = (institutional.body as string) ?? "Somos uma organização da sociedade civil sem fins lucrativos. <span class=\"hl\">Nossa missão é oportunizar, com dignidade e propósito,</span> novos caminhos para pessoas em situação de vulnerabilidade."
  const institutionalMeta = (institutional.meta as Record<string, string>) ?? { "Natureza": "OSC sem fins lucrativos", "Fundação": "2020", "Atuação": "Educacional · Esportiva · Cultural · Social" }

  const signupHeadline = (signup.headline as string) ?? "Quer fazer<br/>parte?"
  const signupItems = (signup.items as Array<{ title: string; description: string; url: string }>) ?? [
    { title: "Oficina de fotografia esportiva", description: "Inscrições abertas · forms.gle", url: "https://forms.gle/G8fCCccJtESRCivQ8" },
    { title: "Oficina de storymaker", description: "Inscrições abertas · forms.gle", url: "https://forms.gle/sj1y9GEjWJzapyob8" },
  ]

  return (
    <>
      <SiteNav />

      {/* HERO */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="row-eyebrow">
              <span className="eyebrow">Organização da Sociedade Civil · 2020</span>
              <span className="line"></span>
            </div>
            <h1 className="display" dangerouslySetInnerHTML={{ __html: heroHeadline }} />
          </div>
          <aside className="hero-meta">
            <p className="hero-mission">{heroMission}</p>
            <div className="hero-cta-row">
              <a className="btn btn-primary" href="#inscricoes">
                Inscreva-se nos projetos <ArrowRight />
              </a>
              <a className="btn btn-ghost" href="#projetos">Conheça os projetos</a>
            </div>
            {heroStats.length > 0 && (
              <div className="hero-stats">
                {heroStats.map((stat, i) => (
                  <div className="hero-stat" key={i}>
                    <div className="num">{stat.num}</div>
                    <div className="lbl">{stat.lbl}</div>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </div>
      </section>

      {/* INSTITUCIONAL */}
      <section className="section" id="sobre">
        <div className="container">
          <div className="section-head">
            <div className="label">
              <span className="num-tag">01</span>
              <span className="eyebrow">Institucional</span>
            </div>
            <h2>Quem somos.</h2>
            <div className="right">Acreditamos no poder transformador do esporte, da cultura e da educação.</div>
          </div>
          <div className="about-grid">
            <p dangerouslySetInnerHTML={{ __html: institutionalBody }} />
            <dl className="about-side">
              {Object.entries(institutionalMeta).map(([key, val]) => (
                <div className="row" key={key}>
                  <dt>{key.charAt(0).toUpperCase() + key.slice(1)}</dt>
                  <dd>{val}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* FIELD STRIP */}
      <section className="field-strip" aria-label="Imagens do nosso trabalho em campo">
        <div className="field-strip-inner">
          <figure className="fs fs-tall">
            <img src="/assets/futuro-hero.jpg" alt="Atleta em jogo na Arena Serraria" loading="lazy"/>
            <figcaption>Arena</figcaption>
          </figure>
          <figure className="fs fs-wide">
            <img src="/assets/futuro-group.jpg" alt="Equipe e jovens reunidos em campo" loading="lazy"/>
            <figcaption>Encontro · 2025</figcaption>
          </figure>
          <figure className="fs fs-tall fs-tall-2">
            <img src="/assets/futuro-laugh.jpg" alt="Jovens correndo em quadra" loading="lazy"/>
            <figcaption>Movimento</figcaption>
          </figure>
          <figure className="fs fs-square">
            <img src="/assets/atletas-mic.jpg" alt="Crianças escutando palestra" loading="lazy"/>
            <figcaption>Atletas pelo Bem</figcaption>
          </figure>
        </div>
        <div className="container field-strip-foot">
          <p className="fs-eyebrow">Em campo, em 2025</p>
          <p className="fs-quote">
            <em>&ldquo;Quando um atleta profissional senta na grama com a gente,</em> deixa de ser sonho distante <em>e vira possibilidade.&rdquo;</em>
          </p>
        </div>
      </section>

      {/* PROJETOS */}
      <section className="section" id="projetos" style={{ paddingBottom: 0 }}>
        <div className="container">
          <div className="section-head">
            <div className="label">
              <span className="num-tag">02</span>
              <span className="eyebrow">Projetos</span>
            </div>
            <h2>O que fazemos<br/>na prática.</h2>
            <div className="right">Iniciativas executadas em parceria com a comunidade e atletas.</div>
          </div>
        </div>
        <div className="container">
          <div className="projects">
            {projects.map((proj, i) => (
              <article className="project" key={proj.id}>
                <div className="project-img">
                  {proj.image_url && (
                    <img
                      src={proj.image_url.startsWith("http") ? proj.image_url : `/assets/${proj.image_url.replace(/^assets\//, "")}`}
                      alt={proj.title}
                      loading="lazy"
                    />
                  )}
                  <span className="img-tag">{proj.title}</span>
                </div>
                <div className="project-meta">
                  <span className="status"><span className="dot"></span>Executado</span>
                  <span className="project-num">0{i + 1} / 0{projects?.length}</span>
                </div>
                <h3>{proj.title}</h3>
                {proj.description && (
                  <p style={{ fontFamily: "var(--serif)", fontSize: 15, lineHeight: 1.5, margin: 0, color: "var(--muted)" }}>
                    {proj.description}
                  </p>
                )}
                <div className="project-foot">
                  <span>Maceió · 2025</span>
                  <a className="read" href={proj.form_url ?? "#"} target={proj.form_url ? "_blank" : undefined} rel="noopener">
                    {proj.form_url ? "Inscrever-se" : "Ver projeto"}{" "}
                    <svg className="arr" width="12" height="12" viewBox="0 0 12 12">
                      <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div style={{ height: "clamp(56px, 8vw, 110px)" }}></div>
      </section>

      {/* NOTÍCIAS */}
      <section className="section" id="noticias">
        <div className="container">
          <div className="section-head">
            <div className="label">
              <span className="num-tag">03</span>
              <span className="eyebrow">Na imprensa</span>
            </div>
            <h2>O que dizem<br/>sobre nós.</h2>
            <div className="right">Cobertura jornalística dos nossos projetos.</div>
          </div>
          <div className="news">
            {articles.map((art) => (
              <a key={art.id} className="news-card" href={art.content ?? "#"} target="_blank" rel="noopener">
                <div className="news-pub">
                  <small>Veículo</small>
                  {art.publisher}
                </div>
                <p className="news-title">{art.title}</p>
                <div className="news-foot">
                  <span>{formatDate(art.published_at)}</span>
                  <span className="ext-arrow"><ExtArrow /></span>
                </div>
              </a>
            ))}
          </div>
          <div className="news-more">
            <a className="btn btn-ghost" href="#">Ver todas as matérias <ArrowRight /></a>
          </div>
        </div>
      </section>

      {/* INSCRIÇÕES */}
      <section className="signup" id="inscricoes">
        <div className="container signup-inner">
          <div className="head">
            <span className="eyebrow">04 — Lista de Interesse</span>
            <h2 dangerouslySetInnerHTML={{ __html: signupHeadline }} />
            <p>
              Está interessado em participar de algum dos nossos projetos?
              Dá uma olhada nas opções e se inscreve na lista de interesse —
              avisamos você assim que abrirem novas turmas.
            </p>
          </div>
          <ul className="signup-list">
            {signupItems.map((item, i) => (
              <li key={i}>
                <a className="signup-item" href={item.url} target="_blank" rel="noopener">
                  <div>
                    <div className="ttl">{item.title}</div>
                    <div className="sub">{item.description}</div>
                  </div>
                  <span className="go">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 13L13 3M13 3H6M13 3v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <SiteFooter />
    </>
  )
}
