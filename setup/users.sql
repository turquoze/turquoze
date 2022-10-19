create table users (
  id bigint not null,
  created_at timestamp default now(),
  public_id uuid default uuid_generate_v4() primary key,
  name text,
  email text not null,
  not_active boolean not null,
  shop uuid references shops (public_id),
  "password" character not null
);