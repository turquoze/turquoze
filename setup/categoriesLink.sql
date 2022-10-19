create table categorieslink (
  category uuid references categories (public_id) primary key,
  product uuid references products (public_id) primary key
);