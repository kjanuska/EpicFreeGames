import axios from "axios";
import check from "./check_games.js";
import { NoGames } from "./errors.js";
import dotenv from "dotenv";
dotenv.config();

axios.defaults.headers.post["Content-Type"] = "application/json";

let freeGames = [];

const createEmbed = (game) => {
	return {
		title: game.title,
		description: game.description,
		url: `https://www.epicgames.com/store/en-US/p/${game.slug}`,
		color: 0x23272a,
		fields: [
			{
				name: "Deal Length",
				value: `From <t:${game.start}> to <t:${game.end}>`,
			},
		],
		image: {
			url: game.image,
		},
	};
};

export const getNextTime = async () => {
	if (freeGames.length == 0) {
		freeGames = await check();
	}
	const date = new Date(freeGames[0].end * 1000);
	date.setMinutes(date.getMinutes() + 30);
	return date;
};

export const sendMessage = async () => {
	let message = {
		content: null,
		embeds: [],
	};
	freeGames = await check();
	if (freeGames.length == 0) {
		message["content"] = "No free games";
		throw new NoGames();
	} else {
		message["embeds"].push({
			title: `Deals from <t:${freeGames[0].start}:D> to <t:${freeGames[0].end}:D>`,
			url: "https://www.epicgames.com/store/en-US/free-games",
			color: 0xfdfdfd,
		});
		freeGames.forEach((game) => {
			message["embeds"].push(createEmbed(game));
		});
	}
	try {
		await axios.post(process.env.WEBHOOK, message);
	} catch (err) {
		console.log(err);
	}
};