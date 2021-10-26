import { SmartContractsApi, Configuration } from '@stacks/blockchain-api-client';
import {
  serializeCV,
  standardPrincipalCV,
  deserializeCV,
  UIntCV,
  TupleCV,
  OptionalCV,
  ClarityType,
} from 'micro-stacks/clarity';

const apiConfig = new Configuration({
  basePath: 'https://stacks-node-api.stacks.co',
});
const stacksApi = new SmartContractsApi(apiConfig);

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

type PoxStackerInfo = {
  'amount-ustx': UIntCV;
};

export async function getStackerData(stxAddress: string) {
  const principalCV = standardPrincipalCV(stxAddress);
  const principal = Buffer.from(serializeCV(principalCV));
  const res = await stacksApi.callReadOnlyFunction({
    contractAddress: 'SP000000000000000000002Q6VF78',
    contractName: 'pox',
    functionName: 'get-stacker-info',
    readOnlyFunctionArgs: {
      sender: 'SP000000000000000000002Q6VF78',
      arguments: [principal.toString('hex')],
    },
  });

  if (res.result) {
    const cv: OptionalCV<TupleCV<PoxStackerInfo>> = deserializeCV(res.result.slice(2));
    if (cv.type === ClarityType.OptionalSome) {
      return cv.value.data['amount-ustx'].value;
    }
    return null;
  }
  console.error(res);
  throw new Error(res.cause);
}
