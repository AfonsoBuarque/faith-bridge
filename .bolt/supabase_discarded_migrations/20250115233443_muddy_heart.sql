/*
  # Update Admin User UUID
  
  Updates the placeholder UUID with the real UUID from Supabase Auth
*/

UPDATE admin_users
SET user_id = 'REAL-UUID-FROM-SUPABASE-AUTH'
WHERE user_id = '00000000-0000-0000-0000-000000000000';