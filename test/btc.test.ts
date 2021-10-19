import { TextDecoder } from 'util';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
global.TextDecoder = TextDecoder;
import fetchMock from 'fetch-mock-jest';
import { btcToStxAddress, voteTransactionsUrl, getBTCVoteTransactions } from '../src';
import { NO_VOTE_TXS, YES_VOTE_TXS } from './mocks';

test('converting btc address', () => {
  const btc = '31tXY8LMEcc3YzWwpFQj7ZGYE2U2BM1kk4';
  const stx = 'SM12TJXJEQQER0EWX6783RWH1R8YZG3M9SBQVDFH';
  const converted = btcToStxAddress(btc);
  expect(converted).toEqual(stx);
});

describe('getting vote transactions', () => {
  const yesUrl = voteTransactionsUrl(true);
  const noUrl = voteTransactionsUrl(false);

  beforeAll(() => {
    fetchMock.get(yesUrl, YES_VOTE_TXS);
    fetchMock.get(noUrl, NO_VOTE_TXS);
  });

  test('can get votes', async () => {
    const voteTxs = await getBTCVoteTransactions(true);
    console.log('voteTxs', voteTxs);

    const noVotes = await getBTCVoteTransactions(false);
    console.log('noVotes', noVotes);
  });
});
