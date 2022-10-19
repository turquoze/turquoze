create table warehouses (
  public_id uuid default uuid_generate_v4() primary key,
  created_at timestamp default now(),
  country text not null,
  address text not null,
  name text not null,
  shop uuid default uuid_generate_v4(),
  id bigint not null
);