CREATE TABLE IF NOT EXISTS products (
  id int NOT NULL,
  public_id uuid NOT NULL UNIQUE,
  created_at timestamp,
  active boolean NOT NULL,
  parent int,
  title varchar(255) NOT NULL,
  short_description varchar(50),
  long_description varchar(255),
  images varchar,
  price int,
  shop int,
  PRIMARY KEY (id)
)

// setup FK shop, price, parent
// setup public_id to uuid