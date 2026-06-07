"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { funeralHalls, type FuneralHall } from "@/data/funeral-halls";
import {
  User,
  Building2,
  CreditCard,
  Eye,
  ChevronRight,
  ChevronLeft,
  Plus,
  X,
  Search,
  Lock,
} from "lucide-react";

type Step = 1 | 2 | 3 | 4 | 5;

interface MournerInput {
  relation: string;
  name: string;
  phone: string;
  isCustomRelation: boolean;
  bank_name: string;
  account_no: string;
}

const BANK_ACCOUNT_LENGTHS: Record<string, [number, number]> = {
  "국민은행":   [12, 14],
  "신한은행":   [11, 12],
  "하나은행":   [14, 14],
  "우리은행":   [13, 13],
  "농협은행":   [13, 14],
  "기업은행":   [14, 14],
  "카카오뱅크": [13, 13],
  "토스뱅크":   [12, 12],
  "케이뱅크":   [12, 12],
  "SC제일은행": [11, 11],
  "씨티은행":   [12, 12],
  "대구은행":   [11, 12],
  "부산은행":   [13, 13],
  "광주은행":   [12, 12],
  "전북은행":   [13, 13],
  "경남은행":   [13, 13],
  "제주은행":   [12, 12],
  "우체국":     [14, 14],
  "새마을금고": [13, 13],
  "신협":       [13, 13],
  "수협":       [12, 12],
};

const PRIMARY_BANKS = ["국민은행", "신한은행", "하나은행", "우리은행", "농협은행", "카카오뱅크"];
const SECONDARY_BANKS = Object.keys(BANK_ACCOUNT_LENGTHS).filter((b) => !PRIMARY_BANKS.includes(b));

function getAccountWarning(bankName: string, accountNo: string): string | null {
  const digits = accountNo.replace(/[-\s]/g, "");
  if (!digits || !bankName) return null;
  if (!/^\d+$/.test(digits)) return "숫자만 입력해 주세요.";
  const range = BANK_ACCOUNT_LENGTHS[bankName];
  if (!range) return null;
  const [min, max] = range;
  if (digits.length < min || digits.length > max) {
    const expected = min === max ? `${min}자리` : `${min}~${max}자리`;
    return `${bankName} 일반 계좌는 ${expected}입니다. (현재 ${digits.length}자리) 평생계좌를 사용 중이라면 그대로 진행하세요.`;
  }
  return null;
}

function getMatchingBanks(accountNo: string): Set<string> {
  const digits = accountNo.replace(/[-\s]/g, "");
  if (!digits || digits.length < 10) return new Set();
  const matches = new Set<string>();
  for (const [bank, [min, max]] of Object.entries(BANK_ACCOUNT_LENGTHS)) {
    if (digits.length >= min && digits.length <= max) {
      matches.add(bank);
    }
  }
  return matches;
}

const RELATIONS = [
  "아들", "딸", "배우자", "며느리", "사위",
  "손자", "손녀", "형제", "자매", "조카",
];

const FUNERAL_DAYS_OPTIONS = [
  { value: 3, label: "3일장" },
  { value: 5, label: "5일장" },
  { value: 7, label: "7일장" },
];

const emptyMourner = (): MournerInput => ({
  relation: "", name: "", phone: "", isCustomRelation: false, bank_name: "", account_no: "",
});

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}

function isValidPhone(phone: string): boolean {
  return /^01[016789]\d{7,8}$/.test(phone.replace(/-/g, ""));
}

function calcAge(birthDate: string, deathDate: string): number | null {
  if (!birthDate) return null;
  const b = new Date(birthDate);
  const d = deathDate ? new Date(deathDate) : new Date();
  return d.getFullYear() - b.getFullYear() + 1; // 한국식 나이 (세는나이)
}

export default function BugoCreateWizard() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHints, setShowHints] = useState(false);

  // Step 1: 고인 정보
  const [deceasedName, setDeceasedName] = useState("");
  const [deceasedBirthDate, setDeceasedBirthDate] = useState("");
  const [deceasedGender, setDeceasedGender] = useState<"male" | "female" | "">("");

  // Step 2: 상주 정보
  const [mourners, setMourners] = useState<MournerInput[]>([emptyMourner()]);

  // Step 3: 장례 정보
  const [hallSearch, setHallSearch] = useState("");
  const [selectedHall, setSelectedHall] = useState<FuneralHall | null>(null);
  const [hallName, setHallName] = useState("");
  const [hallAddress, setHallAddress] = useState("");
  const [hallPhone, setHallPhone] = useState("");
  const [hallRoom, setHallRoom] = useState("");
  const [encoffinDate, setEncoffinDate] = useState("");
  const [encoffinTime, setEncoffinTime] = useState("");
  const [funeralDate, setFuneralDate] = useState("");
  const [funeralTime, setFuneralTime] = useState("");
  const [burialPlace, setBurialPlace] = useState("");
  const [isManualHall, setIsManualHall] = useState(false);

  // Step 4: 은행 더보기 토글
  const [showAllBanks, setShowAllBanks] = useState<Set<number>>(new Set());

  // Step 5: 비밀번호
  const [pin, setPin] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");

  // 스텝 변경 시 힌트 숨김
  useEffect(() => { setShowHints(false); }, [step]);

  // 임종 및 장례 기간
  const [deathDate, setDeathDate] = useState("");
  const [deathTime, setDeathTime] = useState("");
  const [funeralDays, setFuneralDays] = useState(3);

  useEffect(() => {
    if (deathDate) {
      const death = new Date(deathDate);
      const funeralDay = new Date(death);
      funeralDay.setDate(funeralDay.getDate() + funeralDays - 1);
      setFuneralDate(funeralDay.toISOString().split("T")[0]);
      setFuneralTime("07:00");
      const encoffinDay = new Date(funeralDay);
      encoffinDay.setDate(encoffinDay.getDate() - 1);
      setEncoffinDate(encoffinDay.toISOString().split("T")[0]);
      setEncoffinTime("10:00");
    }
  }, [deathDate, funeralDays]);

  // 장례식장 검색
  const hallResults = hallSearch.trim().length >= 2
    ? funeralHalls
        .filter((h) => h.name.includes(hallSearch) || h.address.includes(hallSearch) || h.district.includes(hallSearch))
        .slice(0, 8)
    : [];

  const selectHall = (hall: FuneralHall) => {
    setSelectedHall(hall);
    setHallName(hall.name);
    setHallAddress(hall.address);
    setHallPhone(hall.phone);
    setHallSearch("");
    setIsManualHall(false);
  };

  const addMourner = () => setMourners([...mourners, emptyMourner()]);

  const removeMourner = (index: number) => {
    if (mourners.length <= 1) return;
    setMourners(mourners.filter((_, i) => i !== index));
  };

  const updateMourner = (index: number, field: keyof MournerInput, value: string | boolean) => {
    const updated = [...mourners];
    updated[index] = { ...updated[index], [field]: value };
    setMourners(updated);
  };

  const getStepHints = (): string[] => {
    switch (step) {
      case 1:
        if (!deceasedName.trim()) return ["고인 성함을 입력해 주세요."];
        return [];
      case 2: {
        const hints: string[] = [];
        const main = mourners[0];
        if (!main.relation.trim()) hints.push("대표 상주의 관계를 선택해 주세요.");
        if (!main.name.trim()) hints.push("대표 상주의 이름을 입력해 주세요.");
        if (!isValidPhone(main.phone)) hints.push("대표 상주의 전화번호를 입력해 주세요.");
        return hints;
      }
      case 3: {
        const hints: string[] = [];
        if (!hallName.trim() && !selectedHall) hints.push("장례식장을 선택해 주세요.");
        if (!deathDate) hints.push("임종 일시를 입력해 주세요.");
        if (!funeralDate || !funeralTime) hints.push("발인 일시를 확인해 주세요.");
        return hints;
      }
      case 5: {
        if (pin.length !== 4 || !/^\d{4}$/.test(pin)) return ["비밀번호 4자리를 입력해 주세요."];
        if (pin !== pinConfirm) return ["비밀번호가 일치하지 않습니다."];
        return [];
      }
      default:
        return [];
    }
  };

  const canProceed = (): boolean => getStepHints().length === 0;

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const body = {
        deceased_name: deceasedName.trim(),
        deceased_age: calcAge(deceasedBirthDate, deathDate) ?? undefined,
        deceased_gender: deceasedGender || undefined,
        hall_id: selectedHall?.id,
        hall_name: selectedHall?.name || hallName.trim(),
        hall_address: selectedHall?.address || hallAddress.trim() || undefined,
        hall_phone: selectedHall?.phone || hallPhone.trim() || undefined,
        hall_room: hallRoom.trim() || undefined,
        encoffin_at: encoffinDate && encoffinTime
          ? new Date(`${encoffinDate}T${encoffinTime}`).toISOString()
          : undefined,
        funeral_at: new Date(`${funeralDate}T${funeralTime}`).toISOString(),
        burial_place: burialPlace.trim() || undefined,
        pin,
        mourners: mourners
          .filter((m) => m.relation.trim() && m.name.trim())
          .map((m, i) => ({
            relation: m.relation.trim(),
            name: m.name.trim(),
            phone: m.phone.replace(/-/g, "").trim() || undefined,
            is_main: i === 0,
          })),
        accounts: mourners
          .filter((m) => m.bank_name && m.account_no.trim())
          .map((m) => ({
            bank_name: m.bank_name,
            account_no: m.account_no.replace(/-/g, "").trim(),
            holder_name: m.name.trim(),
          })),
      };

      const res = await fetch("/api/bugo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "부고 생성에 실패했습니다.");
        return;
      }

      router.push(`/bugo/${data.short_id}?created=true`);
    } catch {
      setError("네트워크 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1 as Step, label: "고인 정보", icon: User },
    { num: 2 as Step, label: "상주 정보", icon: User },
    { num: 3 as Step, label: "장례 정보", icon: Building2 },
    { num: 4 as Step, label: "부의금 계좌", icon: CreditCard },
    { num: 5 as Step, label: "확인 및 발행", icon: Eye },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center justify-between mb-8 px-2">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step === s.num
                    ? "bg-navy text-white"
                    : step > s.num
                      ? "bg-success text-white"
                      : "bg-border text-text-secondary"
                }`}
              >
                {step > s.num ? "✓" : s.num}
              </div>
              <span className="text-[11px] text-text-secondary mt-1 hidden sm:block">
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-8 sm:w-16 h-0.5 mx-1 ${step > s.num ? "bg-success" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-error/30 rounded-xl p-4 text-sm text-error">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-border p-6 sm:p-8">
        {/* Step 1: 고인 정보 */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-navy">고인 정보</h2>
            <p className="text-sm text-text-secondary">
              고인의 기본 정보를 입력해 주세요.
            </p>

            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">
                성함 <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={deceasedName}
                onChange={(e) => setDeceasedName(e.target.value)}
                placeholder="고인의 성함"
                className="w-full px-4 py-3 border border-border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">
                  출생일
                </label>
                <input
                  type="date"
                  value={deceasedBirthDate}
                  onChange={(e) => setDeceasedBirthDate(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">
                  성별
                </label>
                <div className="flex gap-2">
                  {[
                    { value: "male" as const, label: "남" },
                    { value: "female" as const, label: "여" },
                  ].map((g) => (
                    <button
                      key={g.value}
                      onClick={() => setDeceasedGender(deceasedGender === g.value ? "" : g.value)}
                      className={`flex-1 py-3 rounded-lg text-sm font-medium border transition-all ${
                        deceasedGender === g.value
                          ? "bg-navy text-white border-navy"
                          : "bg-white text-text-secondary border-border hover:border-navy-light"
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: 상주 정보 */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-navy">상주 정보</h2>
            <p className="text-sm text-text-secondary">
              상주(장례를 주관하는 분)의 정보를 입력해 주세요.
            </p>

            {mourners.map((m, i) => (
              <div key={i} className="relative bg-cream-dark rounded-lg p-4 space-y-3">
                {mourners.length > 1 && (
                  <button
                    onClick={() => removeMourner(i)}
                    className="absolute top-3 right-3 text-text-secondary hover:text-error"
                  >
                    <X size={16} />
                  </button>
                )}
                <div className="text-xs font-medium text-navy">
                  {i === 0 ? "대표 상주" : `상주 ${i + 1}`}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    {m.isCustomRelation ? (
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={m.relation}
                          onChange={(e) => updateMourner(i, "relation", e.target.value)}
                          placeholder="관계 입력"
                          autoFocus
                          className="flex-1 px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                        />
                        <button
                          onClick={() => {
                            const updated = [...mourners];
                            updated[i] = { ...updated[i], isCustomRelation: false, relation: "" };
                            setMourners(updated);
                          }}
                          className="text-xs text-text-secondary hover:text-navy px-2 shrink-0"
                        >
                          목록
                        </button>
                      </div>
                    ) : (
                      <select
                        value={m.relation}
                        onChange={(e) => {
                          if (e.target.value === "__custom__") {
                            const updated = [...mourners];
                            updated[i] = { ...updated[i], isCustomRelation: true, relation: "" };
                            setMourners(updated);
                          } else {
                            updateMourner(i, "relation", e.target.value);
                          }
                        }}
                        className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                      >
                        <option value="">관계 선택</option>
                        {RELATIONS.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                        <option value="__custom__">직접 입력</option>
                      </select>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      value={m.name}
                      onChange={(e) => updateMourner(i, "name", e.target.value)}
                      placeholder="이름"
                      className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                    />
                  </div>
                </div>
                {/* 전화번호 */}
                <div>
                  <label className="block text-xs text-navy mb-1">
                    전화번호{i === 0 && <span className="text-error"> *</span>}
                    {i === 0 && <span className="text-text-secondary font-normal ml-1">부고장 관리 시 본인 확인용</span>}
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={m.phone}
                    onChange={(e) => updateMourner(i, "phone", formatPhone(e.target.value))}
                    placeholder="010-0000-0000"
                    maxLength={13}
                    className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                  />
                </div>
              </div>
            ))}

            <button
              onClick={addMourner}
              className="flex items-center gap-1.5 text-sm text-navy font-medium hover:text-navy-light"
            >
              <Plus size={16} /> 상주 추가
            </button>
          </div>
        )}

        {/* Step 3: 장례 정보 */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-navy">장례 정보</h2>

            {/* 장례식장 검색 */}
            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">
                장례식장 <span className="text-error">*</span>
              </label>

              {selectedHall && !isManualHall ? (
                <div className="bg-cream-dark rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-navy text-sm">{selectedHall.name}</p>
                      <p className="text-xs text-text-secondary mt-1">{selectedHall.address}</p>
                      <p className="text-xs text-text-secondary">{selectedHall.phone}</p>
                    </div>
                    <button
                      onClick={() => { setSelectedHall(null); setHallName(""); setHallAddress(""); setHallPhone(""); }}
                      className="text-text-secondary hover:text-error"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : isManualHall ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={hallName}
                    onChange={(e) => setHallName(e.target.value)}
                    placeholder="장례식장명"
                    className="w-full px-4 py-3 border border-border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                  />
                  <input
                    type="text"
                    value={hallAddress}
                    onChange={(e) => setHallAddress(e.target.value)}
                    placeholder="주소"
                    className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                  />
                  <input
                    type="text"
                    value={hallPhone}
                    onChange={(e) => setHallPhone(e.target.value)}
                    placeholder="전화번호"
                    className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                  />
                  <button
                    onClick={() => setIsManualHall(false)}
                    className="text-xs text-navy underline"
                  >
                    목록에서 검색하기
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                    <input
                      type="text"
                      value={hallSearch}
                      onChange={(e) => setHallSearch(e.target.value)}
                      placeholder="장례식장명 또는 지역으로 검색"
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                    />
                  </div>
                  {hallResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {hallResults.map((hall) => (
                        <button
                          key={hall.id}
                          onClick={() => selectHall(hall)}
                          className="w-full text-left px-4 py-3 hover:bg-cream-dark border-b border-border last:border-0"
                        >
                          <p className="text-sm font-medium text-navy">{hall.name}</p>
                          <p className="text-xs text-text-secondary">{hall.address}</p>
                        </button>
                      ))}
                    </div>
                  )}
                  {hallSearch.trim().length >= 2 && hallResults.length === 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-border rounded-lg shadow-lg p-4 text-center">
                      <p className="text-sm text-text-secondary mb-2">검색 결과가 없습니다</p>
                      <button
                        onClick={() => { setIsManualHall(true); setHallName(hallSearch); setHallSearch(""); }}
                        className="text-sm text-navy font-medium underline"
                      >
                        직접 입력하기
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() => setIsManualHall(true)}
                    className="mt-2 text-xs text-text-secondary underline"
                  >
                    목록에 없으면 직접 입력
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">빈소 호실</label>
              <input
                type="text"
                value={hallRoom}
                onChange={(e) => setHallRoom(e.target.value)}
                placeholder="예: 3호실"
                className="w-full px-4 py-3 border border-border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">
                임종 일시 <span className="text-error">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input type="date" value={deathDate} onChange={(e) => setDeathDate(e.target.value)}
                  className="px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy" />
                <input type="time" value={deathTime} onChange={(e) => setDeathTime(e.target.value)}
                  className="px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">장례 기간</label>
              <div className="flex gap-2">
                {FUNERAL_DAYS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setFuneralDays(opt.value)}
                    className={`flex-1 py-3 rounded-lg text-sm font-medium border transition-all ${
                      funeralDays === opt.value
                        ? "bg-navy text-white border-navy"
                        : "bg-white text-text-secondary border-border hover:border-navy-light"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">
                발인 일시
                {deathDate && <span className="text-xs font-normal text-text-secondary ml-1.5">자동 계산 / 수정 가능</span>}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input type="date" value={funeralDate} onChange={(e) => setFuneralDate(e.target.value)}
                  className="px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy" />
                <input type="time" value={funeralTime} onChange={(e) => setFuneralTime(e.target.value)}
                  className="px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">
                입관 일시
                {deathDate && <span className="text-xs font-normal text-text-secondary ml-1.5">자동 계산 / 수정 가능</span>}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input type="date" value={encoffinDate} onChange={(e) => setEncoffinDate(e.target.value)}
                  className="px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy" />
                <input type="time" value={encoffinTime} onChange={(e) => setEncoffinTime(e.target.value)}
                  className="px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">장지</label>
              <input
                type="text"
                value={burialPlace}
                onChange={(e) => setBurialPlace(e.target.value)}
                placeholder="예: 서울시립승화원"
                className="w-full px-4 py-3 border border-border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
              />
            </div>
          </div>
        )}

        {/* Step 4: 부의금 계좌 (상주별) */}
        {step === 4 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-navy">부의금 계좌</h2>
            <p className="text-sm text-text-secondary">
              상주별로 부의금을 받을 계좌를 등록하세요. (선택 사항)
            </p>

            {mourners
              .filter((m) => m.relation.trim() && m.name.trim())
              .map((m, idx) => {
                const mIndex = mourners.indexOf(m);
                const warning = getAccountWarning(m.bank_name, m.account_no);
                const recommended = getMatchingBanks(m.account_no);
                const hasRecommendation = recommended.size > 0;
                const isExpanded = showAllBanks.has(mIndex);

                const bankButtonClass = (bank: string) => {
                  if (m.bank_name === bank) return "bg-navy text-white border-navy";
                  if (hasRecommendation && recommended.has(bank)) return "bg-navy/10 text-navy border-navy/30 ring-1 ring-navy/20";
                  if (hasRecommendation && !recommended.has(bank)) return "bg-white text-text-secondary/50 border-border";
                  return "bg-white text-text-secondary border-border hover:border-navy-light";
                };

                return (
                  <div key={mIndex} className="bg-cream-dark rounded-xl p-4 space-y-3">
                    <div className="text-sm font-semibold text-navy">
                      {m.relation} {m.name}
                      {idx === 0 && <span className="text-[10px] bg-navy/10 px-1.5 py-0.5 rounded ml-1.5">대표</span>}
                    </div>

                    {/* 계좌번호 입력 */}
                    <div>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={m.account_no}
                        onChange={(e) => updateMourner(mIndex, "account_no", e.target.value.replace(/[^\d-]/g, ""))}
                        placeholder="계좌번호 입력"
                        className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                      />
                    </div>

                    {/* 은행 선택 (탭 방식) */}
                    <div>
                      <p className="text-xs text-text-secondary mb-1.5">
                        은행 선택
                        {hasRecommendation && <span className="text-navy ml-1">(자릿수 일치 은행 표시 중)</span>}
                      </p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {PRIMARY_BANKS.map((bank) => (
                          <button
                            key={bank}
                            onClick={() => updateMourner(mIndex, "bank_name", m.bank_name === bank ? "" : bank)}
                            className={`py-2 px-1 rounded-lg text-xs font-medium border transition-all ${bankButtonClass(bank)}`}
                          >
                            {bank}
                          </button>
                        ))}
                      </div>
                      {isExpanded && (
                        <div className="grid grid-cols-3 gap-1.5 mt-1.5">
                          {SECONDARY_BANKS.map((bank) => (
                            <button
                              key={bank}
                              onClick={() => updateMourner(mIndex, "bank_name", m.bank_name === bank ? "" : bank)}
                              className={`py-2 px-1 rounded-lg text-xs font-medium border transition-all ${bankButtonClass(bank)}`}
                            >
                              {bank}
                            </button>
                          ))}
                        </div>
                      )}
                      <button
                        onClick={() => {
                          const next = new Set(showAllBanks);
                          isExpanded ? next.delete(mIndex) : next.add(mIndex);
                          setShowAllBanks(next);
                        }}
                        className="text-xs text-text-secondary underline mt-1.5"
                      >
                        {isExpanded ? "접기" : `그 외 은행 (${SECONDARY_BANKS.length}개)`}
                      </button>
                    </div>

                    {/* 자릿수 불일치 안내 (경고, 차단 아님) */}
                    {warning && (
                      <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                        {warning}
                      </p>
                    )}

                    {/* 선택 결과 표시 */}
                    {m.bank_name && m.account_no && !warning && (
                      <div className="bg-white rounded-lg px-3 py-2 text-xs text-navy">
                        {m.bank_name} {m.account_no} (예금주: {m.name})
                      </div>
                    )}
                  </div>
                );
              })}

            {mourners.filter((m) => m.relation.trim() && m.name.trim()).length === 0 && (
              <div className="text-center py-8 text-text-secondary">
                <CreditCard size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">상주 정보를 먼저 입력해 주세요.</p>
              </div>
            )}
          </div>
        )}

        {/* Step 5: 확인 및 발행 */}
        {step === 5 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-navy">확인 및 발행</h2>

            <div className="bg-cream-dark rounded-xl p-5 space-y-4">
              <div>
                <p className="text-xs text-text-secondary">고인</p>
                <p className="font-semibold text-navy">
                  故 {deceasedName}
                  {calcAge(deceasedBirthDate, deathDate) && ` (향년 ${calcAge(deceasedBirthDate, deathDate)}세)`}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-secondary">상주</p>
                {mourners
                  .filter((m) => m.relation && m.name)
                  .map((m, i) => (
                    <p key={i} className="text-sm text-navy">
                      {m.relation} {m.name}
                      {m.phone && (
                        <span className="text-text-secondary text-xs ml-1">({m.phone})</span>
                      )}
                    </p>
                  ))}
              </div>
              <div>
                <p className="text-xs text-text-secondary">장례식장</p>
                <p className="text-sm text-navy">
                  {selectedHall?.name || hallName}
                  {hallRoom && ` ${hallRoom}`}
                </p>
                {(selectedHall?.address || hallAddress) && (
                  <p className="text-xs text-text-secondary">{selectedHall?.address || hallAddress}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {encoffinDate && (
                  <div>
                    <p className="text-xs text-text-secondary">입관</p>
                    <p className="text-sm text-navy">{encoffinDate} {encoffinTime}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-text-secondary">발인</p>
                  <p className="text-sm text-navy">{funeralDate} {funeralTime}</p>
                </div>
              </div>
              {burialPlace && (
                <div>
                  <p className="text-xs text-text-secondary">장지</p>
                  <p className="text-sm text-navy">{burialPlace}</p>
                </div>
              )}
              {mourners.some((m) => m.bank_name && m.account_no) && (
                <div>
                  <p className="text-xs text-text-secondary">부의금 계좌</p>
                  {mourners
                    .filter((m) => m.bank_name && m.account_no)
                    .map((m, i) => (
                      <p key={i} className="text-sm text-navy">
                        {m.relation} {m.name}: {m.bank_name} {m.account_no}
                      </p>
                    ))}
                </div>
              )}
            </div>

            {/* 수정용 비밀번호 */}
            <div className="bg-blue-50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Lock size={16} className="text-navy" />
                <h3 className="text-sm font-semibold text-navy">수정용 비밀번호</h3>
              </div>
              <p className="text-xs text-text-secondary mb-4">
                부고장을 수정하거나 삭제할 때 필요한 비밀번호입니다.
                <br />
                대표 상주 전화번호와 이 비밀번호로 부고장을 관리할 수 있습니다.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-navy mb-1">비밀번호 (숫자 4자리)</label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                    placeholder="••••"
                    className="w-full px-4 py-3 border border-border rounded-lg text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                  />
                </div>
                <div>
                  <label className="block text-xs text-navy mb-1">비밀번호 확인</label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={pinConfirm}
                    onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, ""))}
                    placeholder="••••"
                    className="w-full px-4 py-3 border border-border rounded-lg text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                  />
                </div>
              </div>
              {pin.length === 4 && pinConfirm.length === 4 && pin !== pinConfirm && (
                <p className="text-xs text-error mt-2">비밀번호가 일치하지 않습니다.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Validation hints — CTA를 누른 후에만 표시 */}
      {showHints && getStepHints().length > 0 && (
        <div className="mt-4 text-right">
          {getStepHints().map((hint, i) => (
            <p key={i} className="text-xs text-error">{hint}</p>
          ))}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex items-center justify-between mt-3">
        {step > 1 ? (
          <button
            onClick={() => setStep((step - 1) as Step)}
            className="flex items-center gap-1 text-sm text-text-secondary hover:text-navy"
          >
            <ChevronLeft size={16} /> 이전
          </button>
        ) : (
          <div />
        )}

        {step < 5 ? (
          <button
            onClick={() => {
              if (canProceed()) {
                setStep((step + 1) as Step);
              } else {
                setShowHints(true);
              }
            }}
            className="flex items-center gap-1 px-6 py-3 rounded-lg text-sm font-medium transition-all bg-navy text-white hover:bg-navy-light"
          >
            다음 <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={() => {
              if (canProceed()) {
                handleSubmit();
              } else {
                setShowHints(true);
              }
            }}
            disabled={isSubmitting}
            className={`px-8 py-3 rounded-lg text-sm font-medium transition-all ${
              isSubmitting
                ? "bg-border text-text-secondary cursor-not-allowed"
                : "bg-navy text-white hover:bg-navy-light"
            }`}
          >
            {isSubmitting ? "부고장을 만들고 있습니다..." : "부고장 만들기"}
          </button>
        )}
      </div>
    </div>
  );
}
