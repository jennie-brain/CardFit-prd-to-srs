"use client";

import Link from "next/link";
import { useRef, useState, type MouseEvent } from "react";

import { AmountField } from "@/features/cardfit-prototype/components/amount-field";
import { FutureSpendItemCard } from "@/features/cardfit-prototype/components/future-spend-item-card";
import { ScopeNotice } from "@/features/cardfit-prototype/components/scope-notice";
import { SelectField, type SelectFieldOption } from "@/features/cardfit-prototype/components/select-field";
import { Alert, AlertDescription, AlertTitle } from "@/features/cardfit-prototype/ui/alert";
import { Button, buttonVariants } from "@/features/cardfit-prototype/ui/button";
import { Input } from "@/features/cardfit-prototype/ui/input";
import { Label } from "@/features/cardfit-prototype/ui/label";
import { RadioGroup, RadioGroupItem } from "@/features/cardfit-prototype/ui/radio-group";
import { MANWON } from "@/features/cardfit-prototype/lib/format";
import {
  AMOUNT_ERROR_MESSAGE,
  SELECTABLE_MONTHS,
  buildSelectableYears,
  parseManwonInput,
  spendAmountLabel,
  spendKindLabel,
  spendTimingLabel,
} from "@/features/cardfit-prototype/lib/plan-input";
import type {
  FutureSpendCategoryId,
  FutureSpendItemViewModel,
  FutureSpendKind,
  PlanInputViewModel,
} from "@/features/cardfit-prototype/lib/view-model";
import { cn } from "@/features/cardfit-prototype/lib/utils";

type PlanStep = "spend" | "constraints";

/** PRD 차별 가치표의 `최대 5장 설정 시 31개 조합` 기준을 그대로 선택 후보로 쓴다. */
const MAX_CARD_COUNT_OPTIONS: SelectFieldOption[] = [1, 2, 3, 4, 5].map((count) => ({
  value: String(count),
  label: `${count}장`,
}));

/**
 * `/plan` 2단계 흐름. 주소를 옮기지 않고 미래지출 입력 → 카드 조건 확인으로 전환한다.
 * (spec §8.3 · rules 006 라우팅 규칙)
 */
export function PlanFlow({ plan }: { plan: PlanInputViewModel }) {
  const [step, setStep] = useState<PlanStep>("spend");
  const [items, setItems] = useState<FutureSpendItemViewModel[]>([]);
  const [nextItemNumber, setNextItemNumber] = useState(1);
  /** 수정 중인 항목 id. null이면 새 항목 추가 모드다. (spec §8.9 추가·수정·삭제) */
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const [categoryId, setCategoryId] = useState<FutureSpendCategoryId>(
    plan.categories[0].id,
  );
  const [customLabel, setCustomLabel] = useState("");
  const [kind, setKind] = useState<FutureSpendKind>("ONE_TIME");
  const [amountRaw, setAmountRaw] = useState("");

  const years = buildSelectableYears(plan.meta.dataAsOf);
  const [year, setYear] = useState(String(years[0]));
  const [month, setMonth] = useState("9");

  const [customLabelError, setCustomLabelError] = useState<string | null>(null);
  const [amountError, setAmountError] = useState<string | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);

  const [maxCardCount, setMaxCardCount] = useState(String(plan.constraints.maxCardCount));
  const [feeCapRaw, setFeeCapRaw] = useState(
    String(plan.constraints.annualFeeCapWon / MANWON),
  );
  const [feeCapError, setFeeCapError] = useState<string | null>(null);
  const [allowsNewIssue, setAllowsNewIssue] = useState(
    plan.constraints.allowsNewIssue ? "ALLOW" : "DENY",
  );

  const customLabelRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const feeCapRef = useRef<HTMLInputElement>(null);

  const selectedCategory =
    plan.categories.find((category) => category.id === categoryId) ?? plan.categories[0];

  // 예시 적용 상태는 목록에서 파생한다. 별도 state를 두면 수정·삭제 결과와 어긋날 수 있다.
  const exampleApplied = items.some((item) => item.isExampleValue);

  function resetDraft() {
    setAmountRaw("");
    setCustomLabel("");
    setAmountError(null);
    setCustomLabelError(null);
    setEditingItemId(null);
  }

  /** 목록의 한 항목을 입력 폼으로 불러온다. 예시 값도 그대로 수정할 수 있다. (spec §8.1) */
  function startEdit(id: string) {
    const target = items.find((item) => item.id === id);
    if (target === undefined) return;

    setEditingItemId(target.id);
    setCategoryId(target.categoryId);
    setCustomLabel(target.customLabel ?? "");
    setKind(target.kind);
    setAmountRaw(String(target.amountWon / MANWON));
    setYear(String(target.startYear));
    setMonth(String(target.startMonth));
    setAmountError(null);
    setCustomLabelError(null);
    setStepError(null);
    amountRef.current?.focus();
  }

  function submitItem() {
    // 오류가 있으면 입력값과 선택 상태를 유지하고 첫 오류 필드로 focus를 옮긴다. (spec §8.6)
    let firstInvalid: "customLabel" | "amount" | null = null;

    const needsCustomLabel = selectedCategory.allowsCustomLabel;
    const trimmedCustomLabel = customLabel.trim();
    if (needsCustomLabel && trimmedCustomLabel.length === 0) {
      setCustomLabelError("직접 입력할 카테고리 이름을 입력해 주세요.");
      firstInvalid = "customLabel";
    } else {
      setCustomLabelError(null);
    }

    const parsedAmount = parseManwonInput(amountRaw);
    if (!parsedAmount.ok) {
      setAmountError(AMOUNT_ERROR_MESSAGE[parsedAmount.reason]);
      firstInvalid = firstInvalid ?? "amount";
    } else {
      setAmountError(null);
    }

    if (firstInvalid !== null || !parsedAmount.ok) {
      if (firstInvalid === "customLabel") customLabelRef.current?.focus();
      else amountRef.current?.focus();
      return;
    }

    const draft = {
      categoryId,
      customLabel: needsCustomLabel ? trimmedCustomLabel : null,
      kind,
      amountWon: parsedAmount.won,
      startYear: Number(year),
      startMonth: Number(month),
    };

    if (editingItemId !== null) {
      // 수정은 항목 id와 비교 기준값·예시 표시를 보존한다. 과거 월평균이 남아 있으면
      // 바뀐 미래 금액으로 방향·차액이 다시 표시된다. (spec §8.9)
      setItems((previous) =>
        previous.map((item) => (item.id === editingItemId ? { ...item, ...draft } : item)),
      );
    } else {
      setItems((previous) => [
        ...previous,
        {
          id: `item-${nextItemNumber}`,
          ...draft,
          // 마이데이터를 연결하지 않으므로 사용자가 추가한 항목에는 비교 기준값이 없다.
          pastMonthlyAverageWon: null,
          isExampleValue: false,
        },
      ]);
      setNextItemNumber((previous) => previous + 1);
    }

    resetDraft();
    setStepError(null);
  }

  function removeItem(id: string) {
    setItems((previous) => previous.filter((item) => item.id !== id));
    if (editingItemId === id) resetDraft();
  }

  function applyExampleAmounts() {
    setItems((previous) => [
      ...previous.filter((item) => !item.isExampleValue),
      ...plan.exampleItems,
    ]);
    resetDraft();
    setStepError(null);
  }

  function clearExampleAmounts() {
    setItems((previous) => previous.filter((item) => !item.isExampleValue));
    resetDraft();
  }

  function goToConstraints() {
    if (items.length === 0) {
      setStepError("미래지출을 한 건 이상 추가하면 카드 조건 단계로 이동할 수 있습니다.");
      amountRef.current?.focus();
      return;
    }
    setStepError(null);
    setStep("constraints");
  }

  function validateFeeCap(raw: string) {
    setFeeCapRaw(raw);
    const parsed = parseManwonInput(raw, { allowZero: true });
    setFeeCapError(parsed.ok ? null : AMOUNT_ERROR_MESSAGE[parsed.reason]);
    if (parsed.ok) setStepError(null);
  }

  /**
   * 2단계에서 결과 화면으로 넘어가기 전 카드 조건 오류를 1단계와 같은 방식으로 차단한다.
   * 오류가 남아 있으면 이동하지 않고 사유를 알린 뒤 해당 필드로 focus를 옮긴다. (spec §8.6)
   */
  function guardResultNavigation(event: MouseEvent<HTMLAnchorElement>) {
    if (feeCapError === null) return;
    event.preventDefault();
    setStepError("카드 조건에 입력 오류가 있어요. 연회비 한도를 고치면 결과를 확인할 수 있습니다.");
    feeCapRef.current?.focus();
  }

  if (step === "constraints") {
    return (
      <div className="flex flex-col gap-6">
        <nav aria-label="입력 단계" className="text-sm text-muted-foreground">
          1단계 미래지출 입력 · <strong className="text-foreground">2단계 카드 조건 확인</strong>
        </nav>

        <section aria-labelledby="constraints-title" className="flex flex-col gap-4">
          <div>
            <h2 id="constraints-title" className="text-lg font-semibold">
              카드 조건 확인
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              미래지출과 분리해 카드 조건만 확인해요.
            </p>
          </div>

          <SelectField
            id="max-card-count"
            label="최대 카드 수"
            value={maxCardCount}
            options={MAX_CARD_COUNT_OPTIONS}
            onValueChange={setMaxCardCount}
            description="이 장수 이내의 조합만 비교합니다."
          />

          <AmountField
            id="annual-fee-cap"
            label="연회비 한도"
            value={feeCapRaw}
            onValueChange={validateFeeCap}
            errorMessage={feeCapError}
            allowZero
            hint="연회비 한도는 0원 이상 입력할 수 있습니다."
            inputRef={feeCapRef}
          />

          <div className="flex flex-col gap-2">
            <p id="allows-new-issue-label" className="text-sm font-medium">
              신규 발급 허용 여부
            </p>
            <RadioGroup
              value={allowsNewIssue}
              onValueChange={(value) => setAllowsNewIssue(String(value))}
              aria-labelledby="allows-new-issue-label"
            >
              <label className="flex items-center gap-2 py-1 text-sm">
                <RadioGroupItem value="ALLOW" />
                <span>새 카드 발급을 포함해 비교하기</span>
              </label>
              <label className="flex items-center gap-2 py-1 text-sm">
                <RadioGroupItem value="DENY" />
                <span>보유한 카드만으로 비교하기</span>
              </label>
            </RadioGroup>
          </div>

          <p className="rounded-lg border border-dashed px-3 py-2 text-xs text-muted-foreground">
            카드 조건의 기본값은 화면 확인용 예시이며 이 프로토타입의 계산에 반영하지 않습니다.
            계산에 포함되지 않은 항목은 결과 화면의 계산 근거에서 확인할 수 있습니다.
          </p>
        </section>

        <section aria-labelledby="spend-summary-title" className="flex flex-col gap-3">
          <h2 id="spend-summary-title" className="text-lg font-semibold">
            입력한 미래지출 {items.length}건
          </h2>
          <ul className="flex flex-col gap-2">
            {items.map((item) => (
              <FutureSpendItemCard key={item.id} item={item} categories={plan.categories} />
            ))}
          </ul>
        </section>

        <div className="flex flex-col gap-2">
          {stepError ? (
            <Alert variant="destructive">
              <AlertTitle>결과를 확인할 수 없어요</AlertTitle>
              <AlertDescription>{stepError}</AlertDescription>
            </Alert>
          ) : null}
          <Link
            href="/result"
            aria-disabled={feeCapError !== null}
            onClick={guardResultNavigation}
            className={cn(
              buttonVariants(),
              "h-11 w-full text-base",
              feeCapError !== null && "opacity-60",
            )}
          >
            결과 확인하기
          </Link>
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full text-base"
            onClick={() => {
              // 단계별 이동 오류 문구가 다음 단계로 새지 않게 함께 지운다.
              setStepError(null);
              setStep("spend");
            }}
          >
            미래지출 다시 입력하기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <nav aria-label="입력 단계" className="text-sm text-muted-foreground">
        <strong className="text-foreground">1단계 미래지출 입력</strong> · 2단계 카드 조건 확인
      </nav>

      <ScopeNotice notice={plan.scopeNotice} />

      <section aria-labelledby="spend-list-title" className="flex flex-col gap-3">
        <h2 id="spend-list-title" className="text-lg font-semibold">
          입력한 미래지출 {items.length}건
        </h2>

        {items.length === 0 ? (
          <div className="rounded-lg border bg-card px-3 py-3 text-sm">
            <p className="font-medium">아직 입력한 미래지출이 없어요</p>
            <p className="mt-1 text-muted-foreground">
              미래지출을 한 건 이상 추가하면 카드 조건 단계로 이동할 수 있습니다.
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-2 h-10"
              onClick={() => amountRef.current?.focus()}
            >
              미래지출 입력하기
            </Button>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {items.map((item) => (
              <FutureSpendItemCard
                key={item.id}
                item={item}
                categories={plan.categories}
                onEdit={startEdit}
                onRemove={removeItem}
                isEditing={item.id === editingItemId}
              />
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="spend-form-title" className="flex flex-col gap-4">
        <h2 id="spend-form-title" className="text-lg font-semibold">
          {editingItemId === null ? "미래지출 추가" : "미래지출 수정"}
        </h2>

        <div className="flex flex-col gap-2 rounded-lg border border-dashed px-3 py-3">
          {exampleApplied ? (
            <>
              <p className="text-xs text-muted-foreground">
                이 금액은 입력 방법을 확인하기 위한 예시이며, 개인 소비 데이터나 업계 통계를
                기준으로 하지 않았습니다.
              </p>
              <Button type="button" variant="outline" className="h-10 w-fit" onClick={clearExampleAmounts}>
                예시 지우기
              </Button>
            </>
          ) : (
            <>
              <p className="text-xs text-muted-foreground">
                직접 입력하거나 예시 금액을 적용할 수 있어요. 적용한 예시 금액은 자유롭게
                수정·삭제할 수 있습니다.
              </p>
              <Button type="button" variant="outline" className="h-10 w-fit" onClick={applyExampleAmounts}>
                예시 금액 적용하기
              </Button>
            </>
          )}
        </div>

        <SelectField
          id="category"
          label="카테고리"
          value={categoryId}
          options={plan.categories.map((category) => ({
            value: category.id,
            label: category.label,
          }))}
          onValueChange={(value) => {
            setCategoryId(value as FutureSpendCategoryId);
            setCustomLabelError(null);
          }}
          description={selectedCategory.examples}
        />

        {selectedCategory.allowsCustomLabel ? (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="custom-label">카테고리 직접 입력</Label>
            <Input
              id="custom-label"
              ref={customLabelRef}
              value={customLabel}
              autoComplete="off"
              aria-invalid={customLabelError ? true : undefined}
              aria-describedby={customLabelError ? "custom-label-error" : undefined}
              onChange={(event) => setCustomLabel(event.target.value)}
              className="h-11"
            />
            {customLabelError ? (
              <p id="custom-label-error" role="alert" className="text-sm font-medium text-destructive">
                입력 오류: {customLabelError}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-col gap-2">
          <p id="spend-kind-label" className="text-sm font-medium">
            지출 형태
          </p>
          <RadioGroup
            value={kind}
            onValueChange={(value) => setKind(String(value) as FutureSpendKind)}
            aria-labelledby="spend-kind-label"
          >
            <label className="flex items-center gap-2 py-1 text-sm">
              <RadioGroupItem value="ONE_TIME" />
              <span>{spendKindLabel("ONE_TIME")}</span>
            </label>
            <label className="flex items-center gap-2 py-1 text-sm">
              <RadioGroupItem value="MONTHLY" />
              <span>{spendKindLabel("MONTHLY")}</span>
            </label>
          </RadioGroup>
          <p className="text-xs text-muted-foreground">
            늘어나는지 줄어드는지는 따로 고르지 않아요. 비교할 과거 지출이 있으면 방향과 차액을
            대신 계산해 보여줍니다.
          </p>
        </div>

        <AmountField
          id="spend-amount"
          label={spendAmountLabel(kind)}
          value={amountRaw}
          onValueChange={(raw) => {
            setAmountRaw(raw);
            setAmountError(null);
          }}
          errorMessage={amountError}
          inputRef={amountRef}
          hint="만원 단위로 입력합니다. 단위 전환과 소수 입력은 사용하지 않습니다."
        />

        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium">{spendTimingLabel(kind)}</legend>
          <div className="flex gap-2">
            <SelectField
              id="start-year"
              label="연"
              value={year}
              options={years.map((candidate) => ({
                value: String(candidate),
                label: `${candidate}년`,
              }))}
              onValueChange={setYear}
              className="flex-1"
            />
            <SelectField
              id="start-month"
              label="월"
              value={month}
              options={SELECTABLE_MONTHS.map((candidate) => ({
                value: String(candidate),
                label: `${candidate}월`,
              }))}
              onValueChange={setMonth}
              className="flex-1"
            />
          </div>
        </fieldset>

        <Button type="button" className="h-11 w-full text-base" onClick={submitItem}>
          {editingItemId === null ? "미래지출 추가하기" : "수정 내용 저장하기"}
        </Button>
        {editingItemId === null ? null : (
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full text-base"
            onClick={resetDraft}
          >
            수정 취소하기
          </Button>
        )}
      </section>

      <section aria-labelledby="next-step-title" className="flex flex-col gap-2">
        <h2 id="next-step-title" className="sr-only">
          다음 단계
        </h2>
        {stepError ? (
          <Alert variant="destructive">
            <AlertTitle>다음 단계로 이동할 수 없어요</AlertTitle>
            <AlertDescription>{stepError}</AlertDescription>
          </Alert>
        ) : null}
        <Button type="button" className="h-11 w-full text-base" onClick={goToConstraints}>
          카드 조건 확인하기
        </Button>
      </section>
    </div>
  );
}
