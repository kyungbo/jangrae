-- greeting 컬럼 추가 (부고 인사말 문구)
-- Supabase SQL Editor에서 실행하세요.
ALTER TABLE bugo ADD COLUMN IF NOT EXISTS greeting text;
