create table discounts (
  public_id uuid default uuid_generate_v4() primary key,
  created_at timestamp default now(),
  type text not null,
  value integer not null,
  valid_to timestamp default now(),
  valid_from timestamp default now(),
  shop uuid references shops (public_id),
  code text not null,
  id bigint not null
);