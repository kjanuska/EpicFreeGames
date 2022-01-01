import { get_next_time, send_message } from "./webhook.js";
import { CronJob, CronTime } from "cron";
import { NoGames } from "./errors.js";

let time;
async function get_new() {
  try {
    await send_message();
    time = get_next_time();
  } catch (err) {
    // if there are no free games wait until 12 PM EST the next Thursday
    if (err instanceof NoGames) {
      time = "* 12 * * 4";
    }
  }
}

await get_new();
console.log(`checking at ${time}`);
const timer = new CronJob(
  time,
  async () => {
    await get_new();
    timer.setTime(new CronTime(time));
    console.log(`checking at ${time}`);
    timer.start();
  },
  null,
  false,
  "America/Detroit"
);

timer.start();
