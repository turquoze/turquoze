-- discounts definition

-- Drop table

-- DROP TABLE discounts;

CREATE TABLE discounts (
	public_id uuid NOT NULL DEFAULT uuid_generate_v4(),
	created_at timestamptz NULL DEFAULT now(),
	"type" text NOT NULL,
	value int4 NOT NULL,
	valid_to timestamp NULL,
	valid_from timestamp NULL,
	shop uuid NOT NULL,
	code text NOT NULL,
	id int8 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
	CONSTRAINT discounts_code_key UNIQUE (code),
	CONSTRAINT discounts_pkey PRIMARY KEY (public_id)
);


-- discounts foreign keys

ALTER TABLE discounts ADD CONSTRAINT discounts_shop_fkey FOREIGN KEY (shop) REFERENCES shops(public_id);