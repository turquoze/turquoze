CREATE TABLE IF NOT EXISTS prices (
  id int NOT NULL,
  public_id uuid NOT NULL UNIQUE,
  created_at timestamp,
  amount double NOT NULL,
  active boolean,
  product int,
  shop int,
  PRIMARY KEY (id)
)

// setup FK shop, product
// setup public_id to uuid