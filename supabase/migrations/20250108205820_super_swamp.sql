/*
  # Add Devotional and Agenda Fields to Visitors Table

  1. Changes
    - Add `receber_devocional` text field to store devotional preferences
    - Add `receber_agenda` text field to store agenda preferences

  2. Notes
    - Both fields are optional
    - receber_devocional accepts: "QUERO RECEBER!", "NÃO QUERO MAIS RECEBER.", "NÃO RECEBER"
    - receber_agenda accepts: "SIM", "NÃO"
*/

ALTER TABLE cadastro_visitantes
ADD COLUMN IF NOT EXISTS receber_devocional text,
ADD COLUMN IF NOT EXISTS receber_agenda text;