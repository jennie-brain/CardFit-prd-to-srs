"use client";

import { useState, type Ref } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatAmountConversion } from "@/lib/prototype/format";
import {
  applyQuickAdd,
  parseManwonInput,
  QUICK_ADD_MANWON,
  quickAddLabel,
} from "@/lib/prototype/plan-input";

interface AmountFieldProps {
  id: string;
  label: string;
  /** 만원 단위 입력 원문. 내부 정규화 값은 원 단위 정수다. (spec §8.5) */
  value: string;
  onValueChange: (raw: string) => void;
  errorMessage?: string | null;
  allowZero?: boolean;
  hint?: string;
  inputRef?: Ref<HTMLInputElement>;
}

/**
 * 만원 단위로 고정된 금액 입력. 단위 전환 탭과 소수 입력을 만들지 않고,
 * 전체 원 금액을 병기하며 빠른 금액 추가·실행 취소·금액 지우기를 제공한다. (spec §8.5)
 */
export function AmountField({
  id,
  label,
  value,
  onValueChange,
  errorMessage,
  allowZero = false,
  hint,
  inputRef,
}: AmountFieldProps) {
  const [history, setHistory] = useState<string[]>([]);

  const parsed = parseManwonInput(value, { allowZero: true });
  const conversionId = `${id}-conversion`;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [hint ? hintId : null, conversionId, errorMessage ? errorId : null]
    .filter((token): token is string => token !== null)
    .join(" ");

  function replaceValue(nextRaw: string) {
    setHistory((previous) => [...previous, value]);
    onValueChange(nextRaw);
  }

  function undo() {
    setHistory((previous) => {
      if (previous.length === 0) return previous;
      onValueChange(previous[previous.length - 1]);
      return previous.slice(0, -1);
    });
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          id={id}
          ref={inputRef}
          value={value}
          inputMode="numeric"
          autoComplete="off"
          aria-invalid={errorMessage ? true : undefined}
          aria-describedby={describedBy}
          onChange={(event) => onValueChange(event.target.value)}
          className="h-11 tabular-nums"
        />
        <span className="shrink-0 text-sm text-muted-foreground">만 원</span>
      </div>

      {hint ? (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}

      <p id={conversionId} className="text-xs text-muted-foreground tabular-nums">
        {parsed.ok && (parsed.won > 0 || allowZero)
          ? formatAmountConversion(parsed.won)
          : "금액을 입력하면 원 단위 환산 금액이 표시됩니다."}
      </p>

      <div className="flex flex-wrap gap-2">
        {QUICK_ADD_MANWON.map((manwon) => (
          <Button
            key={manwon}
            type="button"
            variant="outline"
            className="h-10"
            onClick={() => replaceValue(applyQuickAdd(value, manwon))}
          >
            {quickAddLabel(manwon)}
          </Button>
        ))}
        <Button
          type="button"
          variant="ghost"
          className="h-10"
          disabled={history.length === 0}
          onClick={undo}
        >
          실행 취소
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="h-10"
          disabled={value.length === 0}
          onClick={() => replaceValue("")}
        >
          금액 지우기
        </Button>
      </div>

      {errorMessage ? (
        <p id={errorId} role="alert" className="text-sm font-medium text-destructive">
          입력 오류: {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
