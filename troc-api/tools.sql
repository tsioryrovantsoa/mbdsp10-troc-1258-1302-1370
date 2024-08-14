ALTER TABLE blacklisted_tokens
ALTER COLUMN token TYPE VARCHAR(1024);

ALTER TABLE images DROP CONSTRAINT fk5yu3ybwgjqqj4s78xyfbr01yu;

ALTER TABLE images
ADD CONSTRAINT fk5yu3ybwgjqqj4s78xyfbr01yu FOREIGN KEY (item_id)
REFERENCES items(item_id) ON DELETE CASCADE;

ALTER TABLE exchange_items DROP CONSTRAINT fkfxnfbhlqbcey2xs30sf04k3y8;

ALTER TABLE exchange_items
ADD CONSTRAINT fkfxnfbhlqbcey2xs30sf04k3y8 FOREIGN KEY (item_id)
REFERENCES items(item_id) ON DELETE CASCADE;

ALTER TABLE exchange_items DROP CONSTRAINT fk596su1em93io83flxf4v6iokp;

ALTER TABLE exchange_items
ADD CONSTRAINT fk596su1em93io83flxf4v6iokp FOREIGN KEY (exchange_id)
REFERENCES exchanges(exchange_id) ON DELETE CASCADE;
