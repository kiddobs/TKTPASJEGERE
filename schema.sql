create table submissions (
  id uuid primary key,
  created_at timestamptz default now(),
  nom text, postnom text, prenom text, faculte text,
  telephone text, fichier text,
  source_url text, solution_url text,
  statut text default 'en attente'
);
alter table submissions enable row level security; -- accès uniquement via la clé service
insert into storage.buckets (id, name, public) values ('pdfs', 'pdfs', true) on conflict do nothing;
