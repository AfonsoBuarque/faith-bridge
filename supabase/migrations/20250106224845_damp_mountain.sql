-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create auth schema
CREATE SCHEMA IF NOT EXISTS auth;

-- Create tables
CREATE TABLE IF NOT EXISTS auth.users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    email text UNIQUE,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_profiles (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id),
    full_name text,
    birth_date date,
    gender text,
    marital_status text,
    cpf text UNIQUE,
    rg text,
    email text,
    phone text,
    mobile text,
    whatsapp text,
    street text,
    number text,
    complement text,
    neighborhood text,
    city text,
    state text,
    zip_code text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS dados_igreja (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id),
    nome_igreja text NOT NULL,
    razao_social text,
    responsavel text NOT NULL,
    quantidade_membros integer,
    telefone text,
    whatsapp text,
    email text,
    endereco_completo text NOT NULL,
    rede_social text,
    como_conheceu text,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cliente_fft (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id),
    created_at timestamptz DEFAULT now(),
    status text DEFAULT 'active'
);