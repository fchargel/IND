import Link from "next/link"
import { LogoMark } from "./Logo"

export function SiteFooter() {
  return (
    <>
      <div className="megamark" aria-hidden="true">
        <svg viewBox="0 0 1366 480">
          <text x="50%" y="62%" textAnchor="middle" fontFamily="Aloevera Display" fontWeight="900" fontSize="320" letterSpacing="-16" fill="currentColor">Novos Destinos</text>
        </svg>
      </div>
      <footer id="contato">
        <div className="container">
          <div className="foot-grid">
            <div className="foot-brand">
              <div className="mark">
                <LogoMark />
                <span style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: 22, lineHeight: 1.05, letterSpacing: "-0.015em" }}>
                  Instituto<br/><em style={{ fontWeight: 400 }}>Novos Destinos</em>
                </span>
              </div>
              <p>Organização da sociedade civil sem fins lucrativos. Promovemos projetos esportivos, educacionais, sociais e culturais.</p>
            </div>
            <div>
              <h4>Site</h4>
              <ul>
                <li><Link href="#sobre">Institucional</Link></li>
                <li><Link href="#projetos">Projetos</Link></li>
                <li><Link href="#transparencia">Transparência</Link></li>
                <li><Link href="#diretoria">Diretoria</Link></li>
              </ul>
            </div>
            <div>
              <h4>Participe</h4>
              <ul>
                <li><a href="https://forms.gle/G8fCCccJtESRCivQ8" target="_blank" rel="noopener">Fotografia esportiva</a></li>
                <li><a href="https://forms.gle/sj1y9GEjWJzapyob8" target="_blank" rel="noopener">Oficina storymaker</a></li>
                <li><Link href="#noticias">Notícias</Link></li>
              </ul>
            </div>
            <div>
              <h4>Contato</h4>
              <ul>
                <li><a href="mailto:contato@institutonovosdestinos.org">contato@institutonovosdestinos.org</a></li>
                <li><span>Maceió — Alagoas</span></li>
                <li><a href="#">Instagram</a></li>
                <li><a href="#">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="foot-bottom">
            <span>© {new Date().getFullYear()} Instituto Novos Destinos · OSC sem fins lucrativos</span>
            <span>CNPJ 37.536.192/0001-65 · Política de privacidade</span>
          </div>
        </div>
      </footer>
    </>
  )
}
