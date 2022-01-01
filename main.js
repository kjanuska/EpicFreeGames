import send_message from "./webhook.js";
import cron from "node-cron";

let task = cron.schedule('* 12 * * Thursday', async () => {
    console.log("12:00 PM EST Thursday");
    await send_message();
}, {
    timezone: 'America/Detroit'
});

task.start();