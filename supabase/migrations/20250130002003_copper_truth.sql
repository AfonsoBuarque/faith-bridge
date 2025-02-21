-- Create calendar_events table
CREATE TABLE IF NOT EXISTS calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  description text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  location text NOT NULL,
  type text NOT NULL,
  participants jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'pending',
  attachments text[] DEFAULT ARRAY[]::text[],
  notes text,
  created_by uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own events"
  ON calendar_events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own events"
  ON calendar_events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own events"
  ON calendar_events
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own events"
  ON calendar_events
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create storage bucket for calendar attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('calendar-attachments', 'calendar-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for calendar attachments
CREATE POLICY "Public users can view calendar attachments"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'calendar-attachments');

CREATE POLICY "Users can upload calendar attachments"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'calendar-attachments' 
    AND (CASE 
      WHEN metadata->>'content-type' = 'application/pdf' THEN true
      WHEN metadata->>'content-type' LIKE 'image/%' THEN true
      WHEN metadata->>'content-type' LIKE 'application/vnd.openxmlformats-officedocument.%' THEN true
      ELSE false
    END)
    AND (CASE 
      WHEN metadata->>'size' IS NOT NULL 
      THEN (metadata->>'size')::int <= 5242880 -- 5MB
      ELSE false
    END)
  );

CREATE POLICY "Users can manage own calendar attachments"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id = 'calendar-attachments')
  WITH CHECK (bucket_id = 'calendar-attachments');