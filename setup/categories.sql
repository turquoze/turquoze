-- categories definition

-- Drop table

-- DROP TABLE categories;

CREATE TABLE categories (
	public_id uuid NOT NULL DEFAULT uuid_generate_v4(),
	created_at timestamptz NULL DEFAULT now(),
	"name" text NOT NULL,
	parent uuid NULL,
	shop uuid NULL,
	id int8 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
	CONSTRAINT categories_pkey PRIMARY KEY (public_id)
);


-- categories foreign keys

ALTER TABLE categories ADD CONSTRAINT categories_parent_fkey FOREIGN KEY (parent) REFERENCES categories(public_id);
ALTER TABLE categories ADD CONSTRAINT categories_shop_fkey FOREIGN KEY (shop) REFERENCES shops(public_id);