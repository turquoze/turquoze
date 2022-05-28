-- categorieslink definition

-- Drop table

-- DROP TABLE categorieslink;

CREATE TABLE categorieslink (
	category uuid NOT NULL,
	product uuid NOT NULL,
	CONSTRAINT "categoriesLink_pkey" PRIMARY KEY (category, product)
);


-- categorieslink foreign keys

ALTER TABLE categorieslink ADD CONSTRAINT "categoriesLink_category_fkey" FOREIGN KEY (category) REFERENCES categories(public_id);
ALTER TABLE categorieslink ADD CONSTRAINT "categoriesLink_product_fkey" FOREIGN KEY (product) REFERENCES products(public_id);