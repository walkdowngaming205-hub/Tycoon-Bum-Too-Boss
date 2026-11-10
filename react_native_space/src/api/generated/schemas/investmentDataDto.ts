// @ts-nocheck
import type { InvestmentDataDtoStatus } from './investmentDataDtoStatus';

export interface InvestmentDataDto {
  id: number;
  opportunityKey: string;
  amount: number;
  researched: boolean;
  /** @nullable */
  sentiment: string | null;
  status: InvestmentDataDtoStatus;
  /** @nullable */
  multiplier: number | null;
  /** @nullable */
  payout: number | null;
  maturesAt: string;
  createdAt: string;
}
