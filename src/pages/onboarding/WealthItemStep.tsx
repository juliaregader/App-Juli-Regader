import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { formatCurrency } from "@/lib/format/currency";

export interface DisplayItem {
  id: string;
  name: string;
  categoryLabel: string;
  amount: number;
  currency: string;
  extraNote?: string;
}

export interface CategoryOption {
  value: string;
  label: string;
}

export interface ExtraNumberInput {
  key: string;
  label: string;
}

interface WealthItemStepProps {
  heading: string;
  description: string;
  nameLabel: string;
  categoryLabel: string;
  amountLabel: string;
  categoryOptions: CategoryOption[];
  currency: string;
  items: DisplayItem[];
  isLoading: boolean;
  isSubmitting: boolean;
  onAdd: (input: {
    name: string;
    category: string;
    amount: number;
    extras: Record<string, number | undefined>;
  }) => void;
  onDelete: (id: string) => void;
  onBack?: () => void;
  onNext: () => void;
  extraNumberInputs?: ExtraNumberInput[];
}

export function WealthItemStep({
  heading,
  description,
  nameLabel,
  categoryLabel,
  amountLabel,
  categoryOptions,
  currency,
  items,
  isLoading,
  isSubmitting,
  onAdd,
  onDelete,
  onBack,
  onNext,
  extraNumberInputs,
}: WealthItemStepProps) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [category, setCategory] = useState(categoryOptions[0]?.value ?? "");
  const [amount, setAmount] = useState("");
  const [extraValues, setExtraValues] = useState<Record<string, string>>({});

  const total = items.reduce((sum, item) => sum + item.amount, 0);

  const handleAdd = () => {
    const parsedAmount = Number(amount);
    if (!name.trim() || !Number.isFinite(parsedAmount) || parsedAmount < 0) return;
    const extras = Object.fromEntries(
      Object.entries(extraValues).map(([key, value]) => [
        key,
        value.trim() === "" ? undefined : Number(value),
      ]),
    );
    onAdd({ name: name.trim(), category, amount: parsedAmount, extras });
    setName("");
    setAmount("");
    setExtraValues({});
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-content">{heading}</h2>
        <p className="mt-1 text-sm text-content-muted">{description}</p>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface-subtle p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
          <input
            type="text"
            aria-label={nameLabel}
            placeholder={nameLabel}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          />
          <select
            aria-label={categoryLabel}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            aria-label={amountLabel}
            placeholder={amountLabel}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-32 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-brand-900 px-3 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Plus className="size-4" aria-hidden="true" />
            {t("onboarding.common.add")}
          </button>
        </div>
        {extraNumberInputs?.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {extraNumberInputs.map((field) => (
              <input
                key={field.key}
                type="number"
                inputMode="decimal"
                step="0.01"
                aria-label={field.label}
                placeholder={field.label}
                value={extraValues[field.key] ?? ""}
                onChange={(e) =>
                  setExtraValues((prev) => ({ ...prev, [field.key]: e.target.value }))
                }
                className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        {isLoading ? null : items.length === 0 ? (
          <p className="text-sm text-content-muted">{t("onboarding.common.empty")}</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-2.5"
            >
              <div>
                <p className="text-sm font-medium text-content">{item.name}</p>
                <p className="text-xs text-content-muted">
                  {item.categoryLabel}
                  {item.extraNote ? ` · ${item.extraNote}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold tabular-nums text-content">
                  {formatCurrency(item.amount, item.currency)}
                </span>
                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  className="text-content-muted hover:text-red-600"
                  aria-label={t("onboarding.common.remove")}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))
        )}

        {items.length > 0 ? (
          <div className="flex items-center justify-between border-t border-border px-4 pt-3 text-sm font-semibold text-content">
            <span>{t("onboarding.common.total")}</span>
            <span className="tabular-nums">{formatCurrency(total, currency)}</span>
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between pt-2">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-content-muted hover:text-content"
          >
            {t("onboarding.common.back")}
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={onNext}
          className="rounded-lg bg-brand-900 px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          {t("onboarding.common.next")}
        </button>
      </div>
    </div>
  );
}
