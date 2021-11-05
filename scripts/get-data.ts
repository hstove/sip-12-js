import 'cross-fetch/polyfill'
import { getVoteData } from '../src';

async function run() {
  const data = await getVoteData();
  console.log(data);
  console.log(data.votes);
}

run()
  .catch(console.error)
  .finally(() => {
    process.exit();
  });
