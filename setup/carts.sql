create table carts (
  public_id uuid default uuid_generate_v4() primary key,
  created_at timestamp default now(),
  id bigint not null,
  metadata json,
  shipping json,
  billing json,
  coupon character,
  giftcard character
);