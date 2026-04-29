-- Instituto Novos Destinos — Supabase Schema

-- =====================
-- EXTENSÕES
-- =====================
create extension if not exists "uuid-ossp";

-- =====================
-- TABELAS
-- =====================

-- Configurações da frontpage (seções editáveis)
create table page_config (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

-- Matérias / Notícias
create table articles (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  cover_url text,
  publisher text,
  published_at date,
  published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Projetos
create table projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  image_url text,
  form_url text,
  display_order int default 0,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Imagens do hero/carrossel
create table hero_images (
  id uuid primary key default uuid_generate_v4(),
  url text not null,
  alt text,
  display_order int default 0,
  active boolean default true,
  created_at timestamptz default now()
);

-- =====================
-- DADOS INICIAIS
-- =====================

-- Config da frontpage
insert into page_config (key, value) values
('hero', '{
  "headline": "Transformando vidas através do esporte e da educação.",
  "headline_emphasis": "com propósito",
  "mission": "O Instituto Novos Destinos acredita que o esporte é um caminho poderoso de transformação social — um ambiente onde jovens desenvolvem disciplina, identidade e perspectiva de futuro.",
  "stats": [
    { "num": "4", "lbl": "ÁREAS DE ATUAÇÃO" },
    { "num": "2020", "lbl": "FUNDADO EM" }
  ]
}'::jsonb),
('institutional', '{
  "headline": "Quem somos",
  "body": "O Instituto Novos Destinos (IND) é uma Organização da Sociedade Civil fundada em 2020 com sede em Recife, PE. Atua nas áreas de esporte, educação, cultura e lazer, com foco em crianças e adolescentes em situação de vulnerabilidade social.",
  "meta": {
    "nature": "Organização da Sociedade Civil (OSC)",
    "founded": "2020",
    "region": "Recife, PE — Nordeste",
    "values": "Dignidade · Pertencimento · Superação",
    "vision": "Um Brasil onde todo jovem tem acesso ao esporte como direito"
  }
}'::jsonb),
('signup', '{
  "headline": "Inscrições abertas",
  "items": [
    {
      "title": "Fotografia Esportiva",
      "description": "Para jovens de 14 a 24 anos interessados em fotografia e esporte.",
      "url": "https://forms.gle/example1"
    },
    {
      "title": "Storymaker",
      "description": "Produção de conteúdo digital para jovens de 14 a 24 anos.",
      "url": "https://forms.gle/example2"
    }
  ]
}'::jsonb);

-- Projetos iniciais
insert into projects (title, description, image_url, form_url, display_order) values
('Fotografia Esportiva', 'Jovens aprendem fotografia documental cobrindo eventos esportivos da cidade.', 'assets/atletas-talk.jpg', 'https://forms.gle/example1', 1),
('Storymaker', 'Formação em produção audiovisual e narrativa digital para jovens comunicadores.', 'assets/atleta-jovem.jpg', 'https://forms.gle/example2', 2),
('Futuro em Campo', 'Programa de desenvolvimento humano e esportivo para crianças e adolescentes.', 'assets/futuro-walk.jpg', null, 3);

-- =====================
-- STORAGE BUCKETS
-- =====================
-- Execute no dashboard do Supabase → Storage → New bucket:
-- bucket: "media" (public)

-- =====================
-- RLS POLICIES
-- =====================

alter table page_config enable row level security;
alter table articles enable row level security;
alter table projects enable row level security;
alter table hero_images enable row level security;

-- Leitura pública
create policy "public read page_config" on page_config for select using (true);
create policy "public read articles" on articles for select using (published = true);
create policy "public read projects" on projects for select using (active = true);
create policy "public read hero_images" on hero_images for select using (active = true);

-- Escrita somente para usuários autenticados (admin)
create policy "admin all page_config" on page_config for all using (auth.role() = 'authenticated');
create policy "admin all articles" on articles for all using (auth.role() = 'authenticated');
create policy "admin all projects" on projects for all using (auth.role() = 'authenticated');
create policy "admin all hero_images" on hero_images for all using (auth.role() = 'authenticated');

-- =====================
-- TRIGGER updated_at
-- =====================
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger articles_updated_at before update on articles
  for each row execute procedure update_updated_at();
create trigger projects_updated_at before update on projects
  for each row execute procedure update_updated_at();
create trigger page_config_updated_at before update on page_config
  for each row execute procedure update_updated_at();
