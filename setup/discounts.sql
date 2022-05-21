CREATE TABLE IF NOT EXISTS discounts (
  id int NOT NULL,
  public_id uuid NOT NULL UNIQUE,
  created_at timestamp,
  type varchar(255) NOT NULL,
  value int NOT NULL,
  valid_to timestamp,
  valid_from timestamp,
  code varchar(255),
  shop int,
  PRIMARY KEY (id)
)

// setup FK shop
// setup public_id to uuid