import axios from "axios";
import fs from "fs";

const check = async () => {
	try {
		var response = await axios.get(
			"https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions",
			{
				params: { locale: "en-US", country: "US", allowCountries: "US" },
				headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36" }
			}
		);
	} catch (err) {
		console.log(err);
	}

	let allGames = response.data["data"]["Catalog"]["searchStore"]["elements"];
	let games = [];
	allGames.forEach((game) => {
		if (game["promotions"] === null) {
			return;
		}
		if (!("promotionalOffers" in game["promotions"])) {
			return;
		}

		// some() is used here to break out of the loop once the discount is found
		game["promotions"]["promotionalOffers"].some((promotion) => {
			const discountIndex = promotion["promotionalOffers"].findIndex((offer) => {
				return offer["discountSetting"]["discountPercentage"] === 0;
			});

			if (discountIndex === -1) {
				return false;
			}

			let imageURL = "https://placehold.jp/600x800.png";

			// flatten images object to make it easier to find thumbnail
			const images = {};
			game["keyImages"].forEach((image) => {
				images[image["type"]] = image["url"];
			});

			// prioritize taller images over wider ones
			const imagePriority = ["Thumbnail", "DieselStoreFrontTall", "OfferImageTall", "VaultOpened", "DieselStoreFrontWide"]
			imagePriority.some((image) => {
				if (image in images) {
					imageURL = images[image];
					return true;
				}
				return false;
			});

			const startDate = new Date(
				promotion["promotionalOffers"][discountIndex]["startDate"]
			);
			const endDate = new Date(
				promotion["promotionalOffers"][discountIndex]["endDate"]
			);
			games.push({
				title: game["title"],
				image: imageURL,
				description: game["description"],
				slug: game["productSlug"],
				start: Math.floor(startDate.getTime() / 1000),
				end: Math.floor(endDate.getTime() / 1000),
			});
			return true;
		});
	});
	return games;
};

export default check;