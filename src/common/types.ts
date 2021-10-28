export interface VoteTransaction {
  stxAddress: string;
  txid: string;
  btcAddress: string;
  approve: boolean;
}

export interface Vote extends VoteTransaction {
  amount: string;
}

export interface VoteData {
  votes: {
    support: Vote[];
    reject: Vote[];
  };
  totals: {
    support: string;
    reject: string;
  };
}
