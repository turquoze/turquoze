create table tokens (
  id character not null primary key,
  created_at timestamp default now(),
  shop uuid references shops (public_id),
  name character not null,
  secret character not null,
  role character not null
);
