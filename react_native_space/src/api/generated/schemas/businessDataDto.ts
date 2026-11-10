// @ts-nocheck

export interface BusinessDataDto {
  id: number;
  businessType: string;
  level: number;
  employees: number;
  /** @nullable */
  customName: string | null;
  /** @nullable */
  incomeBoostUntil: string | null;
  purchasedAt: string;
  incomePerSecond: number;
  grossPerSecond: number;
  expensesPerSecond: number;
  /** @nullable */
  upgradeCost: number | null;
  /** @nullable */
  hireCost: number | null;
  value: number;
}
