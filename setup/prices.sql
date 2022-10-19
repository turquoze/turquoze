create table prices (
  public_id uuid default uuid_generate_v4() primary key,
  created_at timestamp default now(),
  amount integer not null,
  shop uuid references shops (public_id),
  product uuid references products (public_id),
  id bigint not null
);