import axios from "axios";
import Game from "./game.js";

axios.defaults.headers.get['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36';

const payload = {locale:'en-US', country:'US', allowCountries:'US'};

async function check()
{
    try
    {
        var response = await axios.get('https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions', { params: payload});
    }
    catch(err)
    {
        console.log(err);
    }
    let all_games = response.data['data']['Catalog']['searchStore']['elements'];
    let games = [];
    all_games.array.forEach(game => {
        if (game["promotions"] === null)
        {
            continue;
        }
        
    });
}

check();