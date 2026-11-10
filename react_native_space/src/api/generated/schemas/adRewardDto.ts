// @ts-nocheck
import type { AdRewardDtoOpportunityKey } from './adRewardDtoOpportunityKey';
import type { AdRewardDtoRewardType } from './adRewardDtoRewardType';

export interface AdRewardDto {
  rewardType: AdRewardDtoRewardType;
  targetBusinessId?: number;
  opportunityKey?: AdRewardDtoOpportunityKey;
}
