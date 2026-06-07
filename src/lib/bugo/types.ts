/** 부고 생성 요청 */
export interface BugoCreateRequest {
  deceased_name: string;
  deceased_age?: number;
  deceased_gender?: "male" | "female";
  deceased_photo_url?: string;

  hall_id?: string;
  hall_name: string;
  hall_address?: string;
  hall_phone?: string;
  hall_room?: string;

  encoffin_at?: string; // ISO 8601
  funeral_at: string; // ISO 8601
  burial_place?: string;

  pin: string; // 수정용 4자리 PIN

  mourners: MournerInput[];
  accounts: AccountInput[];
}

export interface MournerInput {
  relation: string;
  name: string;
  is_main?: boolean;
  phone?: string;
}

export interface AccountInput {
  bank_name: string;
  account_no: string;
  holder_name: string;
}

/** 부고 조회 응답 */
export interface BugoView {
  id: string;
  short_id: string;

  deceased_name: string;
  deceased_age?: number;
  deceased_gender?: string;
  deceased_photo_url?: string;

  hall_id?: string;
  hall_name: string;
  hall_address?: string;
  hall_phone?: string;
  hall_room?: string;

  encoffin_at?: string;
  funeral_at: string;
  burial_place?: string;

  status: "active" | "archived" | "deleted";
  view_count: number;

  created_at: string;
  updated_at: string;

  mourners: MournerView[];
  accounts: AccountView[];
}

export interface MournerView {
  id: string;
  relation: string;
  name: string;
  is_main: boolean;
  phone?: string;
}

export interface AccountView {
  id: string;
  bank_name: string;
  account_no: string;
  holder_name: string;
}
