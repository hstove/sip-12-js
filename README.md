# `sip-12`

A simple TS / JS library for fetching vote data for [SIP 12](https://github.com/stacksgov/sips/pull/41).

## Setup

```bash
yarn add sip-12
# or npm
npm install --save sip-12
```

## Usage

### Get all vote data

```ts
import { getVoteData } from 'sip-12';
const data = await getVoteData();

// returns:
interface VoteData {
  votes: {
    support: Vote[];
    reject: Vote[];
  };
  totals: {
    support: bigint;
    reject: bigint;
  };
}
```

### Get BTC Vote transactions

```ts
import { getBTCVoteTransactions } from 'sip-12';

const approve = true;
const votes = await getBTCVoteTransactions(approve);

// returns:
interface VoteTransaction {
  stxAddress: string;
  txid: string;
  btcAddress: string;
  approve: boolean;
}
[];
```

### Get the amount of STX associated with a vote

The first input in the BTC transaction is either:

- The base58 version of a STX address (the stacker)
- The reward address of a stacker

The amount of STX associated with this address is fetched and added to a vote.

```ts
import { transformVote, transformVotes } from 'sip-12';

const voteTxs = await getBTCVoteTransactions(true);
const votes = await transformVotes(votes);

// or, for one vote
const vote = await transformVote(votes[0]);

// returns:
interface Vote extends VoteTransaction {
  amount: bigint;
}
```

### Get the BTC address used for voting

```ts
import { getVoteAddress, BTC_VOTE_ADDRESSES } from 'sip-12';

const yes = getVoteAddress(true);
// 111111111111111111112czxoHN
const no = getVoteAddress(false);
// 111111111111111111112kmzDG2

console.log(BTC_VOTE_ADDRESSES);
// { YES: yes, NO: no };
```
