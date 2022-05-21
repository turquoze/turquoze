CREATE TABLE IF NOT EXISTS orders (
  id int NOT NULL,
  public_id uuid NOT NULL UNIQUE,
  created_at timestamp,
  payment varchar NOT NULL,
  price varchar NOT NULL,
  products varchar NOT NULL,
  shop int,
  PRIMARY KEY (id)
)

// setup FK shop
// setup public_id to uuid