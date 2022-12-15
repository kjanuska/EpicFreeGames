import axios from "axios";

axios.defaults.headers.get["User-Agent"] =
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36";

const payload = { locale: "en-US", country: "US", allowCountries: "US" };

const check = async () => {
	try {
		var response = await axios.get(
			"https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions",
			{ params: payload }
		);
	} catch (err) {
		console.log(err);
	}
	let allGames = response.data["data"]["Catalog"]["searchStore"]["elements"];
	let games = [];
	allGames.forEach((game) => {
		if (game["promotions"] !== null) {
			if ("promotionalOffers" in game["promotions"]) {
				game["promotions"]["promotionalOffers"].some((promotion) => {
					let imageURL = null;
					if (
						promotion["promotionalOffers"][0]["discountSetting"][
							"discountPercentage"
						] === 0
					) {
						game["keyImages"].some((image) => {
							if (image["type"] === "Thumbnail" || 
								image["type"] === "VaultOpened" ||
								image["type"] === "DieselStoreFrontWide") {
								imageURL = image["url"];
								return true;
							}
						});
						const startDate = new Date(
							promotion["promotionalOffers"][0]["startDate"]
						);
						const endDate = new Date(
							promotion["promotionalOffers"][0]["endDate"]
						);
						games.push({
							title: game["title"],
							image: imageURL,
							description: game["description"],
							slug: game["productSlug"],
							start: Math.floor(startDate.getTime() / 1000),
							end: Math.floor(endDate.getTime() / 1000),
						});
					}
					return true;
				});
			}
		}
	});
	return games;
};

export default check;