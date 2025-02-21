-- Create auth schema if it doesn't exist (to mimic Supabase auth)
CREATE SCHEMA IF NOT EXISTS auth;

-- Create auth.users table (simplified version of Supabase auth.users)
CREATE TABLE IF NOT EXISTS auth.users (
  id uuid PRIMARY KEY,
  email text UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
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
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT user_profiles_user_id_key UNIQUE (user_id)
);

-- Church Data Table
CREATE TABLE IF NOT EXISTS dados_igreja (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
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
  created_at timestamptz DEFAULT now(),
  CONSTRAINT dados_igreja_user_id_key UNIQUE (user_id)
);

-- Client Status Table
CREATE TABLE IF NOT EXISTS cliente_fft (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'active',
  CONSTRAINT cliente_fft_user_id_key UNIQUE (user_id)
);

-- Create extension for UUID support if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";