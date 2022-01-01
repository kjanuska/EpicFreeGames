import axios from "axios";
import check from "./check_games.js";
import Game from "./game.js";
import dotenv from 'dotenv'
dotenv.config()

axios.defaults.headers.post["Content-Type"] = "application/json";

function create_embed(game) {
    return {
        title : game.title,
        description : game.description,
        url : `https://www.epicgames.com/store/en-US/p/${game.slug}`,
        color : 0xffc0cb,
        fields: [
            {
              name: "Deal Length",
              value: `From <t:${game.begin}> to <t:${game.end}>`
            }
          ],
        image : {
            "url" : game.image
        }
    }
}

async function send_message() {
    let message = {
        content : null,
        embeds : []
    }
    const free_games = await check();
    free_games.forEach((game) => {
        message["embeds"].push(create_embed(game));
    });
    try {
        await axios.post(process.env.WEBHOOK, message);
    }
    catch(err) {
        console.log(err);
    }
}

send_message();