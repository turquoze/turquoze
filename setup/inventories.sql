CREATE TABLE IF NOT EXISTS inventories (
  id int NOT NULL,
  public_id uuid NOT NULL UNIQUE,
  created_at timestamp,
  warehouse int,
  product int,
  quantity int,
  PRIMARY KEY (id)
)

// setup FK warehouse, product
// setup public_id to uuid