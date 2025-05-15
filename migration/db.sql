CREATE TABLE IF NOT EXISTS freight_rates (
  id SERIAL PRIMARY KEY,
  shipment_id TEXT UNIQUE,
  origin_country TEXT,
  destination_country TEXT,
  shipper_name TEXT,
  agent_name TEXT,
  proof_of_delivery TEXT,
  container_20gp NUMERIC,
  container_40gp NUMERIC,
  shipment_datetime TIMESTAMP,
  version_number INTEGER NOT NULL
);
