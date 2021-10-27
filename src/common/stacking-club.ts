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
  return `https://api.stacking-club.com/api/stacker-data?variables=${btcAddress}____${CYCLE}`;
}

export async function getRewardData(btcAddress: string) {
  const res = await fetch(stackingClubUrl(btcAddress));
  const stackerData: StackerData = await res.json();
  const { amount } = stackerData.stackingTxs.aggregate.sum;
  return amount ? BigInt(amount) : null;
}
