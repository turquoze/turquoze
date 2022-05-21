CREATE TABLE IF NOT EXISTS shops (
  id int NOT NULL,
  public_id uuid NOT NULL UNIQUE,
  created_at timestamp,
  active boolean NOT NULL,
  regions array NOT NULL,
  currency varchar(50),
  name varchar(255),
  PRIMARY KEY (id)
)

// setup FK shop, price, parent
// setup public_id to uuid