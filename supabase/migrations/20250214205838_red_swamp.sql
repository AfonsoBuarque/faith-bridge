/*
  # Adicionar dados da igreja para o admin

  1. Mudanças
    - Adiciona registro na tabela dados_igreja para o usuário admin
    - Garante que o registro existe mesmo se o admin for recriado
*/

-- Garante que existe um registro de igreja para o admin
INSERT INTO dados_igreja (
  user_id,
  nome_igreja,
  razao_social,
  responsavel,
  quantidade_membros,
  telefone,
  whatsapp,
  email,
  endereco_completo,
  rede_social,
  como_conheceu
) VALUES (
  '594ed9f1-bddb-4383-a2d5-c6463ebdb457',
  'FaithFlow Tech',
  'FaithFlow Tech LTDA',
  'Admin FaithFlow',
  1,
  '11999999999',
  '11999999999',
  'ftadmin@faithflowtech.com.br',
  'Rua FaithFlow Tech, 123',
  'https://faithflowtech.com.br',
  'Sistema'
)
ON CONFLICT (user_id) DO UPDATE SET
  nome_igreja = EXCLUDED.nome_igreja,
  razao_social = EXCLUDED.razao_social,
  responsavel = EXCLUDED.responsavel,
  quantidade_membros = EXCLUDED.quantidade_membros,
  telefone = EXCLUDED.telefone,
  whatsapp = EXCLUDED.whatsapp,
  email = EXCLUDED.email,
  endereco_completo = EXCLUDED.endereco_completo,
  rede_social = EXCLUDED.rede_social,
  como_conheceu = EXCLUDED.como_conheceu;