CREATE TABLE IF NOT EXISTS categorieslink (
  id int NOT NULL,
  category int NOT NULL,
  product int NOT NULL,
  PRIMARY KEY (id)
)

// setup FK shop, price, parent
// setup public_id to uuid