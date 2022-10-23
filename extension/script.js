const instacart_product_page_regex = /(http|https):\/\/www.instacart.com\/store\/[^\/]+\/products\/[^\/]+/;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.message === 'instacart_product_page') {
		setTimeout(run_instahealth, 2000);
	}
});

if (instacart_product_page_regex.test(document.location.href)) {
	run_instahealth();
}

function run_instahealth() {
	console.log("Running Instahealth (Scraping). . .")
	let food_data = scrapeProductData();
	console.log(food_data)
	if (!food_data.nutrition) {
		console.log("Running Instahealth (Fetching Nutrition Data). . .")
		fetchNutritionData(food_data.name).then((nutrition_data) => {
			console.log(nutrition_data);
			food_data.nutrition = nutrition_data;
			console.log("Running Instaheath (Fetching Percent Data). . .")
			fetchPercentData(food_data).then((percent_data) => {
				console.log(percent_data)
				console.log("Running Instaheath (Saving Percent Data). . .")
				savePercentData(percent_data);
			})
		})
	} else {
		console.log("Running Instaheath (Fetching Percent Data). . .")
		fetchPercentData(food_data).then((percent_data) => {
			console.log(percent_data);
			console.log("Running Instaheath (Updating UI). . .")
			savePercentData(percent_data);
		})
	}
}

// function scrapeProductData() {
// 	let name = document.evaluate("//*[@id=\"item_details\"]/div[2]/div[2]/div[1]/h2/span", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText;
// 	let calories = document.evaluate("//*[@id=\"item_details\"]/div[5]/div[2]/div/ul[1]/li[2]/span", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText;
// 	calories = calories.slice(10);
// 	let carbohydrates = document.evaluate("//*[@id=\"item_details\"]/div[5]/div[2]/div/ul[2]/li[5]/ul/li[1]/span[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText;
// 	carbohydrates = carbohydrates.slice(19, carbohydrates.length - 1);
// 	let fat = document.evaluate("//*[@id=\"item_details\"]/div[5]/div[2]/div/ul[2]/li[2]/ul/li[1]/span[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText;
// 	fat = fat.slice(11, fat.length - 1);
// 	let protein = document.evaluate("//*[@id=\"item_details\"]/div[5]/div[2]/div/ul[2]/li[6]/span[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText;
// 	protein = protein.slice(8, protein.length - 1);
// 	let sodium = document.evaluate("//*[@id=\"item_details\"]/div[5]/div[2]/div/ul[2]/li[4]/span[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText;
// 	sodium = sodium.slice(8, sodium.length - 2);


// 	let food_data = {
// 		name: name,
// 		nutrition: {
// 			calories: calories,
// 			fat: fat,
// 			cholesterol: cholesterol,
// 			sodium: sodium,
// 			carbs: carbohydrates,
// 			protein: protein,
// 		}
// 	}
  
// 	return food_data;
// }

function scrapeProductData() {
	let food_data = {
		name: null,
		nutrition: {
			servings: 1,
			calories: null,
			carbohydrates: null,
			fat: null,
			protein: null,
			sodium: null,
			sugar: 0,
		}
	}

	// Name
	food_data.name = $(".css-16ptqna")[0].innerText;

	// Nutrition Data
	try {
		food_data.nutrition.calories = parseInt($(".css-dpfmh3-NutritionalFacts")[0].children[1].innerText.split(" ").slice(-1)[0]);

		$(".css-dpfmh3-NutritionalFacts").find(".css-2y6cy8-Category").each((idx, obj) => {
			let nutritionText = obj.children[0].innerText;
			let label = nutritionText.substring(0, nutritionText.lastIndexOf(" "));
			let value = parseInt(nutritionText.substring(nutritionText.lastIndexOf(" ") + 1));
			switch(label) {
				case "Total Carbohydrate":
					food_data.nutrition.carbohydrates = value;
					break;
				case "Total Fat":
					food_data.nutrition.fat = value;
					break;
				case "Protein":
					food_data.nutrition.protein = value;
					break;
				case "Sodium":
					food_data.nutrition.sodium = value;
					break;
			}
		})
	} catch (error) {
		food_data.nutrition = null;
	}

	return food_data;
}

async function fetchNutritionData(food_name) {
	let response = await fetch("http://localhost:5000/pull_data?" + new URLSearchParams({
		search: food_name
	}));

	return await response.json()
}

async function fetchPercentData(food_data) {
	let response = await fetch("http://localhost:5000/calculate_percent", {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			servings: food_data.nutrition.servings,
			calories: food_data.nutrition.calories,
			carbohydrates: food_data.nutrition.carbohydrates,
			fat: food_data.nutrition.fat,
			protein: food_data.nutrition.protein,
			sodium: food_data.nutrition.sodium,
			sugar: food_data.nutrition.sugar,
		})
	});

	return await response.json();
}

function savePercentData(percent_data) {
	chrome.runtime.sendMessage({
		message: 'new_percent_data',
		data: percent_data,
	});
}
