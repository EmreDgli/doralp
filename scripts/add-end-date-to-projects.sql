-- Add end_date column to projects table
ALTER TABLE projects ADD COLUMN end_date DATE;

-- Update existing projects to have a default end_date if needed
-- UPDATE projects SET end_date = date WHERE end_date IS NULL AND date IS NOT NULL; 