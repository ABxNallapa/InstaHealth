import { Chart, registerables } from "./lib/dist/chart.js";

let queryOptions = { active: true, lastFocusedWindow: true };
chrome.tabs.query(queryOptions).then(([tab]) => {
    if (tab) {
        chrome.runtime.sendMessage({
            message: 'request_percent_data',
            tabId: tab.id,
        }, (response) => {
            updateUI(response.percent_data, response.food_data)
        });
    }
});

let icon = document.getElementById("icon");
icon.src = chrome.runtime.getURL("res/icon.png");

function updateUI(percent_data, food_data) {
  Chart.register(...registerables);

  if (percent_data && food_data) {
    let total_percent_data = percent_data["total"];
    let per_serv_percent_dict = percent_data["per_serving"];

    document.getElementById("product_view").style.display = "block";
    document.getElementById("default_view").style.display = "none";
    
    document.getElementById("name").innerText = food_data.name
    document.getElementById("servings").innerText = food_data.nutrition.servings
    document.getElementById("caloriePercent").innerText = Math.round(total_percent_data["calories"]*1000)/10 + "%";
    document.getElementById("proteinPercent").innerText = Math.round(total_percent_data["protein"]*1000)/10 + "%";
    document.getElementById("carbPercent").innerText = Math.round(total_percent_data["carbohydrates"]*1000)/10 + "%";
    document.getElementById("fatPercent").innerText = Math.round(total_percent_data["fat"]*1000)/10 + "%";
    const calorieChart = createChart("calorieChart", total_percent_data["calories"], "rgb(255, 99, 132)", `Calories (${food_data.nutrition.calories*food_data.nutrition.servings})`);
    const proteinChart = createChart("proteinChart", total_percent_data["protein"], "rgb(255, 99, 132)", `Protein (${food_data.nutrition.protein*food_data.nutrition.servings}g)`);
    const carbChart = createChart("carbChart", total_percent_data["carbohydrates"], "rgb(255, 99, 132)", `Carbs (${food_data.nutrition.carbohydrates*food_data.nutrition.servings}g)`);
    const fatChart = createChart("fatChart", total_percent_data["fat"], "rgb(255, 99, 132)", `Fat (${food_data.nutrition.fat*food_data.nutrition.servings}g)`);

    document.getElementById("caloriePercentServing").innerText = Math.round(per_serv_percent_dict["calories"]*1000)/10 + "%";
    document.getElementById("proteinPercentServing").innerText = Math.round(per_serv_percent_dict["protein"]*1000)/10 + "%";
    document.getElementById("carbPercentServing").innerText = Math.round(per_serv_percent_dict["carbohydrates"]*1000)/10 + "%";
    document.getElementById("fatPercentServing").innerText = Math.round(per_serv_percent_dict["fat"]*1000)/10 + "%";
    const calorieChartServing = createChart("calorieChartServing", per_serv_percent_dict["calories"], "rgb(255, 99, 132)", `Calories (${food_data.nutrition.calories})`);
    const proteinChartServing = createChart("proteinChartServing", per_serv_percent_dict["protein"], "rgb(255, 99, 132)", `Protein (${food_data.nutrition.protein}g)`);
    const carbChartServing = createChart("carbChartServing", per_serv_percent_dict["carbohydrates"], "rgb(255, 99, 132)", `Carbs (${food_data.nutrition.carbohydrates}g)`);
    const fatChartServing = createChart("fatChartServing", per_serv_percent_dict["fat"], "rgb(255, 99, 132)", `Fat (${food_data.nutrition.fat}g)`);
  } else {
    fetch("http://localhost:5000/pull_goals").then((response) => {
      response.json().then((goals_data) => {
        document.getElementById("caloriesGoal").innerText = goals_data["calories"];
        document.getElementById("carbsGoal").innerText = goals_data["carbohydrates"] + "g";
        document.getElementById("proteinGoal").innerText = goals_data["protein"] + "g";
        document.getElementById("fatGoal").innerText = goals_data["fat"] + "g";
      });
    });
  }
}

function createChart(id, percent, color, category) {
  let canvas = document.getElementById(id);
  const labels = [category, ""];
  const data = {
    labels: labels,
    datasets: [
      {
        backgroundColor: [color, "rgb(192, 192, 192)"],
        borderColor: "rgb(255, 255, 255)",
        borderWidth: 2,
        cutout: "50%",
        hoverOffset: 10,
        hoverBorderWidth: 6,
        data: percent >= 1 ? [100, 0] : [percent * 100, 100 - percent * 100],
        // percent is percent from python dict returned from calculate_percent()
      },
    ],
  };
  const config = {
    type: "doughnut",
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: category,
        },
      },
    },
  };
  return new Chart(canvas, config);
}
