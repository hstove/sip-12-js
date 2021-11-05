import { TextDecoder, TextEncoder } from 'util';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;
import fetchMock from 'fetch-mock-jest';
import { makeStackerInfoResponse, NO_VOTE_TXS, YES_VOTE_TXS } from './mocks';
import { btcToStxAddress, voteTransactionsUrl } from '../src/common/utils';
import { getBTCVoteTransactions } from '../src/get-btc-vote-txs';
import { getVoteData } from '../src/get-vote-data';

test('converting btc address', () => {
  const btc = '31tXY8LMEcc3YzWwpFQj7ZGYE2U2BM1kk4';
  const stx = 'SM12TJXJEQQER0EWX6783RWH1R8YZG3M9SBQVDFH';
  const converted = btcToStxAddress(btc);
  expect(converted).toEqual(stx);
});

const yesUrl = voteTransactionsUrl(true);
const noUrl = voteTransactionsUrl(false);

const lastYes = YES_VOTE_TXS[YES_VOTE_TXS.length - 1].txid;
const lastNo = NO_VOTE_TXS[NO_VOTE_TXS.length - 1].txid;

describe('getting vote transactions', () => {
  beforeAll(() => {
    fetchMock.mockReset();
    fetchMock.get(yesUrl, YES_VOTE_TXS);
    fetchMock.get(noUrl, NO_VOTE_TXS);
    fetchMock.get(`${yesUrl}${lastYes}`, []);
    fetchMock.get(`${noUrl}${lastNo}`, []);
  });

  test('can get votes', async () => {
    const voteTxs = await getBTCVoteTransactions(true);
    expect(voteTxs.length).toEqual(0);

    const noVotes = await getBTCVoteTransactions(false);
    expect(noVotes.length).toEqual(0);
  });
});

test.only('can get full data', async () => {
  fetchMock.mockReset();
  fetchMock.get(yesUrl, YES_VOTE_TXS);
  fetchMock.get(noUrl, NO_VOTE_TXS);
  fetchMock.get(`${yesUrl}${lastYes}`, []);
  fetchMock.get(`${noUrl}${lastNo}`, []);

  fetchMock.post('begin:https://stacks-node-api', (url, request) => {
    const body = JSON.parse(request.body as string);
    if (body.arguments[0].startsWith('0x0514')) {
      return makeStackerInfoResponse(1000n);
    }
    return makeStackerInfoResponse(null);
  });

  const data = await getVoteData();
  expect(data.totals.support).toEqual('1000');
  expect(data.totals.reject).toEqual('200');
});
