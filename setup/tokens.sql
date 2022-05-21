CREATE TABLE IF NOT EXISTS tokens (
  id int NOT NULL,
  public_id uuid NOT NULL UNIQUE,
  created_at timestamp,
  token varchar(255),
  name varchar(255),
  region int NOT NULL,
  expire timestamp,
  PRIMARY KEY (id)
)

// setup FK shop, price, parent
// setup public_id to uuid