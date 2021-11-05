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

export interface StackerData {
  stackingTxs: StackingTxs;
  totalStacked: TotalStacked;
  blockRewards: BlockRewards;
}

export interface StackingTxs {
  nodes?: NodesEntity[] | null;
  aggregate: Aggregate;
}

export interface NodesEntity {
  txid: string;
  stx_address: string;
  amount: number;
  btc_address: string;
  num_cycles: number;
  last_cycle: number;
  is_delegator: boolean;
  first_cycle: number;
}

export interface Aggregate {
  sum: Sum;
}

export interface Sum {
  amount: number;
}

export interface TotalStacked {
  aggregate: Aggregate;
}

export interface BlockRewards {
  aggregate: Aggregate1;
  nodes?: NodesEntity1[] | null;
}

export interface Aggregate1 {
  count: number;
  avg: AvgOrSum;
  sum: AvgOrSum;
}

export interface AvgOrSum {
  reward_amount: number;
}

export interface NodesEntity1 {
  reward_amount: number;
  reward_index: number;
  burn_block_height: number;
  burn_block_hash: string;
  recipient_address: string;
}
