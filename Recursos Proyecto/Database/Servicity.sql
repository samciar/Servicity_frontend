-- Users Table (for both clients and taskers)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP WITH TIME ZONE NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) UNIQUE NULL,
    address TEXT NULL,
    latitude NUMERIC(10, 8) NULL,  -- For geolocation (e.g., Google Maps API)
    longitude NUMERIC(11, 8) NULL, -- For geolocation
    user_type VARCHAR(20) NOT NULL DEFAULT 'client' CHECK (user_type IN ('client', 'tasker', 'admin')), -- 'client', 'tasker', 'admin'
    profile_picture_url TEXT NULL,
    bio TEXT NULL,
    -- For taskers specifically
    hourly_rate NUMERIC(8, 2) NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    id_verified BOOLEAN NOT NULL DEFAULT FALSE, -- For background checks
    -- Standard Laravel timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table (e.g., "Cleaning", "Handyman", "Moving")
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NULL,
    icon_url TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Skills Table (specific skills within categories, e.g., "Deep Cleaning", "Plumbing Repair")
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tasker_Skills Table (Many-to-Many relationship between taskers and skills)
CREATE TABLE tasker_skills (
    id SERIAL PRIMARY KEY,
    tasker_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    proficiency_level VARCHAR(50) NULL, -- e.g., 'Beginner', 'Intermediate', 'Expert'
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (tasker_id, skill_id) -- A tasker can only have a specific skill once
);

-- Tasks Table (posted by clients)
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT, -- Prevent deleting categories with active tasks
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    budget_type VARCHAR(50) NOT NULL CHECK (budget_type IN ('fixed', 'hourly')), -- 'fixed', 'hourly'
    budget_amount NUMERIC(12, 2) NULL, -- For fixed tasks or hourly rate for client's offer
    location TEXT NULL,
    latitude NUMERIC(10, 8) NULL,
    longitude NUMERIC(11, 8) NULL,
    preferred_date DATE NULL,
    preferred_time TIME NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'in_progress', 'completed', 'canceled', 'disputed')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deadline_at TIMESTAMP WITH TIME ZONE NULL
);

-- Bids Table (taskers bidding on tasks)
CREATE TABLE bids (
    id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    tasker_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bid_amount NUMERIC(12, 2) NOT NULL,
    message TEXT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (task_id, tasker_id) -- A tasker can only bid once per task
);

-- Bookings Table (when a task is assigned to a tasker)
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    tasker_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    client_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Redundant but useful for quick lookups
    agreed_price NUMERIC(12, 2) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NULL,
    end_time TIMESTAMP WITH TIME ZONE NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'canceled', 'disputed')),
    payment_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Payments Table
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    payer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Client
    payee_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Tasker
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    transaction_id VARCHAR(255) UNIQUE NULL, -- From payment gateway
    payment_method VARCHAR(50) NULL, -- e.g., 'credit_card', 'paypal', 'wallet'
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    processed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Reviews Table (client reviews tasker, tasker reviews client)
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    reviewer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- The person writing the review
    reviewee_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- The person being reviewed
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (booking_id, reviewer_id) -- Only one review per booking by a specific reviewer
);

-- Messages Table (for in-app chat)
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    booking_id INTEGER NULL REFERENCES bookings(id) ON DELETE SET NULL, -- Messages can be related to a booking or general
    message TEXT NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Notifications Table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- e.g., 'new_bid', 'task_accepted', 'payment_received'
    data JSONB NULL, -- Store extra notification data as JSON
    read_at TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);