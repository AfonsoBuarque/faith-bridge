/*
  # Insert test data

  1. Changes
    - Creates a test user in auth.users
    - Creates a test church in dados_igreja
    - Inserts 3 test members linked to the test user and church
    - Each member has different roles and departments
*/

-- First, create a test user in auth.users
INSERT INTO auth.users (id, email)
VALUES ('d7bed83c-882f-4486-a838-4dd4b2e9fc22', 'test@example.com')
ON CONFLICT (id) DO NOTHING;

-- Create church data for the test user
INSERT INTO dados_igreja (
  user_id,
  nome_igreja,
  razao_social,
  responsavel,
  quantidade_membros,
  telefone,
  email,
  endereco_completo
) VALUES (
  'd7bed83c-882f-4486-a838-4dd4b2e9fc22',
  'Igreja Teste',
  'Igreja Teste LTDA',
  'Pastor Teste',
  100,
  '1122334455',
  'igreja@teste.com',
  'Rua Teste, 123 - Centro'
) ON CONFLICT (user_id) DO NOTHING;

-- Then insert members using the test user's ID
INSERT INTO membros (
  user_id,
  igreja_id,
  nome_completo,
  data_nascimento,
  estado_civil,
  profissao,
  email,
  telefone,
  celular,
  endereco,
  bairro,
  cidade,
  estado,
  cargo_ministerial,
  departamento,
  dizimista,
  data_conversao,
  data_batismo,
  data_membro,
  created_at
) VALUES 
-- Membro 1: Pastor
(
  'd7bed83c-882f-4486-a838-4dd4b2e9fc22',
  'd7bed83c-882f-4486-a838-4dd4b2e9fc22',
  'João Paulo Silva',
  '1975-03-15',
  'Casado(a)',
  'Pastor',
  'joao.silva@email.com',
  '1133445566',
  '11987654321',
  'Rua das Flores, 123',
  'Centro',
  'São Paulo',
  'SP',
  'Pastor',
  'Missões',
  true,
  '1990-05-20',
  '1991-06-15',
  '1995-01-10',
  NOW()
),
-- Membro 2: Líder de Louvor
(
  'd7bed83c-882f-4486-a838-4dd4b2e9fc22',
  'd7bed83c-882f-4486-a838-4dd4b2e9fc22',
  'Maria Clara Santos',
  '1988-07-22',
  'Casado(a)',
  'Professora',
  'maria.santos@email.com',
  '1122334455',
  '11976543210',
  'Avenida Principal, 456',
  'Vila Nova',
  'São Paulo',
  'SP',
  'Membro',
  'Louvor',
  true,
  '2005-03-10',
  '2006-04-15',
  '2007-01-20',
  NOW()
),
-- Membro 3: Líder Jovem
(
  'd7bed83c-882f-4486-a838-4dd4b2e9fc22',
  'd7bed83c-882f-4486-a838-4dd4b2e9fc22',
  'Pedro Henrique Oliveira',
  '1995-11-30',
  'Solteiro(a)',
  'Engenheiro',
  'pedro.oliveira@email.com',
  '1144556677',
  '11965432109',
  'Rua dos Girassóis, 789',
  'Jardim Europa',
  'São Paulo',
  'SP',
  'Diácono',
  'Jovens',
  true,
  '2010-08-15',
  '2011-09-20',
  '2012-01-05',
  NOW()
);