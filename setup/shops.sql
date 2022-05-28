-- shops definition

-- Drop table

-- DROP TABLE shops;

CREATE TABLE shops (
	public_id uuid NOT NULL DEFAULT uuid_generate_v4(),
	created_at timestamptz NULL DEFAULT now(),
	regions _text NULL,
	currency text NULL,
	"name" text NULL,
	id int8 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
	CONSTRAINT regions_pkey PRIMARY KEY (public_id)
);