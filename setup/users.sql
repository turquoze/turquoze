CREATE TABLE IF NOT EXISTS users (
  id int NOT NULL,
  public_id uuid NOT NULL UNIQUE,
  created_at timestamp,
  name varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  not_active boolean,
  shop int,
  PRIMARY KEY (id)
)

// setup FK shop
// setup public_id to uuid