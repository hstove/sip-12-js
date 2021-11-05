import { VoteTransaction } from './types';

async function fetchFromSip12Endpoint(btc_address: string, stx_address: string) {
  try {
    const res = await fetch(
      `https://api.stacking.club/api/sip-12?btc_address=${btc_address}&stx_address=${stx_address}`
    );
    const data = await res.json();
    const amount = data?.amount?.amount;
    if (amount) return BigInt(amount);
  } catch (e) {
    console.error(e);
  }
  return null;
}

export async function getStackedAmount(vote: VoteTransaction) {
  return fetchFromSip12Endpoint(vote.btcAddress, vote.stxAddress);
}
