CREATE TABLE IF NOT EXISTS reviews (
  review_id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  service_id UUID NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comments TEXT,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
