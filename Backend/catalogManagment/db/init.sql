CREATE TABLE services (
  service_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL,
  description TEXT,
  category VARCHAR(100),
  pricing_model TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
