// @ts-nocheck

export type InvestmentDataDtoStatus = typeof InvestmentDataDtoStatus[keyof typeof InvestmentDataDtoStatus];


export const InvestmentDataDtoStatus = {
  active: 'active',
  won: 'won',
  lost: 'lost',
} as const;
