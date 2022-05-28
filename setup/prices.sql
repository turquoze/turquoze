-- prices definition

-- Drop table

-- DROP TABLE prices;

CREATE TABLE prices (
	public_id uuid NOT NULL DEFAULT uuid_generate_v4(),
	created_at timestamptz NULL DEFAULT now(),
	amount int4 NOT NULL DEFAULT 0,
	shop uuid NULL,
	product uuid NOT NULL,
	id int8 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
	CONSTRAINT prices_pkey PRIMARY KEY (public_id)
);


-- prices foreign keys

ALTER TABLE prices ADD CONSTRAINT prices_product_fkey FOREIGN KEY (product) REFERENCES products(public_id);
ALTER TABLE prices ADD CONSTRAINT prices_shop_fkey FOREIGN KEY (shop) REFERENCES shops(public_id);