-- products definition

-- Drop table

-- DROP TABLE products;

CREATE TABLE products (
	public_id uuid NOT NULL DEFAULT uuid_generate_v4(),
	created_at timestamp NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
	active bool NOT NULL DEFAULT false,
	parent uuid NULL,
	title text NOT NULL,
	short_description text NOT NULL,
	images _text NULL,
	price numeric NOT NULL,
	shop uuid NOT NULL,
	long_description varchar NULL,
	id int8 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
	slug varchar NOT NULL DEFAULT ''::character varying,
	CONSTRAINT products_pkey PRIMARY KEY (public_id),
	CONSTRAINT products_slug_key UNIQUE (slug)
);


-- products foreign keys

ALTER TABLE products ADD CONSTRAINT products_parent_fkey FOREIGN KEY (parent) REFERENCES products(public_id);
ALTER TABLE products ADD CONSTRAINT products_shop_fkey FOREIGN KEY (shop) REFERENCES shops(public_id);