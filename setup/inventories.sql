create table inventories (
  public_id uuid default uuid_generate_v4() primary key,
  created_at timestamp default now(),
  warehouse uuid references warehouses (public_id),
  product uuid references products (public_id),
  quantity integer not null,
  id bigint not null
);