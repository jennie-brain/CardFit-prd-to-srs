"use client";

import { useLayoutEffect, useRef, useState, type RefObject } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatAmountConversion } from "@/lib/prototype/format";
import {
  applyQuickAdd,
  caretIndexAfterDigits,
  formatManwonInputDisplay,
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
  inputRef?: RefObject<HTMLInputElement | null>;
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
  const fallbackRef = useRef<HTMLInputElement>(null);
  const elementRef = inputRef ?? fallbackRef;
  /** 구분자 삽입 후 되돌릴 caret 위치를 "앞에 있던 숫자 개수"로 기억한다. */
  const pendingCaretDigits = useRef<number | null>(null);

  const displayValue = formatManwonInputDisplay(value);
  const parsed = parseManwonInput(value, { allowZero: true });
  const conversionId = `${id}-conversion`;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [hint ? hintId : null, conversionId, errorMessage ? errorId : null]
    .filter((token): token is string => token !== null)
    .join(" ");

  // 구분자를 다시 넣은 값이 렌더된 뒤 caret을 사용자가 보던 자리로 돌려놓는다.
  useLayoutEffect(() => {
    const element = elementRef.current;
    if (element === null || pendingCaretDigits.current === null) return;
    const position = caretIndexAfterDigits(element.value, pendingCaretDigits.current);
    pendingCaretDigits.current = null;
    element.setSelectionRange(position, position);
  });

  function handleChange(nextRaw: string, caret: number | null) {
    // 구분자를 실제로 넣거나 뺀 경우에만 caret을 되돌린다. 표시값이 사용자가 방금 입력한
    // 문자열과 같으면 브라우저 caret이 이미 맞으므로 건드리면 오히려 문자 순서가 뒤집힌다
    // (`-5` → `5-`, `12만원` → `12원만`).
    if (formatManwonInputDisplay(nextRaw) === nextRaw) {
      pendingCaretDigits.current = null;
    } else {
      pendingCaretDigits.current = nextRaw
        .slice(0, caret ?? nextRaw.length)
        .replace(/\D/g, "").length;
    }
    onValueChange(nextRaw);
  }

  function replaceValue(nextRaw: string) {
    setHistory((previous) => [...previous, value]);
    pendingCaretDigits.current = null;
    onValueChange(nextRaw);
  }

  function undo() {
    if (history.length === 0) return;
    pendingCaretDigits.current = null;
    onValueChange(history[history.length - 1]);
    setHistory((previous) => previous.slice(0, -1));
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          id={id}
          ref={elementRef}
          value={displayValue}
          inputMode="numeric"
          autoComplete="off"
          aria-invalid={errorMessage ? true : undefined}
          aria-describedby={describedBy}
          onChange={(event) => handleChange(event.target.value, event.target.selectionStart)}
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
          disabled={displayValue.length === 0}
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
