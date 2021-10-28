export const YES_ADDRESS = '111111111111111111112czxoHN';
export const NO_ADDRESS = '111111111111111111112kmzDG2';
export const BTC_VOTE_ADDRESSES = {
  YES: YES_ADDRESS,
  NO: NO_ADDRESS,
} as const;
export type BTC_VOTE_ADDRESS = keyof typeof BTC_VOTE_ADDRESSES;
export const CYCLE = 20;
