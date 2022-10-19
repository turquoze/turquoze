create table products (
  public_id uuid default uuid_generate_v4() primary key,
  created_at timestamp default now() not null,
  active boolean not null,
  parent uuid references products (public_id),
  title text not null,
  short_description text not null,
  images ARRAY,
  price numeric not null,
  shop uuid references shops (public_id),
  long_description character,
  id bigint not null,
  slug character not null
);