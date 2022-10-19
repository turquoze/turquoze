create table orders (
  public_id uuid default uuid_generate_v4() primary key,
  created_at timestamp default now(),
  payment_status text not null,
  products json,
  shop uuid references shops (public_id),
  id bigint not null,
  price_total integer
);