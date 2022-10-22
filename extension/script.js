const instacart_product_page_regex = /(http|https):\/\/www.instacart.com\/store\/[^\/]+\/products\/[^\/]+/;

let food_data = {
  	name: null,
  	nutrition: {
		calories: null,
		fat: null,
		cholesterol: null,
		sodium: null,
		carbs: null,
		protein: null,
  	}
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.message === 'instacart_product_page') {
		setTimeout(run_instahealth, 2000);
	}
});

if (instacart_product_page_regex.test(document.location.href)) {
	run_instahealth();
}

function run_instahealth() {
	console.log("Running Instahealth . . .")
	let food_data = scrapeProductData();
	console.log(food_data);
}

function scrapeProductData() {
	// Name
	food_data.name = $(".css-16ptqna")[0].innerText;

	// Calories
	food_data.nutrition.calories = parseInt($(".css-dpfmh3-NutritionalFacts")[0].children[1].innerText.split(" ").slice(-1)[0]);

	// Other Nutrition Data
	$(".css-dpfmh3-NutritionalFacts").find(".css-2y6cy8-Category").each((idx, obj) => {
		let nutritionText = obj.children[0].innerText;
		let label = nutritionText.substring(0, nutritionText.lastIndexOf(" "));
		let value = nutritionText.substring(nutritionText.lastIndexOf(" ") + 1);
		switch(label) {
		case "Total Fat":
			food_data.nutrition.fat = value;
			break;
		case "Cholesterol":
			food_data.nutrition.cholesterol = value;
			break;
		case "Sodium":
			food_data.nutrition.sodium = value;
			break;
		case "Total Carbohydrate":
			food_data.nutrition.carbs = value;
			break;
		case "Protein":
			food_data.nutrition.protein = value;
			break;
		}
	})

	return food_data;
}