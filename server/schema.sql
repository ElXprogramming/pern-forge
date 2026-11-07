-- ========================================================
-- PERN Forge: Database Schema (PostgreSQL)
-- ========================================================

-- 1. Create database (run separately if not existing)
-- CREATE DATABASE perndb;

-- 2. Enable UUID extension for robust distributed primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. Users Table (Authentication & User Profiles)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Projects Table (Relational Entity with Foreign Key & JSONB)
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(120) NOT NULL,
  description TEXT,
  stack_tags TEXT[] DEFAULT ARRAY['PostgreSQL', 'Express', 'React', 'Node.js'],
  metadata JSONB DEFAULT '{}'::jsonb,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Indexes for optimal query performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_metadata_gin ON projects USING GIN(metadata);

-- 6. Insert initial seed data for immediate testing
INSERT INTO projects (title, description, is_published, metadata)
VALUES 
  ('PERN Learning Webapp', 'An interactive educational portal for mastering the PERN stack.', true, '{"level": "Beginner to Advanced", "category": "Education"}'),
  ('Inventory Management API', 'High throughput inventory system using PostgreSQL ACID transactions.', true, '{"level": "Intermediate", "category": "Backend"}')
ON CONFLICT DO NOTHING;
