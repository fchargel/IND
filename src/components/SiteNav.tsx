"use client"
import Link from "next/link"
import { LogoMark } from "./Logo"

export function SiteNav() {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link href="/" className="logo-wordmark" aria-label="Instituto Novos Destinos">
          <LogoMark />
          <span className="name">Instituto<br/>Novos<br/>Destinos</span>
        </Link>
        <nav className="nav-links" aria-label="Principal">
          <Link href="/" className="active">Home</Link>
          <Link href="#sobre">Institucional</Link>
          <Link href="#projetos">Projetos</Link>
          <Link href="#noticias">Notícias</Link>
          <Link href="#contato">Contato</Link>
        </nav>
        <Link href="#inscricoes" className="nav-cta">Inscreva-se</Link>
        <button className="nav-burger" aria-label="Menu">
          <span/><span/><span/>
        </button>
      </div>
    </header>
  )
}
