import { TextDecoder, TextEncoder } from 'util';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;
import fetchMock from 'fetch-mock-jest';
import 'cross-fetch/polyfill';
import { getStackerData } from '../src/common/pox';
import { makeStackerDataResponse, makeStackerInfoResponse } from './mocks';

test.skip('testing pox data', async () => {
  const result = await getStackerData('SMJ2T5JRTD9XV9KF8MA1YBX71TNKJJ0M73HDDAZ9');
  console.log('result', result);
}, 60000);

test.skip('getting stacks address information', async () => {
  fetchMock.postOnce('begin:https://stacks-node-api', makeStackerInfoResponse(2000n));
  expect(await getStackerData('SMJ2T5JRTD9XV9KF8MA1YBX71TNKJJ0M73HDDAZ9')).toEqual(2000n);

  fetchMock.postOnce('begin:https://stacks-node-api', makeStackerInfoResponse(null), {
    overwriteRoutes: true,
  });
  expect(await getStackerData('SMJ2T5JRTD9XV9KF8MA1YBX71TNKJJ0M73HDDAZ9')).toEqual(null);

  fetchMock.getOnce('begin:https://api.stacking-club', makeStackerDataResponse(null));

  fetchMock.getOnce('begin:https://api.stacking-club', makeStackerDataResponse(4000), {
    overwriteRoutes: true,
  });
});
