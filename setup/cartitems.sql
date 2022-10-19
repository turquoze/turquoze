create table cartitems (
  id bigint not null primary key,
  created_at timestamp default now(),
  cart_id uuid references carts (public_id),
  product_id uuid references products (public_id),
  quantity integer not null,
  price integer not null
);