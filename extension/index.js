import { Chart, registerables } from "./lib/dist/chart.js";

let queryOptions = { active: true, lastFocusedWindow: true };
chrome.tabs.query(queryOptions).then(([tab]) => {
    if (tab) {
        chrome.action.setBadgeText({tabId: tab.id, text: ""});
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
        document.getElementById("name").innerText = food_data.name
        document.getElementById("caloriePercent").innerText = Math.round(percent_data["calories"]*1000)/10 + "%";
        document.getElementById("proteinPercent").innerText = Math.round(percent_data["protein"]*1000)/10 + "%";
        document.getElementById("carbPercent").innerText = Math.round(percent_data["carbohydrates"]*1000)/10 + "%";
        document.getElementById("fatPercent").innerText = Math.round(percent_data["fat"]*1000)/10 + "%";
        const calorieChart = createChart("calorieChart", percent_data["calories"], "rgb(255, 99, 132)", `Calories (${food_data.nutrition.calories})`);
        const proteinChart = createChart("proteinChart", percent_data["protein"], "rgb(255, 99, 132)", `Protein (${food_data.nutrition.protein}g)`);
        const carbChart = createChart("carbChart", percent_data["carbohydrates"], "rgb(255, 99, 132)", `Carbs (${food_data.nutrition.carbohydrates}g)`);
        const fatChart = createChart("fatChart", percent_data["fat"], "rgb(255, 99, 132)", `Fat (${food_data.nutrition.fat}g)`);
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
        data: [percent * 100, 100 - percent * 100],
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
