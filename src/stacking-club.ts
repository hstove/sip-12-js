export interface StackerData {
  stackingTxs: {
    aggregate: {
      sum: {
        amount: number | null;
      };
    };
  };
}

export const CYCLE = 20;

export function stackingClubUrl(btcAddress: string) {
  const url = `https://api.stacking-club.com/api/stacker-data?variables=${btcAddress}____${CYCLE}`;
  return url;
}

export async function getRewardData(btcAddress: string) {
  const url = stackingClubUrl(btcAddress);
  const res = await fetch(url);
  const stackerData: StackerData = await res.json();
  const { amount } = stackerData.stackingTxs.aggregate.sum;
  return amount ? BigInt(amount) : null;
}
