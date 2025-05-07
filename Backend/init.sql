-- Habilita generación de UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla users
CREATE TABLE IF NOT EXISTS users (
    uid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(16) NOT NULL DEFAULT 'member',            -- 'member', 'admin', 'moderator'
    "twofaEnable" BOOLEAN NOT NULL DEFAULT FALSE,
    "twofaSecret" VARCHAR(255),
    "identityVerificationStatus" VARCHAR(50) NOT NULL DEFAULT 'Not verified',
    description TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_worker BOOLEAN,
    is_new BOOLEAN,
    average_rating REAL
);

-- Dispara trigger para mantener updated_at
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_timestamp ON users;
CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Tabla jobs
CREATE TABLE IF NOT EXISTS jobs (
    uid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_uid UUID NOT NULL REFERENCES users(uid) ON DELETE CASCADE,
    dooer_uid UUID REFERENCES users(uid) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    scheduled_time TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

DROP TRIGGER IF EXISTS set_timestamp_jobs ON jobs;
CREATE TRIGGER set_timestamp_jobs
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Tabla review
CREATE TABLE IF NOT EXISTS review (
    uid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_uid UUID NOT NULL REFERENCES jobs(uid) ON DELETE CASCADE,
    reviewer_uid UUID NOT NULL REFERENCES users(uid) ON DELETE CASCADE,
    reviewed_uid UUID NOT NULL REFERENCES users(uid) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

DROP TRIGGER IF EXISTS set_timestamp_review ON review;
CREATE TRIGGER set_timestamp_review
  BEFORE UPDATE ON review
  FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Tabla posts
CREATE TABLE IF NOT EXISTS posts (
    uid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255),
    body TEXT,
    owner_uid UUID REFERENCES users(uid) ON DELETE SET NULL,
    latitude REAL,
    longitude REAL,
    cost REAL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

DROP TRIGGER IF EXISTS set_timestamp_posts ON posts;
CREATE TRIGGER set_timestamp_posts
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Tabla payments
CREATE TABLE IF NOT EXISTS payments (
    transaction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES jobs(uid) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'processed',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

DROP TRIGGER IF EXISTS set_timestamp_payments ON payments;
CREATE TRIGGER set_timestamp_payments
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Tabla de mensajes para chat
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL
    REFERENCES users(uid)
    ON DELETE CASCADE,
  receiver_id UUID NOT NULL
    REFERENCES users(uid)
    ON DELETE CASCADE,
  body TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_messages_sender       ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver     ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at   ON messages(created_at);