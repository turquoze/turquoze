create table categories (
  public_id uuid default uuid_generate_v4() primary key,
  created_at timestamp default now(),
  name text not null,
  parent uuid references categories (public_id),
  shop uuid references shops (public_id),
  id bigint not null
);