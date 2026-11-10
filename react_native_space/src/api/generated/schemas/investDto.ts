// @ts-nocheck
import type { InvestDtoOpportunityKey } from './investDtoOpportunityKey';

export interface InvestDto {
  opportunityKey: InvestDtoOpportunityKey;
  /** @minimum 10 */
  amount: number;
}
