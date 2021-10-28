import { SmartContractsApi, Configuration } from '@stacks/blockchain-api-client';
import {
  standardPrincipalCV,
  deserializeCV,
  UIntCV,
  TupleCV,
  OptionalCV,
  ClarityType,
  cvToHex,
} from 'micro-stacks/clarity';

const apiConfig = new Configuration({
  basePath: 'https://stacks-node-api.stacks.co',
});
const stacksApi = new SmartContractsApi(apiConfig);

type PoxStackerInfo = {
  'amount-ustx': UIntCV;
};

export async function getStackerData(stxAddress: string) {
  const res = await stacksApi.callReadOnlyFunction({
    contractAddress: 'SP000000000000000000002Q6VF78',
    contractName: 'pox',
    functionName: 'get-stacker-info',
    readOnlyFunctionArgs: {
      sender: 'SP000000000000000000002Q6VF78',
      arguments: [cvToHex(standardPrincipalCV(stxAddress))],
    },
  });

  if (res.result) {
    const cv: OptionalCV<TupleCV<PoxStackerInfo>> = deserializeCV(res.result.slice(2));
    if (cv.type === ClarityType.OptionalSome) return cv.value.data['amount-ustx'].value;
    return null;
  }
  console.error(res);
  throw new Error(res.cause);
}
