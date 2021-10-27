import { Vote, VoteTransaction } from './types';
import { getRewardData, getStackerData } from './stacking-club';

export async function transformVote(vote: VoteTransaction): Promise<Vote> {
  const [reward, stacker] = await Promise.all([
    getRewardData(vote.btcAddress),
    getStackerData(vote.stxAddress),
  ]);

  let amount = 0n;
  if (reward) amount = reward;
  if (stacker) amount = stacker;

  return {
    ...vote,
    amount: amount.toString(10),
  };
}

export async function transformVotes(votes: VoteTransaction[]): Promise<Vote[]> {
  return Promise.all(votes.map(transformVote));
}
