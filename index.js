import { getNextTime, sendMessage } from "./webhook.js";
import { CronJob, CronTime } from "cron";
import { NoGames } from "./errors.js";

const getNew = async () => {
	try {
		await sendMessage();
		time = await getNextTime();
	} catch (err) {
		// if there are no free games wait until 12 PM EST the next Thursday
		if (err instanceof NoGames) {
			time = "* 12 * * 4";
		}
	} 
}

getNextTime().then((time) => {
	console.log(`initialized and checking at ${time}`);
	const timer = new CronJob(
		time,
		async () => {
			await getNew();
			timer.setTime(new CronTime(time));
			console.log(`checking at ${time}`);
			timer.start();
		},
		null,
		false,
		"America/Detroit"
	);
	
	timer.start();
});