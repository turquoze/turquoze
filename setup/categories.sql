CREATE TABLE IF NOT EXISTS categories (
  id int NOT NULL,
  public_id uuid NOT NULL UNIQUE,
  created_at timestamp,
  name varchar(255) NOT NULL,
  parent int,
  shop int,
  PRIMARY KEY (id)
)

// setup FK shop, parent
// setup public_id to uuid