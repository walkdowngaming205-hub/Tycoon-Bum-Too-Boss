// @ts-nocheck
import type { SpendBossCoinsDtoItemKey } from './spendBossCoinsDtoItemKey';

export interface SpendBossCoinsDto {
  itemKey: SpendBossCoinsDtoItemKey;
  targetBusinessId?: number;
  /**
     * @minLength 1
     * @maxLength 30
     */
  newName?: string;
}
