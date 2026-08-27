import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface SelectFieldOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  options: SelectFieldOption[];
  onValueChange: (value: string) => void;
  description?: string;
  className?: string;
}

/**
 * 선택형 입력. 모바일 폭에서 운영체제 기본 선택기를 그대로 쓰는 편이
 * 좁은 화면에서 가로 스크롤 없이 조작하기 쉬워 native `select`를 유지한다.
 * 선택 상태는 색상이 아니라 선택된 항목의 텍스트로 전달된다. (spec §8.6)
 */
export function SelectField({
  id,
  label,
  value,
  options,
  onValueChange,
  description,
  className,
}: SelectFieldProps) {
  const descriptionId = description ? `${id}-description` : undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        value={value}
        aria-describedby={descriptionId}
        onChange={(event) => onValueChange(event.target.value)}
        className="h-11 w-full rounded-lg border border-input bg-transparent px-2.5 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {description ? (
        <p id={descriptionId} className="text-xs text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}
