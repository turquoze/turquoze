create table shops (
  public_id uuid default uuid_generate_v4() primary key,
  created_at timestamp default now(),
  regions ARRAY,
  currency text,
  name text,
  id bigint not null,
  payment_id character,
  url character,
  search_index character,
  secret text not null
);