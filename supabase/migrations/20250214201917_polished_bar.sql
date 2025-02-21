/*
  # Ajustes na estrutura dos Pequenos Grupos

  1. Alterações
    - Adicionar constraint de chave estrangeira para o líder
    - Ajustar políticas de segurança

  2. Correções
    - Melhorar relacionamento entre tabelas
    - Garantir integridade referencial
*/

-- Remover constraint existente se houver
ALTER TABLE pequenos_grupos 
DROP CONSTRAINT IF EXISTS pequenos_grupos_lider_fkey;

-- Adicionar nova constraint com nome correto
ALTER TABLE pequenos_grupos 
ADD CONSTRAINT pequenos_grupos_lider_fkey 
FOREIGN KEY (lider) 
REFERENCES membros(id)
ON DELETE SET NULL;

-- Atualizar políticas existentes
DROP POLICY IF EXISTS "Usuários podem visualizar seus próprios grupos" ON pequenos_grupos;
DROP POLICY IF EXISTS "Usuários podem criar seus próprios grupos" ON pequenos_grupos;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios grupos" ON pequenos_grupos;
DROP POLICY IF EXISTS "Usuários podem deletar seus próprios grupos" ON pequenos_grupos;

-- Recriar políticas com nomes mais claros
CREATE POLICY "select_own_groups"
  ON pequenos_grupos
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "insert_own_groups"
  ON pequenos_grupos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own_groups"
  ON pequenos_grupos
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "delete_own_groups"
  ON pequenos_grupos
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);