-- making a separate sql file because bounties weren't getting updated for some reason
-- Populate bounty_numeric with clean numeric values
UPDATE characters 
SET bounty_numeric = CAST(regexp_replace(bounty, '[^0-9]', '', 'g') AS BIGINT)
WHERE bounty ~ '\d';

-- Verify the update worked
SELECT COUNT(*) as characters_with_numeric_bounty FROM characters WHERE bounty_numeric IS NOT NULL;