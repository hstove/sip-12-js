import 'cross-fetch/polyfill'
import { getVoteData } from '../src';

async function run() {
  const data = await getVoteData();
  console.log(data);
}

run()
  .catch(console.error)
  .finally(() => {
    process.exit();
  });
