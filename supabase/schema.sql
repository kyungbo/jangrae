-- 처음장례 부고장 서비스 DB 스키마
-- Supabase SQL Editor에서 실행

-- 1. 부고 테이블
create table bugo (
  id            uuid primary key default gen_random_uuid(),
  short_id      text unique not null,
  pin_hash      text not null,              -- bcrypt 해시된 4자리 PIN

  -- 고인 정보
  deceased_name text not null,
  deceased_age  int,
  deceased_gender text check (deceased_gender in ('male', 'female')),
  deceased_photo_url text,
  greeting      text,                        -- 부고 인사말 문구

  -- 장례 정보
  hall_id       text,                        -- funeral_halls DB 참조 (선택)
  hall_name     text not null,
  hall_address  text,
  hall_phone    text,
  hall_room     text,

  encoffin_at   timestamptz,                 -- 입관 일시
  funeral_at    timestamptz not null,        -- 발인 일시
  burial_place  text,                        -- 장지

  -- 상태
  status        text default 'active' check (status in ('active', 'archived', 'deleted')),
  view_count    int default 0,

  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- 2. 상주 테이블
create table mourner (
  id         uuid primary key default gen_random_uuid(),
  bugo_id    uuid references bugo on delete cascade not null,
  relation   text not null,
  name       text not null,
  is_main    boolean default false,
  phone      text,
  sort_order int default 0
);

-- 3. 부의금 계좌 테이블
create table bugo_account (
  id           uuid primary key default gen_random_uuid(),
  bugo_id      uuid references bugo on delete cascade not null,
  bank_name    text not null,
  account_no   text not null,
  holder_name  text not null,
  sort_order   int default 0
);

-- 4. 인덱스
create index idx_bugo_short_id on bugo (short_id);
create index idx_bugo_status on bugo (status);
create index idx_mourner_bugo_id on mourner (bugo_id);
create index idx_bugo_account_bugo_id on bugo_account (bugo_id);

-- 5. RLS (Row Level Security) 활성화
alter table bugo enable row level security;
alter table mourner enable row level security;
alter table bugo_account enable row level security;

-- 6. RLS 정책 — anon 사용자 (로그인 없이 사용하는 구조)
-- 부고: 누구나 생성, 조회 가능. 수정/삭제는 API에서 PIN 검증.
create policy "Anyone can create bugo"
  on bugo for insert
  to anon
  with check (true);

create policy "Anyone can view active bugo"
  on bugo for select
  to anon
  using (status = 'active');

create policy "Anyone can update bugo"
  on bugo for update
  to anon
  using (true);

create policy "Anyone can delete bugo"
  on bugo for delete
  to anon
  using (true);

-- 상주: bugo와 연동
create policy "Anyone can insert mourner"
  on mourner for insert
  to anon
  with check (true);

create policy "Anyone can view mourner"
  on mourner for select
  to anon
  using (true);

create policy "Anyone can update mourner"
  on mourner for update
  to anon
  using (true);

create policy "Anyone can delete mourner"
  on mourner for delete
  to anon
  using (true);

-- 계좌: bugo와 연동
create policy "Anyone can insert account"
  on bugo_account for insert
  to anon
  with check (true);

create policy "Anyone can view account"
  on bugo_account for select
  to anon
  using (true);

create policy "Anyone can update account"
  on bugo_account for update
  to anon
  using (true);

create policy "Anyone can delete account"
  on bugo_account for delete
  to anon
  using (true);

-- 7. view_count 증가 함수
create or replace function increment_view_count(bugo_short_id text)
returns void as $$
  update bugo
  set view_count = view_count + 1
  where short_id = bugo_short_id and status = 'active';
$$ language sql;

-- 8. updated_at 자동 갱신 트리거
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger bugo_updated_at
  before update on bugo
  for each row
  execute function update_updated_at();
