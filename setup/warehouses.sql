CREATE TABLE IF NOT EXISTS warehouses (
  id int NOT NULL,
  public_id uuid NOT NULL UNIQUE,
  created_at timestamp,
  country varchar(255) NOT NULL,
  address varchar(255) NOT NULL,
  name varchar(255) NOT NULL,
  shop int,
  PRIMARY KEY (id)
)

// setup FK shop
// setup public_id to uuid