-- Enable UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table users
CREATE TABLE users (
    uid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_worker BOOLEAN,
    is_new BOOLEAN,
    average_rating FLOAT
);

-- Table jobs
CREATE TABLE jobs (
    uid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_uid UUID NOT NULL REFERENCES users(uid),
    dooer_uid UUID REFERENCES users(uid),
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    scheduled_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table review
CREATE TABLE review (
    uid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_uid UUID NOT NULL REFERENCES jobs(uid), -- Link to the job being reviewed
    reviewer_uid UUID NOT NULL REFERENCES users(uid), -- Who wrote the review
    reviewed_uid UUID NOT NULL REFERENCES users(uid), -- Who is being reviewed
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5), -- Rating from 1 to 5
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table posts
CREATE TABLE posts (
    uid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255),
    body TEXT,
    owner_uid UUID REFERENCES users(uid),
    latitude FLOAT,
    longitude FLOAT,
    cost FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Table payments
CREATE TABLE IF NOT EXISTS payments (
    transaction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES jobs(uid),
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'processed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);