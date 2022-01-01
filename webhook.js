import axios from "axios";
import check from "./check_games.js";
import { NoGames } from "./errors.js";
import dotenv from "dotenv";
dotenv.config();

axios.defaults.headers.post["Content-Type"] = "application/json";

let free_games;

function create_embed(game) {
  return {
    title: game.title,
    description: game.description,
    url: `https://www.epicgames.com/store/en-US/p/${game.slug}`,
    color: 0x23272a,
    fields: [
      {
        name: "Deal Length",
        value: `From <t:${game.begin_unix}> to <t:${game.end_unix}>`,
      },
    ],
    image: {
      url: game.image,
    },
  };
}

export function get_next_time() {
  return free_games[0].next;
}

export async function send_message() {
  let message = {
    content: null,
    embeds: [],
  };
  free_games = await check();
  if (free_games.length == 0) {
    message["content"] = "No free games";
    throw new NoGames();
  } else {
    message["embeds"].push({
      title: `Deals from <t:${free_games[0].begin_unix}:D> to <t:${free_games[0].end_unix}:D>`,
      url: "https://www.epicgames.com/store/en-US/free-games",
      color: 0xfdfdfd,
    });
    free_games.forEach((game) => {
      message["embeds"].push(create_embed(game));
    });
  }
  try {
    await axios.post(process.env.WEBHOOK, message);
  } catch (err) {
    console.log(err);
  }
}
